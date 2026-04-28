import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { createHmac, timingSafeEqual } from "crypto";

type CallbackStatus = "granted" | "denied" | "revoked" | "expired";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-abdm-signature") ?? "";
    const secret = process.env.ABDM_WEBHOOK_SECRET ?? "";
    const raw = await req.text();
    if (!secret) {
      return NextResponse.json({ error: "ABDM_WEBHOOK_SECRET missing" }, { status: 500 });
    }
    if (!signature) {
      return NextResponse.json({ error: "missing signature header" }, { status: 401 });
    }
    const expected = createHmac("sha256", secret).update(raw).digest("hex");
    const ok = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    if (!ok) {
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
    const tsHeader = req.headers.get("x-abdm-timestamp");
    if (!tsHeader || !/^\d+$/.test(tsHeader)) {
      return NextResponse.json({ error: "missing/invalid timestamp header" }, { status: 401 });
    }
    const ts = Number(tsHeader);
    const maxSkewMs = Number(process.env.ABDM_WEBHOOK_MAX_SKEW_MS ?? 5 * 60 * 1000);
    if (Math.abs(Date.now() - ts) > maxSkewMs) {
      return NextResponse.json({ error: "stale callback timestamp" }, { status: 401 });
    }

    const body = JSON.parse(raw) as {
      uid: string;
      requestId: string;
      consentId?: string;
      status: CallbackStatus;
      gatewayRef?: string;
      expiresAt?: number;
    };

    if (!body.uid || !body.requestId || !body.status) {
      return NextResponse.json({ error: "uid, requestId, status required" }, { status: 400 });
    }

    const db = getAdminDb();
    const replayRef = db.collection("abdm_callback_replay_guard").doc(`${body.requestId}:${body.status}:${ts}`);
    const replaySnap = await replayRef.get();
    if (replaySnap.exists) {
      return NextResponse.json({ ok: true, replay: true });
    }
    await replayRef.set({ createdAt: Date.now() });

    const ref = db.collection("users").doc(body.uid).collection("abdm_consents").doc(body.requestId);
    const now = Date.now();

    await ref.set(
      {
        callbackReceivedAt: now,
        status: body.status === "granted" ? "active" : body.status,
        consentId: body.consentId ?? body.requestId,
        gatewayRef: body.gatewayRef ?? null,
        expiresAt: body.expiresAt ?? null,
        updatedAt: now,
      },
      { merge: true }
    );

    await db.collection("audits").add({
      createdAt: now,
      action: "abdm_consent_callback",
      uid: body.uid,
      requestId: body.requestId,
      status: body.status,
      consentId: body.consentId ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
