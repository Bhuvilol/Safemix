"use client";
/**
 * Admin module 3 — Interaction Reports curation (PRD §8.3 module 3).
 *
 * Browse the per-pair interaction graph stored at `interactions/{id}` plus
 * the in-code rule engine. Reviewers can edit each pair's verdict, mechanism,
 * citations, and workflow state (draft → ai_suggested → review → published →
 * re_review_needed). Rules from the in-code source-of-truth are read-only —
 * they ship with the app and are managed via PR review.
 */
import { useEffect, useState } from "react";
import {
  collection, doc, getDocs, setDoc, deleteDoc, addDoc, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { GitBranch, Plus, Save, Trash2, Loader2, Check, X, AlertTriangle } from "lucide-react";

const STATES = ["draft", "ai_suggested", "review", "published", "re_review_needed"] as const;
type State = typeof STATES[number];

const SEVERITIES = ["Major", "Moderate", "Minor", "Unknown"] as const;
type Severity = typeof SEVERITIES[number];

interface InteractionDoc {
  id?: string;
  drugA: string;
  drugB: string;
  mechanismCode: string;
  severity: Severity;
  clinicalConsequence: string;
  plainExplanation: string;
  timingOffsetSuggestion: string;
  saferAlternatives: string;
  evidenceLevel: "strong" | "moderate" | "limited";
  citations: string[];
  state: State;
  lastReviewedBy?: string;
  lastReviewedAt?: number;
}

const EMPTY: InteractionDoc = {
  drugA: "", drugB: "", mechanismCode: "", severity: "Unknown",
  clinicalConsequence: "", plainExplanation: "", timingOffsetSuggestion: "",
  saferAlternatives: "", evidenceLevel: "limited",
  citations: [], state: "draft",
};

const STATE_BADGE: Record<State, { bg: string; color: string; label: string }> = {
  draft:               { bg: "#F8F8F4", color: "#52615a", label: "Draft" },
  ai_suggested:        { bg: "#EEF2FF", color: "#4338CA", label: "AI suggested" },
  review:              { bg: "#FFFBE6", color: "#875400", label: "AYUSH review" },
  published:           { bg: "#F0F8F2", color: "#42594A", label: "Published" },
  re_review_needed:    { bg: "#FFF1F0", color: "#C41C00", label: "Re-review" },
};

export default function InteractionsAdminPage() {
  const [items, setItems] = useState<InteractionDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState<State | "all">("all");
  const [editing, setEditing] = useState<InteractionDoc | null>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "interactions"));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as InteractionDoc)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (item: InteractionDoc) => {
    setSaving(true);
    try {
      const payload = { ...item, lastReviewedAt: Date.now() };
      if (item.id) {
        await setDoc(doc(db, "interactions", item.id), payload);
      } else {
        const ref = await addDoc(collection(db, "interactions"), { ...payload, createdAt: Timestamp.now() });
        item.id = ref.id;
      }
      await load();
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: InteractionDoc) => {
    if (!item.id) return;
    if (!confirm(`Delete interaction "${item.drugA} × ${item.drugB}"?`)) return;
    await deleteDoc(doc(db, "interactions", item.id));
    await load();
  };

  const filtered = items.filter((i) => {
    if (stateFilter !== "all" && i.state !== stateFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return [i.drugA, i.drugB, i.mechanismCode, i.clinicalConsequence].some((s) => s?.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-manrope font-bold text-2xl text-[#1a2820] flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-[#5E7464]" /> Interaction Graph
          </h1>
          <p className="text-sm text-[#7a9080] mt-0.5">
            Curate the per-pair interaction database. PRD §8.3 m3 workflow:
            draft → ai-suggested → AYUSH review → published. Two-person rule applies.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#42594A] text-white text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> New Pair
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search drugs, mechanism, or consequence…"
          className="flex-1 min-w-[220px] px-4 py-2.5 rounded-xl border border-[#e0e8e2] bg-white text-sm outline-none focus:border-[#5E7464]"
        />
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value as State | "all")}
          className="px-3 py-2.5 rounded-xl border border-[#e0e8e2] bg-white text-sm"
        >
          <option value="all">All states</option>
          {STATES.map((s) => <option key={s} value={s}>{STATE_BADGE[s].label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#5E7464]" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#e0e8e2] rounded-2xl p-10 text-center text-[#9ab0a0] text-sm">
          No curated interactions yet. The 85+ in-code rules in <code>src/lib/interactionRules.ts</code> serve as the baseline. Add overrides or new pairs here.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const badge = STATE_BADGE[item.state];
            return (
              <div key={item.id} className="bg-white border border-[#e0e8e2] rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#1a2820]">{item.drugA}</span>
                    <span className="text-[#9ab0a0]">×</span>
                    <span className="font-bold text-[#1a2820]">{item.drugB}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.color }}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f0f5f1] text-[#42594A]">{item.severity}</span>
                  </div>
                  <p className="text-xs text-[#7a9080] mt-1 truncate" title={item.clinicalConsequence}>{item.clinicalConsequence}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditing(item)} className="px-3 py-2 rounded-xl border border-[#e0e8e2] text-xs font-semibold text-[#52615a]">Edit</button>
                  <button onClick={() => remove(item)} className="w-9 h-9 rounded-xl border border-[#e0e8e2] flex items-center justify-center text-red-500 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <EditorModal
          item={editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function EditorModal({ item, saving, onClose, onSave }: {
  item: InteractionDoc; saving: boolean; onClose: () => void; onSave: (i: InteractionDoc) => Promise<void>;
}) {
  const [draft, setDraft] = useState<InteractionDoc>(item);
  const [citationDraft, setCitationDraft] = useState("");

  const set = <K extends keyof InteractionDoc>(k: K, v: InteractionDoc[K]) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl p-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-manrope font-bold text-lg text-[#1a2820]">{item.id ? "Edit interaction" : "New interaction"}</h2>
          <button onClick={onClose} className="text-[#9ab0a0]"><X className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Drug / Herb A *">
            <input value={draft.drugA} onChange={(e) => set("drugA", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Drug / Herb B *">
            <input value={draft.drugB} onChange={(e) => set("drugB", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Mechanism code">
            <input value={draft.mechanismCode} onChange={(e) => set("mechanismCode", e.target.value)} className={inputCls} placeholder="CYP3A4 inhibition" />
          </Field>
          <Field label="Severity">
            <select value={draft.severity} onChange={(e) => set("severity", e.target.value as Severity)} className={inputCls}>
              {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Workflow state">
            <select value={draft.state} onChange={(e) => set("state", e.target.value as State)} className={inputCls}>
              {STATES.map((s) => <option key={s} value={s}>{STATE_BADGE[s].label}</option>)}
            </select>
          </Field>
          <Field label="Evidence level">
            <select value={draft.evidenceLevel} onChange={(e) => set("evidenceLevel", e.target.value as InteractionDoc["evidenceLevel"])} className={inputCls}>
              <option value="strong">Strong</option>
              <option value="moderate">Moderate</option>
              <option value="limited">Limited</option>
            </select>
          </Field>
        </div>
        <Field label="Clinical consequence">
          <textarea rows={2} value={draft.clinicalConsequence} onChange={(e) => set("clinicalConsequence", e.target.value)} className={`${inputCls} resize-none`} />
        </Field>
        <Field label="Plain-language explanation (English)">
          <textarea rows={2} value={draft.plainExplanation} onChange={(e) => set("plainExplanation", e.target.value)} className={`${inputCls} resize-none`} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Timing offset suggestion">
            <input value={draft.timingOffsetSuggestion} onChange={(e) => set("timingOffsetSuggestion", e.target.value)} className={inputCls} placeholder="Space ≥4h" />
          </Field>
          <Field label="Safer alternative">
            <input value={draft.saferAlternatives} onChange={(e) => set("saferAlternatives", e.target.value)} className={inputCls} placeholder="Switch to Rosuvastatin" />
          </Field>
        </div>

        <Field label={`Citations (${draft.citations.length})`}>
          <div className="flex gap-2">
            <input
              value={citationDraft}
              onChange={(e) => setCitationDraft(e.target.value)}
              className={`${inputCls} flex-1`}
              placeholder="PMID:21211558 or AIIA monograph URL"
              onKeyDown={(e) => {
                if (e.key === "Enter" && citationDraft.trim()) {
                  set("citations", [...draft.citations, citationDraft.trim()]);
                  setCitationDraft("");
                }
              }}
            />
            <button
              onClick={() => {
                if (!citationDraft.trim()) return;
                set("citations", [...draft.citations, citationDraft.trim()]);
                setCitationDraft("");
              }}
              className="px-3 rounded-xl bg-[#42594A] text-white text-xs font-semibold"
            >
              Add
            </button>
          </div>
          <ul className="mt-2 space-y-1">
            {draft.citations.map((c, i) => (
              <li key={`${c}-${i}`} className="flex items-center justify-between text-xs px-2 py-1 rounded-lg bg-[#F8F8F4]">
                <span className="text-[#52615a] truncate">• {c}</span>
                <button onClick={() => set("citations", draft.citations.filter((_, j) => j !== i))} className="text-[#9ab0a0]"><X className="w-3 h-3" /></button>
              </li>
            ))}
          </ul>
        </Field>

        {draft.citations.length === 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700 mb-3">
            <AlertTriangle className="w-4 h-4" /> At least one citation is required to publish.
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-[#e0e8e2] text-sm font-semibold text-[#52615a]">Cancel</button>
          <button
            onClick={() => onSave(draft)}
            disabled={saving || !draft.drugA.trim() || !draft.drugB.trim() || (draft.state === "published" && draft.citations.length === 0)}
            className="flex-1 py-3 rounded-2xl bg-[#42594A] text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full px-3 py-2 rounded-xl border border-[#e0e8e2] bg-[#F8F8F4] text-sm outline-none focus:border-[#5E7464]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-3">
      <span className="text-xs font-semibold text-[#52615a] mb-1.5 inline-block">{label}</span>
      {children}
    </label>
  );
}
