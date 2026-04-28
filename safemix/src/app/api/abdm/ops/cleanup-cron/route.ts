import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token") ?? "";
    const expected = process.env.ABDM_OPS_CRON_TOKEN ?? "";
    if (!expected || token !== expected) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const olderThanDays = Number(req.nextUrl.searchParams.get("olderThanDays") ?? 7);
    const queueAlertThreshold = Number(process.env.ABDM_QUEUE_ALERT_THRESHOLD ?? 25);
    const cutoff = Date.now() - Math.max(1, olderThanDays) * 24 * 60 * 60 * 1000;
    const db = getAdminDb();

    let queueUpdated = 0;
    const queuedSnap = await db.collectionGroup("abdm_consents").where("status", "==", "local_requested").get();
    for (const d of queuedSnap.docs) {
      const data = d.data() as any;
      const createdAt = Number(data.createdAt ?? data.queuedAt ?? 0);
      if (createdAt > 0 && createdAt < cutoff) {
        await d.ref.set({ status: "stale_local_requested", staleMarkedAt: Date.now(), staleBy: "cron" }, { merge: true });
        queueUpdated += 1;
      }
    }

    if (queuedSnap.size >= queueAlertThreshold) {
      await db.collection("audits").add({
        createdAt: Date.now(),
        action: "abdm_queue_alert",
        queuedCount: queuedSnap.size,
        threshold: queueAlertThreshold,
      });
    }

    await db.collection("audits").add({
      createdAt: Date.now(),
      action: "abdm_ops_cleanup_cron",
      olderThanDays,
      queueUpdated,
      queuedTotal: queuedSnap.size,
    });

    return NextResponse.json({ ok: true, olderThanDays, queueUpdated, queuedTotal: queuedSnap.size });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

