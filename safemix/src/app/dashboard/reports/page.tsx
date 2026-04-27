"use client";
import { useState } from "react";
import { AlertTriangle, AlertCircle, CheckCircle, Share2, Download } from "lucide-react";

const interactions = [
  {
    pair: ["Metformin 500mg", "Karela Juice"],
    severity: "red",
    label: "Severe",
    why: "Karela (bitter gourd) has intrinsic hypoglycemic properties. Combined with Metformin, this significantly elevates the risk of severe hypoglycemia.",
    suggestion: "Avoid Karela juice within 6 hours of Metformin. Monitor blood sugar closely if used together. Consult your diabetologist.",
    since: "2 days ago",
  },
  {
    pair: ["Aspirin 75mg", "Mulethi (Licorice)"],
    severity: "yellow",
    label: "Caution",
    why: "Licorice root can cause sodium retention and potassium loss, which may counteract the blood-thinning effects of aspirin.",
    suggestion: "Use Mulethi only under guidance. Keep a gap of at least 4 hours between these medicines.",
    since: "5 days ago",
  },
  {
    pair: ["Lisinopril 10mg", "Banana"],
    severity: "yellow",
    label: "Caution",
    why: "Bananas are high in potassium. ACE inhibitors like Lisinopril also raise potassium levels — combining both may cause hyperkalemia.",
    suggestion: "Limit banana intake to 1 per day while on Lisinopril. Monitor potassium levels monthly.",
    since: "1 week ago",
  },
  {
    pair: ["Vitamin D3 60K IU", "Calcium 500mg"],
    severity: "green",
    label: "Safe",
    why: "Vitamin D3 actually enhances calcium absorption. This is a recommended combination for bone health.",
    suggestion: "Take Calcium and Vitamin D3 together after meals for maximum absorption.",
    since: "1 week ago",
  },
];

const severityConfig: Record<string, { bg: string; border: string; text: string; badgeBg: string; icon: typeof AlertTriangle }> = {
  red: { bg: "#FFF1F0", border: "#FFCCC7", text: "#C41C00", badgeBg: "#FFCCC7", icon: AlertTriangle },
  yellow: { bg: "#FFFBE6", border: "#FFE58F", text: "#875400", badgeBg: "#FFE58F", icon: AlertCircle },
  green: { bg: "#F6FFED", border: "#B7EB8F", text: "#237804", badgeBg: "#B7EB8F", icon: CheckCircle },
};

const tabs = ["Current Interactions", "History", "Doctor Shares", "Adverse Events"];

export default function ReportsPage() {
  const [tab, setTab] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-manrope font-bold text-2xl text-[#1a2820] dark:text-white">Reports</h1>
          <p className="text-sm text-[#7a9080] mt-1">Your medicine interaction analysis & history</p>
        </div>
        <button className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e0e8e2] dark:border-white/15 text-sm font-medium text-[#52615a] dark:text-[#9ab0a0] hover:bg-[#f4f8f5] dark:hover:bg-[#1e2820] transition-colors">
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Severe", count: 1, color: "#EF4444", bg: "#FFF1F0" },
          { label: "Caution", count: 2, color: "#F59E0B", bg: "#FFFBE6" },
          { label: "Safe Pairs", count: 1, color: "#22C55E", bg: "#F6FFED" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-4 text-center border" style={{ background: s.bg, borderColor: `${s.color}30` }}>
            <p className="text-3xl font-manrope font-bold" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#f0f5f1] dark:bg-[#1e2820] rounded-2xl">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              tab === i
                ? "bg-white dark:bg-[#2a3430] text-[#42594A] dark:text-[#b5ccba] shadow-sm"
                : "text-[#7a9080] hover:text-[#42594A] dark:hover:text-[#9ab0a0]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Interaction cards */}
      {tab === 0 && (
        <div className="space-y-3">
          {interactions.map((ix, i) => {
            const c = severityConfig[ix.severity];
            const isOpen = expanded === i;
            return (
              <div key={i} className="bg-white dark:bg-[#1e2820] rounded-2xl border border-[#e0e8e2] dark:border-white/10 overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow">
                <button onClick={() => setExpanded(isOpen ? null : i)} className="w-full flex items-center gap-4 p-5 text-left">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.badgeBg }}>
                    <c.icon className="w-5 h-5" style={{ color: c.text }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {ix.pair.map((p, pi) => (
                        <span key={pi}>
                          <span className="text-sm font-semibold text-[#1a2820] dark:text-white">{p}</span>
                          {pi < ix.pair.length - 1 && <span className="text-[#9ab0a0] mx-1.5">×</span>}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-[#9ab0a0]">{ix.since}</p>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full flex-shrink-0 border" style={{ background: c.bg, color: c.text, borderColor: c.border }}>
                    {ix.label}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-[#f0f4f1] dark:border-white/5 pt-4" style={{ background: `${c.bg}80` }}>
                    <p className="text-sm mb-3" style={{ color: c.text }}><strong>Why risky:</strong> {ix.why}</p>
                    <p className="text-sm mb-4" style={{ color: c.text }}><strong>Suggestion:</strong> {ix.suggestion}</p>
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: c.text }}>
                        <Share2 className="w-3.5 h-3.5" /> Share with Doctor
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border" style={{ borderColor: c.border, color: c.text }}>
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab !== 0 && (
        <div className="text-center py-20 text-[#9ab0a0]">
          <div className="w-16 h-16 rounded-2xl bg-[#f0f5f1] dark:bg-[#1e2820] flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-2xl text-[#c3d4c8]">inbox</span>
          </div>
          <p className="font-semibold text-[#52615a] dark:text-[#7a9080]">No data yet</p>
          <p className="text-sm mt-1">Records will appear here as you use SafeMix</p>
        </div>
      )}
    </div>
  );
}
