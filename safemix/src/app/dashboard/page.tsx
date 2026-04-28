"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, Bell, Users, Share2, TrendingUp, ChevronRight, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getActiveAlerts, getCachedVerdicts, type CachedVerdict } from "@/lib/interactionCache";

const medicines = [
  { name: "Metformin 500mg", type: "Allopathic", time: "After meals", typeColor: "#3B82F6" },
  { name: "Lisinopril 10mg", type: "Allopathic", time: "Morning", typeColor: "#3B82F6" },
  { name: "Karela (Bitter Gourd) Juice", type: "Ayurvedic", time: "Empty stomach", typeColor: "#10B981" },
  { name: "Ashwagandha", type: "Herbal", time: "Night", typeColor: "#8B5CF6" },
];

const severityStyle: Record<string, { bg: string; text: string; border: string }> = {
  red: { bg: "#FFF1F0", text: "#C41C00", border: "#FFCCC7" },
  yellow: { bg: "#FFFBE6", text: "#875400", border: "#FFE58F" },
  green: { bg: "#F6FFED", text: "#237804", border: "#B7EB8F" },
};

// Fallback interactions shown when cache is empty
const FALLBACK_INTERACTIONS = [
  { pair: "Run a safety check to see your real alerts", verdict: "green" as const, label: "No checks yet", since: "" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const rawPhone = user?.phoneNumber || "";
  const displayName = rawPhone
    ? rawPhone.includes("@")
      ? rawPhone.split("@")[0]
      : rawPhone.replace("+91", "").trim().slice(0, 10)
    : "there";

  // Real alerts from localStorage cache
  const [alerts, setAlerts] = useState<CachedVerdict[]>([]);
  const [allVerdicts, setAllVerdicts] = useState<CachedVerdict[]>([]);

  useEffect(() => {
    setAlerts(getActiveAlerts());
    setAllVerdicts(getCachedVerdicts());
  }, []);

  const redAlerts = alerts.filter((a) => a.verdict === "red");
  const yellowAlerts = alerts.filter((a) => a.verdict === "yellow");

  const todayVerdict = redAlerts.length > 0
    ? `${redAlerts.length} Severe`
    : yellowAlerts.length > 0
    ? `${yellowAlerts.length} Caution`
    : allVerdicts.length > 0 ? "All Safe ✓" : "No checks";

  const verdictColor = redAlerts.length > 0 ? "#EF4444" : yellowAlerts.length > 0 ? "#F59E0B" : "#22C55E";
  const verdictBg = redAlerts.length > 0 ? "#FFF1F0" : yellowAlerts.length > 0 ? "#FFFBE6" : "#F6FFED";
  const verdictIconBg = redAlerts.length > 0 ? "#FFCCC7" : yellowAlerts.length > 0 ? "#FFE58F" : "#B7EB8F";

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-manrope font-bold text-2xl text-[#1a2820] dark:text-white">{greeting}, {displayName} 👋</h1>
          <p className="text-sm text-[#7a9080] mt-0.5">{today}</p>
        </div>
        <Link href="/dashboard/add-medicine"
          className="hidden md:flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(94,116,100,0.3)] transition-all hover:shadow-[0_8px_24px_rgba(94,116,100,0.4)]"
          style={{ background: "linear-gradient(135deg,#5E7464,#42594A)" }}
        >
          <span className="text-lg leading-none">+</span>
          Add Medicine
        </Link>
      </div>

      {/* Dynamic Alert Banner */}
      {redAlerts.length > 0 ? (
        <div className="flex items-center gap-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl p-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">
              {redAlerts.length} Severe Interaction{redAlerts.length > 1 ? "s" : ""} Detected
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-0.5 truncate">
              {redAlerts[0].medicines.join(" + ")} — {redAlerts[0].reason.slice(0, 80)}…
            </p>
          </div>
          <Link href="/dashboard/reports" className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline whitespace-nowrap">
            View Report
          </Link>
        </div>
      ) : yellowAlerts.length > 0 ? (
        <div className="flex items-center gap-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              {yellowAlerts.length} Caution{yellowAlerts.length > 1 ? "s" : ""} — Monitor Carefully
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 truncate">
              {yellowAlerts[0].medicines.join(" + ")} — {yellowAlerts[0].suggestion.slice(0, 80)}…
            </p>
          </div>
          <Link href="/dashboard/reports" className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline whitespace-nowrap">
            View Report
          </Link>
        </div>
      ) : allVerdicts.length > 0 ? (
        <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl p-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            All checked medicines are safe — no dangerous interactions found
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-4 bg-[#f0f8f4] dark:bg-[#1a2820] border border-[#c3d4c8] dark:border-white/10 rounded-2xl p-4">
          <div className="w-10 h-10 rounded-xl bg-[#dceae0] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#5E7464]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#1a2820] dark:text-white">No safety checks yet</p>
            <p className="text-xs text-[#7a9080] mt-0.5">Add a medicine to run your first AI interaction analysis</p>
          </div>
          <Link href="/dashboard/add-medicine" className="text-xs font-semibold text-[#5E7464] hover:underline whitespace-nowrap">
            Run Check →
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Verdict", value: todayVerdict, icon: AlertTriangle, color: verdictColor, bg: verdictBg, iconBg: verdictIconBg },
          { label: "Next Reminder", value: "8:00 PM", icon: Bell, color: "#5E7464", bg: "#F0F8F2", iconBg: "#DCEAE0" },
          { label: "Medicines", value: `${medicines.length} Active`, icon: CheckCircle, color: "#3B82F6", bg: "#EFF6FF", iconBg: "#DBEAFE" },
          { label: "Checks Done", value: allVerdicts.length > 0 ? `${allVerdicts.length} Total` : "None yet", icon: TrendingUp, color: "#8B5CF6", bg: "#F5F3FF", iconBg: "#EDE9FE" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-[#1e2820] rounded-2xl p-5 border border-[#e0e8e2] dark:border-white/10 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.iconBg }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-2xl font-manrope font-bold text-[#1a2820] dark:text-white">{s.value}</p>
            <p className="text-xs text-[#7a9080] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Two-col: medicines + interactions */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Current Medicines */}
        <div className="bg-white dark:bg-[#1e2820] rounded-2xl border border-[#e0e8e2] dark:border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f4f1] dark:border-white/10">
            <h2 className="font-manrope font-semibold text-[#1a2820] dark:text-white">Current Medicines</h2>
            <Link href="/dashboard/add-medicine" className="text-xs font-semibold text-[#5E7464] hover:underline">+ Add</Link>
          </div>
          <div className="divide-y divide-[#f0f4f1] dark:divide-white/5">
            {medicines.map((m) => (
              <div key={m.name} className="flex items-center gap-4 px-6 py-4 hover:bg-[#f8faf8] dark:hover:bg-[#1a2218] transition-colors">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold font-manrope flex-shrink-0" style={{ background: m.typeColor }}>
                  {m.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1a2820] dark:text-white truncate">{m.name}</p>
                  <p className="text-xs text-[#9ab0a0]">{m.time}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0" style={{ background: `${m.typeColor}18`, color: m.typeColor }}>
                  {m.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Real AI Interaction Results */}
        <div className="bg-white dark:bg-[#1e2820] rounded-2xl border border-[#e0e8e2] dark:border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f4f1] dark:border-white/10">
            <div className="flex items-center gap-2">
              <h2 className="font-manrope font-semibold text-[#1a2820] dark:text-white">AI Interactions</h2>
              {allVerdicts.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5E7464]/10 text-[#5E7464]">Live</span>
              )}
            </div>
            <Link href="/dashboard/reports" className="text-xs font-semibold text-[#5E7464] hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-[#f0f4f1] dark:divide-white/5">
            {allVerdicts.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <Sparkles className="w-8 h-8 text-[#c3d4c8] mx-auto mb-3" />
                <p className="text-sm font-medium text-[#1a2820] dark:text-white mb-1">No AI checks yet</p>
                <p className="text-xs text-[#9ab0a0] mb-4">Add a medicine to see real interaction results here</p>
                <Link href="/dashboard/add-medicine"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-2 rounded-xl"
                  style={{ background: "linear-gradient(135deg,#5E7464,#42594A)" }}>
                  <Sparkles className="w-3.5 h-3.5" /> Run First Check
                </Link>
              </div>
            ) : (
              allVerdicts.slice(0, 4).map((v) => {
                const s = severityStyle[v.verdict];
                const timeAgo = Math.round((Date.now() - v.checkedAt) / 60000);
                const timeLabel = timeAgo < 1 ? "just now" : timeAgo < 60 ? `${timeAgo}m ago` : `${Math.round(timeAgo / 60)}h ago`;
                return (
                  <div key={v.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#f8faf8] dark:hover:bg-[#1a2218] transition-colors">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: v.verdict === "red" ? "#EF4444" : v.verdict === "yellow" ? "#F59E0B" : "#22C55E" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1a2820] dark:text-white truncate">{v.medicines.join(" + ")}</p>
                      <p className="text-xs text-[#9ab0a0]">{timeLabel}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
                      {v.verdict === "red" ? "Severe" : v.verdict === "yellow" ? "Caution" : "Safe"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Run Safety Check", href: "/dashboard/add-medicine", icon: "fact_check", color: "#5E7464" },
          { label: "Share with Doctor", href: "/dashboard/doctor-share", icon: "qr_code_2", color: "#3B82F6" },
          { label: "Set Reminder", href: "/dashboard/reminders", icon: "alarm", color: "#8B5CF6" },
          { label: "Report Side Effect", href: "/dashboard/adverse-event", icon: "report_problem", color: "#EF4444" },
        ].map((a) => (
          <Link key={a.label} href={a.href}
            className="flex items-center gap-3 bg-white dark:bg-[#1e2820] rounded-2xl p-4 border border-[#e0e8e2] dark:border-white/10 hover:border-[#5E7464]/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all group"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${a.color}15` }}>
              <span className="material-symbols-outlined text-base" style={{ color: a.color }}>{a.icon}</span>
            </div>
            <span className="text-sm font-medium text-[#1a2820] dark:text-white leading-snug">{a.label}</span>
            <ChevronRight className="w-4 h-4 text-[#9ab0a0] ml-auto group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ))}
      </div>

    </div>
  );
}
