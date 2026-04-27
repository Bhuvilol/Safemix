"use client";
import Link from "next/link";
import { AlertTriangle, Bell, Users, Share2, TrendingUp, ChevronRight, CheckCircle } from "lucide-react";

const interactions = [
  { pair: "Metformin + Karela", severity: "red", label: "Severe", since: "2d" },
  { pair: "Aspirin + Mulethi", severity: "yellow", label: "Caution", since: "5d" },
  { pair: "Lisinopril + Banana", severity: "yellow", label: "Caution", since: "1w" },
  { pair: "Vitamin D + Calcium", severity: "green", label: "Safe", since: "1w" },
];

const medicines = [
  { name: "Metformin 500mg", type: "Allopathic", time: "After meals", typeColor: "#3B82F6" },
  { name: "Lisinopril 10mg", type: "Allopathic", time: "Morning", typeColor: "#3B82F6" },
  { name: "Karela Juice", type: "Ayurvedic", time: "Empty stomach", typeColor: "#10B981" },
  { name: "Ashwagandha", type: "Herbal", time: "Night", typeColor: "#8B5CF6" },
];

const severityStyle: Record<string, { bg: string; text: string; border: string }> = {
  red: { bg: "#FFF1F0", text: "#C41C00", border: "#FFCCC7" },
  yellow: { bg: "#FFFBE6", text: "#875400", border: "#FFE58F" },
  green: { bg: "#F6FFED", text: "#237804", border: "#B7EB8F" },
};

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-manrope font-bold text-2xl text-[#1a2820] dark:text-white">Good morning, Rahul 👋</h1>
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

      {/* Alert banner */}
      <div className="flex items-center gap-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl p-4">
        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-800 dark:text-red-300">1 Severe Interaction Detected</p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">Metformin 500mg + Karela Juice — Risk of severe hypoglycemia</p>
        </div>
        <Link href="/dashboard/reports" className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline whitespace-nowrap">View Report</Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Verdict", value: "1 Alert", icon: AlertTriangle, color: "#EF4444", bg: "#FFF1F0", iconBg: "#FFCCC7" },
          { label: "Next Reminder", value: "8:00 PM", icon: Bell, color: "#5E7464", bg: "#F0F8F2", iconBg: "#DCEAE0" },
          { label: "Medicines", value: "4 Active", icon: CheckCircle, color: "#3B82F6", bg: "#EFF6FF", iconBg: "#DBEAFE" },
          { label: "Family Profiles", value: "3 Members", icon: Users, color: "#8B5CF6", bg: "#F5F3FF", iconBg: "#EDE9FE" },
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

        {/* Recent Medicines */}
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

        {/* Interactions */}
        <div className="bg-white dark:bg-[#1e2820] rounded-2xl border border-[#e0e8e2] dark:border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f4f1] dark:border-white/10">
            <h2 className="font-manrope font-semibold text-[#1a2820] dark:text-white">Interactions</h2>
            <Link href="/dashboard/reports" className="text-xs font-semibold text-[#5E7464] hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-[#f0f4f1] dark:divide-white/5">
            {interactions.map((ix) => {
              const s = severityStyle[ix.severity];
              return (
                <div key={ix.pair} className="flex items-center gap-4 px-6 py-4 hover:bg-[#f8faf8] dark:hover:bg-[#1a2218] transition-colors">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: ix.severity === "red" ? "#EF4444" : ix.severity === "yellow" ? "#F59E0B" : "#22C55E" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1a2820] dark:text-white truncate">{ix.pair}</p>
                    <p className="text-xs text-[#9ab0a0]">{ix.since} ago</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
                    {ix.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Run Safety Check", href: "/dashboard/add-medicine", icon: "fact_check", color: "#5E7464" },
          { label: "Share with Doctor", href: "/dashboard/doctor-share", icon: "qr_code_2", color: "#3B82F6" },
          { label: "Set Reminder", href: "/dashboard/reminders", icon: "alarm", color: "#8B5CF6" },
          { label: "View Reports", href: "/dashboard/reports", icon: "bar_chart", color: "#F59E0B" },
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
