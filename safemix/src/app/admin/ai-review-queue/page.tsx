"use client";
/**
 * Admin module 5 — AI Review Queue (PRD §8.3 m5, §13.5).
 *
 * Lists every aiReviewQueue/{id} doc that's pending. For each one the
 * reviewer can: approve, edit-and-approve, reject, or escalate. Decisions
 * write back to the doc and log a REVIEWER_DECISION analytics event.
 */
import { useEffect, useState } from "react";
import { collection, doc, getDocs, setDoc, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Cpu, Loader2, Check, X, ArrowUpRight } from "lucide-react";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import type { ReviewQueueEntry, ReviewQueueState } from "@/lib/ai/reviewQueue";

interface QueueItem extends ReviewQueueEntry {
  id: string;
}

const BADGES: Record<ReviewQueueState, { bg: string; color: string; label: string }> = {
  pending:   { bg: "#FFFBE6", color: "#875400", label: "Pending" },
  approved:  { bg: "#F0F8F2", color: "#42594A", label: "Approved" },
  edited:    { bg: "#EEF2FF", color: "#4338CA", label: "Edited" },
  rejected:  { bg: "#FFF1F0", color: "#C41C00", label: "Rejected" },
  escalated: { bg: "#FFF3E0", color: "#EF6C00", label: "Escalated" },
};

export default function AIReviewQueuePage() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "aiReviewQueue"), orderBy("createdAt", "desc"), limit(100)));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as QueueItem)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const decide = async (item: QueueItem, state: ReviewQueueState) => {
    setActing(item.id);
    try {
      await setDoc(doc(db, "aiReviewQueue", item.id), {
        ...item, state,
        decisionNotes: editingNote[item.id] ?? item.decisionNotes ?? "",
        decidedAt: Date.now(),
      });
      await trackEvent(AnalyticsEvents.REVIEWER_DECISION, { state, model: item.modelUsed });
      await load();
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-manrope font-bold text-2xl text-[#1a2820] flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#5E7464]" /> AI Review Queue
        </h1>
        <p className="text-sm text-[#7a9080] mt-0.5">
          Gemini outputs with confidence below 0.85 or flagged by the safety filter. Approve, edit, reject, or escalate to an AYUSH expert.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#5E7464]" /></div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-[#e0e8e2] rounded-2xl p-10 text-center text-[#9ab0a0] text-sm">
          Queue is empty.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const badge = BADGES[item.state];
            const slaLeft = item.slaDeadline - Date.now();
            const slaHours = Math.round(slaLeft / 3600000);
            return (
              <div key={item.id} className="bg-white border border-[#e0e8e2] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.color }}>
                      {badge.label}
                    </span>
                    <span className="text-xs text-[#52615a] font-mono">{item.modelUsed}</span>
                    <span className="text-[11px] text-[#9ab0a0]">conf {item.confidence.toFixed(2)}</span>
                    {item.state === "pending" && (
                      <span className={`text-[11px] font-semibold ${slaHours < 1 ? "text-red-500" : "text-[#9ab0a0]"}`}>SLA {slaHours}h</span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#9ab0a0]">{new Date(item.createdAt).toLocaleString("en-IN")}</span>
                </div>
                <details>
                  <summary className="text-xs font-semibold text-[#52615a] cursor-pointer">Input payload</summary>
                  <pre className="text-[11px] mt-2 p-2 rounded-lg bg-[#F8F8F4] overflow-x-auto">{JSON.stringify(item.inputPayload, null, 2)}</pre>
                </details>
                <details>
                  <summary className="text-xs font-semibold text-[#52615a] cursor-pointer">Gemini draft</summary>
                  <pre className="text-[11px] mt-2 p-2 rounded-lg bg-[#F8F8F4] overflow-x-auto whitespace-pre-wrap">{item.geminiResponseRaw}</pre>
                </details>
                {item.safetyFlags.length > 0 && (
                  <div className="text-[11px] text-red-600">
                    Safety flags: {item.safetyFlags.join(", ")}
                  </div>
                )}
                {item.state === "pending" && (
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      placeholder="Decision note (optional but encouraged for edits/rejections)…"
                      value={editingNote[item.id] ?? ""}
                      onChange={(e) => setEditingNote((prev) => ({ ...prev, [item.id]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-[#e0e8e2] bg-[#F8F8F4] text-sm outline-none focus:border-[#5E7464] resize-none"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => decide(item, "approved")} disabled={acting === item.id} className="px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 disabled:opacity-50">
                        <Check className="w-3 h-3" /> Approve
                      </button>
                      <button onClick={() => decide(item, "edited")} disabled={acting === item.id} className="px-3 py-2 rounded-xl bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50">
                        Edit & approve
                      </button>
                      <button onClick={() => decide(item, "rejected")} disabled={acting === item.id} className="px-3 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold flex items-center gap-1 disabled:opacity-50">
                        <X className="w-3 h-3" /> Reject
                      </button>
                      <button onClick={() => decide(item, "escalated")} disabled={acting === item.id} className="px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold flex items-center gap-1 disabled:opacity-50">
                        <ArrowUpRight className="w-3 h-3" /> Escalate
                      </button>
                    </div>
                  </div>
                )}
                {item.decisionNotes && item.state !== "pending" && (
                  <p className="text-[11px] text-[#52615a] italic">Note: {item.decisionNotes}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
