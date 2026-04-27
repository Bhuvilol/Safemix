"use client";
import { useState } from "react";
import { Search, Mic, Camera, Clock, AlertTriangle, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const systems = ["Allopathic", "Ayurvedic", "Homeopathic", "Herbal / Plant-based", "OTC", "Home Remedy", "Supplement"];
const frequencies = ["Once daily", "Twice daily", "Three times daily", "Every 8 hours", "Every 12 hours", "As needed"];
const timings = ["Morning (empty stomach)", "Morning (after meal)", "Afternoon (after meal)", "Evening", "Night (before bed)", "Night (after meal)"];

const MOCK_RESULT = {
  verdict: "red" as const,
  medicines: ["Metformin 500mg", "Karela Juice"],
  reason: "This combination significantly increases the risk of hypoglycemia (low blood sugar). Karela (bitter gourd) has blood glucose-lowering effects that can potentiate the action of Metformin.",
  suggestion: "Do not take Karela juice within 6 hours of Metformin. Consult your doctor before continuing this combination.",
};

export default function AddMedicinePage() {
  const [tab, setTab] = useState<"search" | "ocr" | "voice" | "past">("search");
  const [form, setForm] = useState({ name: "", system: "", dosage: "", frequency: "", timing: "", withFood: true, startDate: "" });
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<typeof MOCK_RESULT | null>(null);

  const tabs = [
    { id: "search", label: "Text Search", icon: Search },
    { id: "ocr", label: "OCR Upload", icon: Camera },
    { id: "voice", label: "Voice Input", icon: Mic },
    { id: "past", label: "Past Medicines", icon: Clock },
  ] as const;

  const runCheck = () => {
    setChecking(true);
    setResult(null);
    setTimeout(() => {
      setChecking(false);
      setResult(MOCK_RESULT);
    }, 2000);
  };

  const verdictConfig = {
    red: { bg: "#FFF1F0", border: "#FFCCC7", text: "#C41C00", icon: AlertTriangle, label: "SEVERE RISK" },
    yellow: { bg: "#FFFBE6", border: "#FFE58F", text: "#875400", icon: AlertCircle, label: "CAUTION" },
    green: { bg: "#F6FFED", border: "#B7EB8F", text: "#237804", icon: CheckCircle, label: "SAFE" },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-manrope font-bold text-2xl text-[#1a2820] dark:text-white">Add Medicine</h1>
        <p className="text-sm text-[#7a9080] mt-1">Add a medicine to run a safety check against your current regimen.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#f0f5f1] dark:bg-[#1e2820] rounded-2xl">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-white dark:bg-[#2a3430] text-[#42594A] dark:text-[#b5ccba] shadow-sm"
                : "text-[#7a9080] hover:text-[#42594A] dark:hover:text-[#9ab0a0]"
            }`}
          >
            <t.icon className="w-4 h-4" />
            <span className="hidden sm:block">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-[#1e2820] rounded-2xl border border-[#e0e8e2] dark:border-white/10 p-6 space-y-5">

        {tab === "search" && (
          <>
            <div>
              <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Medicine Name *</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ab0a0]" />
                <input type="text" placeholder="e.g. Metformin, Ashwagandha, Karela Juice..."
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-[#F8F8F4] dark:bg-[#141a15] text-[#1a2820] dark:text-white placeholder-[#9ab0a0] focus:outline-none focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 text-sm"
                />
              </div>
            </div>
          </>
        )}

        {tab === "ocr" && (
          <div className="border-2 border-dashed border-[#c3d4c8] dark:border-white/20 rounded-2xl p-12 text-center hover:border-[#5E7464] transition-colors cursor-pointer">
            <Camera className="w-10 h-10 text-[#9ab0a0] mx-auto mb-3" />
            <p className="font-semibold text-[#1a2820] dark:text-white mb-2">Upload Prescription or Medicine Pack</p>
            <p className="text-sm text-[#7a9080] mb-4">Supports JPG, PNG, PDF — up to 10MB</p>
            <button className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: "linear-gradient(135deg,#5E7464,#42594A)" }}>
              Choose File
            </button>
          </div>
        )}

        {tab === "voice" && (
          <div className="text-center py-10">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 cursor-pointer hover:scale-105 transition-transform" style={{ background: "linear-gradient(135deg,#5E7464,#42594A)" }}>
              <Mic className="w-9 h-9 text-white" />
            </div>
            <p className="font-semibold text-[#1a2820] dark:text-white mb-2">Tap to start speaking</p>
            <p className="text-sm text-[#7a9080]">Works in Hindi, Tamil, Telugu, Bengali, Marathi & more</p>
          </div>
        )}

        {tab === "past" && (
          <div className="space-y-2">
            {["Metformin 500mg", "Ashwagandha 300mg", "Vitamin D3 60K", "Pantoprazole 40mg"].map((med) => (
              <div key={med} className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#f4f8f5] dark:bg-[#141a15] border border-[#e0e8e2] dark:border-white/10 hover:border-[#5E7464]/30 cursor-pointer transition-all">
                <span className="text-sm font-medium text-[#1a2820] dark:text-white">{med}</span>
                <button className="text-xs text-[#5E7464] font-semibold hover:underline">Add again</button>
              </div>
            ))}
          </div>
        )}

        {/* Common fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Medicine System *</label>
            <select value={form.system} onChange={(e) => setForm({ ...form, system: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-[#F8F8F4] dark:bg-[#141a15] text-[#1a2820] dark:text-white focus:outline-none focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 text-sm"
            >
              <option value="">Select system...</option>
              {systems.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Dosage</label>
            <input type="text" placeholder="e.g. 500mg, 1 tablet, 10ml"
              value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-[#F8F8F4] dark:bg-[#141a15] text-[#1a2820] dark:text-white placeholder-[#9ab0a0] focus:outline-none focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Frequency</label>
            <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-[#F8F8F4] dark:bg-[#141a15] text-[#1a2820] dark:text-white focus:outline-none focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 text-sm"
            >
              <option value="">Select...</option>
              {frequencies.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Timing</label>
            <select value={form.timing} onChange={(e) => setForm({ ...form, timing: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-[#F8F8F4] dark:bg-[#141a15] text-[#1a2820] dark:text-white focus:outline-none focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 text-sm"
            >
              <option value="">Select...</option>
              {timings.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Start Date</label>
            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-[#F8F8F4] dark:bg-[#141a15] text-[#1a2820] dark:text-white focus:outline-none focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 text-sm"
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setForm({ ...form, withFood: !form.withFood })}
                className={`w-11 h-6 rounded-full transition-colors relative ${form.withFood ? "bg-[#5E7464]" : "bg-[#e0e8e2] dark:bg-white/20"}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.withFood ? "translate-x-6" : "translate-x-1"}`} />
              </div>
              <span className="text-sm font-medium text-[#1a2820] dark:text-white">With food</span>
            </label>
          </div>
        </div>

        {/* Run Check button */}
        <button onClick={runCheck} disabled={checking}
          className="w-full flex items-center justify-center gap-3 text-white text-sm font-semibold py-4 rounded-xl transition-all hover:shadow-[0_8px_30px_rgba(94,116,100,0.35)] active:scale-[0.99] disabled:opacity-70"
          style={{ background: "linear-gradient(135deg,#5E7464,#42594A)" }}
        >
          {checking ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Analysing interactions...</>
          ) : (
            <><span className="material-symbols-outlined text-base">fact_check</span> Run Safety Check</>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (() => {
        const v = verdictConfig[result.verdict];
        return (
          <div className="rounded-2xl border p-6 animate-[fadeIn_0.4s_ease]" style={{ background: v.bg, borderColor: v.border }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: v.border }}>
                <v.icon className="w-5 h-5" style={{ color: v.text }} />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: v.text }}>{v.label}</span>
                <p className="font-manrope font-bold text-lg" style={{ color: v.text }}>{result.medicines.join(" + ")}</p>
              </div>
            </div>
            <p className="text-sm mb-3" style={{ color: v.text }}><strong>Why risky:</strong> {result.reason}</p>
            <p className="text-sm" style={{ color: v.text }}><strong>Suggestion:</strong> {result.suggestion}</p>
            <div className="flex gap-3 mt-5">
              <button className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: v.text }}>
                Add Despite Warning
              </button>
              <button className="flex-1 py-2.5 text-sm font-semibold rounded-xl border" style={{ borderColor: v.border, color: v.text }}>
                Find Alternatives
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
