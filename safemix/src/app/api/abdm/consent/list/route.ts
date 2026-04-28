import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  try {
    let actorUid: string | null = null;
    let actorRole: string | null = null;
    const authz = req.headers.get("authorization") ?? "";
    if (authz.startsWith("Bearer ")) {
      try {
        const decoded = await getAdminAuth().verifyIdToken(authz.slice("Bearer ".length));
        actorUid = decoded.uid;
        actorRole = String(decoded.role ?? "");
      } catch {}
    }

    const uid = req.nextUrl.searchParams.get("uid");
    if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 });
    const db = getAdminDb();
    const snap = await db.collection("users").doc(uid).collection("abdm_consents").orderBy("createdAt", "desc").limit(10).get();
    await db.collection("audits").add({ createdAt: Date.now(), action: "abdm_consent_list", uid, count: snap.size, actorUid, actorRole });
    return NextResponse.json({
      ok: true,
      items: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
