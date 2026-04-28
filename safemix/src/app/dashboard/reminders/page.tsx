"use client";
import { useState, useEffect, useCallback } from "react";
import { Bell, Clock, Plus, Check, X, AlertCircle, CheckCircle, Pill, Info, AlertTriangle, Sparkles } from "lucide-react";
import Link from "next/link";
import { getRegimen, type RegimenMedicine } from "@/lib/regimen";
import { getCachedVerdicts, type CachedVerdict } from "@/lib/interactionCache";

// ─── Types ────────────────────────────────────────────────────────────────────
type ReminderStatus = "taken" | "missed" | "due_soon" | "upcoming";

interface Reminder {
  id: string;               // `${med.id}_${slotIdx}`
  medicineId: string;
  medName: string;
  system: string;
  dosage: string;
  scheduledH: number;       // 0–23
  scheduledM: number;       // 0–59
  displayTime: string;      // "08:30 AM"
  status: ReminderStatus;
  loggedAt?: string;        // "09:02 AM" when marked taken
}

type DayLog = Record<string, { status: "taken" | "missed"; loggedAt: string }>;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt24to12(h: number, m: number): string {
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${String(displayH).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

function nowFmt12(): string {
  const d = new Date();
  return fmt24to12(d.getHours(), d.getMinutes());
}

function dateKey(offset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}

/** Map timing string → [hour, min] */
const TIMING_MAP: Record<string, [number, number]> = {
  "Morning (empty stomach)": [7, 0],
  "Morning (after meal)":    [8, 30],
  "Afternoon (after meal)":  [13, 30],
  "Evening":                 [18, 0],
  "Night (before bed)":      [22, 0],
  "Night (after meal)":      [21, 0],
};

/** Generate [hour, min] slots from frequency + timing of a medicine */
function getSlots(med: RegimenMedicine): Array<[number, number]> {
  const base = TIMING_MAP[med.timing] ?? [8, 0];
  const [bh, bm] = base;

  switch (med.frequency) {
    case "Once daily":        return [[bh, bm]];
    case "Twice daily":       return [[bh, bm], [Math.min(bh + 12, 21), bm]];
    case "Three times daily": return [[8, 0], [13, 0], [20, 0]];
    case "Every 8 hours":     return [[8, 0], [16, 0], [0, 0]];
    case "Every 12 hours":    return [[8, 0], [20, 0]];
    case "As needed":         return [];
    default:                  return [[bh, bm]];
  }
}

function computeStatus(
  h: number, m: number, today: boolean, past: boolean, future: boolean,
  log: DayLog, id: string
): ReminderStatus {
  if (past) return log[id]?.status === "taken" ? "taken" : "missed";
  if (future) return "upcoming";
  // today
  if (log[id]) return log[id].status;
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const schedMins = h * 60 + m;
  if (schedMins > nowMins + 5) return "upcoming";
  if (schedMins >= nowMins - 5) return "due_soon";
  return "missed";
}

function readLog(offset: number): DayLog {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(`safemix_logs_${dateKey(offset)}`) || "{}") as DayLog;
  } catch { return {}; }
}

function writeLog(offset: number, log: DayLog) {
  localStorage.setItem(`safemix_logs_${dateKey(offset)}`, JSON.stringify(log));
}

const systemColor: Record<string, string> = {
  "Allopathic": "#3B82F6",
  "Ayurvedic": "#10B981",
  "Herbal / Plant-based": "#8B5CF6",
  "OTC": "#F59E0B",
  "Supplement": "#06B6D4",
  "Home Remedy": "#EC4899",
  "Homeopathic": "#6366F1",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function RemindersPage() {
  const TODAY = new Date();
  TODAY.setHours(0, 0, 0, 0);

  const [selectedOffset, setSelectedOffset] = useState(0);
  const [regimen, setRegimen] = useState<RegimenMedicine[]>([]);
  const [log, setLog] = useState<DayLog>({});
  const [showModal, setShowModal] = useState(false);
  const [newMed, setNewMed] = useState("");
  const [newTime, setNewTime] = useState("08:00");
  const [interactions, setInteractions] = useState<CachedVerdict[]>([]);

  // Load regimen and log on mount + when offset changes
  useEffect(() => {
    setRegimen(getRegimen());
    setLog(readLog(selectedOffset));
    setInteractions(getCachedVerdicts());
  }, [selectedOffset]);

  const isPast   = selectedOffset < 0;
  const isFuture = selectedOffset > 0;
  const isToday  = selectedOffset === 0;

  const selectedDate = new Date(TODAY);
  selectedDate.setDate(TODAY.getDate() + selectedOffset);
  const dateLabel = isToday
    ? "Today"
    : selectedDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

  // ── Build reminder list from regimen ──────────────────────────────────────
  const reminders: Reminder[] = [];
  for (const med of regimen) {
    const slots = getSlots(med);
    slots.forEach(([h, m], idx) => {
      const id = `${med.id}_${idx}`;
      reminders.push({
        id,
        medicineId: med.id,
        medName: med.name,
        system: med.system,
        dosage: med.dosage,
        scheduledH: h,
        scheduledM: m,
        displayTime: fmt24to12(h, m),
        status: computeStatus(h, m, isToday, isPast, isFuture, log, id),
        loggedAt: log[id]?.loggedAt,
      });
    });
  }

  // Sort by scheduled time
  reminders.sort((a, b) => a.scheduledH * 60 + a.scheduledM - (b.scheduledH * 60 + b.scheduledM));

  const takenCount  = reminders.filter((r) => r.status === "taken").length;
  const totalCount  = reminders.length;
  const adherencePct = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  // ── Actions ───────────────────────────────────────────────────────────────
  const markTaken = (id: string) => {
    const updated = { ...log, [id]: { status: "taken" as const, loggedAt: nowFmt12() } };
    setLog(updated);
    writeLog(selectedOffset, updated);
  };

  const markMissed = (id: string) => {
    const updated = { ...log, [id]: { status: "missed" as const, loggedAt: "" } };
    setLog(updated);
    writeLog(selectedOffset, updated);
  };

  const snoozeReminder = useCallback((id: string) => {
    // Just mark it due in 30 min — since we don't have a real scheduler, we save a deferred time
    const r = reminders.find((x) => x.id === id);
    if (!r) return;
    const newH = (r.scheduledH + Math.floor((r.scheduledM + 30) / 60)) % 24;
    const newM = (r.scheduledM + 30) % 60;
    // We log as upcoming (clear any existing log entry) and store the snoozed time as metadata
    const updated = { ...log };
    delete updated[id];
    // Store snooze hint in a separate key
    localStorage.setItem(`safemix_snooze_${id}`, JSON.stringify({ h: newH, m: newM }));
    setLog(updated);
    writeLog(selectedOffset, updated);
  }, [log, reminders, selectedOffset]);

  const addManualReminder = () => {
    if (!newMed.trim()) return;
    // Save a custom one-time reminder to localStorage
    const key = `safemix_extra_${dateKey(selectedOffset)}`;
    const extras = JSON.parse(localStorage.getItem(key) || "[]");
    const [hStr, mStr] = newTime.split(":");
    extras.push({ id: `extra_${Date.now()}`, medName: newMed, displayTime: fmt24to12(Number(hStr), Number(mStr)), scheduledH: Number(hStr), scheduledM: Number(mStr) });
    localStorage.setItem(key, JSON.stringify(extras));
    setShowModal(false);
    setNewMed("");
    setNewTime("08:00");
  };

  // ── Status styles ─────────────────────────────────────────────────────────
  const STATUS = {
    taken:    { dot: "bg-emerald-500", label: "Taken",    labelCls: "bg-emerald-100 text-emerald-700", card: "opacity-75" },
    missed:   { dot: "bg-red-500",     label: "Missed",   labelCls: "bg-red-100 text-red-700",         card: "opacity-75" },
    due_soon: { dot: "bg-amber-500 animate-pulse", label: "Due Now", labelCls: "bg-amber-100 text-amber-700", card: "" },
    upcoming: { dot: "bg-[#e8ede9] dark:bg-[#2a3430]", label: "Upcoming", labelCls: "bg-[#f0f4f1] text-[#7a9080]", card: "" },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-manrope font-bold text-2xl text-[#1a2820] dark:text-white">Reminders</h1>
          <p className="text-sm text-[#7a9080] mt-1">
            {totalCount === 0
              ? "No medicines in your regimen yet"
              : isToday
              ? `${takenCount}/${totalCount} doses taken · ${adherencePct}% adherence`
              : isPast
              ? `${dateLabel} · ${takenCount}/${totalCount} logged`
              : `${dateLabel} · ${totalCount} doses scheduled`}
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#42594A] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" /> Add Reminder
        </button>
      </div>

      {/* Calendar Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[-2, -1, 0, 1, 2, 3, 4].map((offset) => {
          const d = new Date(TODAY);
          d.setDate(TODAY.getDate() + offset);
          const active = offset === selectedOffset;
          return (
            <button key={offset} onClick={() => setSelectedOffset(offset)}
              className={`flex-shrink-0 w-16 p-3 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                active
                  ? "bg-[#42594A] border-[#42594A] text-white scale-110 shadow-lg"
                  : "bg-white dark:bg-[#1e2820] border-[#e0e8e2] dark:border-white/10 text-[#52615a] dark:text-[#9ab0a0] hover:border-[#5E7464]/40 hover:scale-105"
              }`}>
              <span className="text-[10px] font-bold uppercase mb-1">{d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
              <span className="text-lg font-bold font-manrope">{d.getDate()}</span>
              {offset === 0 && !active && <span className="w-1.5 h-1.5 rounded-full bg-[#5E7464] mt-1" />}
            </button>
          );
        })}
      </div>

      {/* ── Current Medicines + AI Interactions Widget ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Current Medicines */}
        <div className="bg-white dark:bg-[#1e2820] rounded-2xl border border-[#e0e8e2] dark:border-white/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#1a2820] dark:text-white">Current Medicines</h3>
            <Link href="/dashboard/add-medicine"
              className="text-xs font-semibold text-[#5E7464] hover:underline">+ Add</Link>
          </div>
          {regimen.length === 0 ? (
            <p className="text-xs text-[#9ab0a0] text-center py-4">No medicines yet</p>
          ) : (
            <div className="space-y-1">
              {regimen.map((m) => (
                <div key={m.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f8faf8] dark:hover:bg-[#141a15] transition-colors group">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: systemColor[m.system] || "#9ab0a0" }}>
                    {m.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1a2820] dark:text-white truncate">{m.name}</p>
                    <p className="text-[10px] text-[#9ab0a0] capitalize">
                      {m.timing
                        ? m.timing.replace(" (empty stomach)", "").replace(" (after meal)", "").replace(" (before bed)", "")
                        : m.frequency || ""}
                    </p>
                  </div>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: `${systemColor[m.system] || "#9ab0a0"}18`, color: systemColor[m.system] || "#9ab0a0" }}>
                    {m.system === "Herbal / Plant-based" ? "Herbal" : m.system}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: AI Interactions */}
        <div className="bg-white dark:bg-[#1e2820] rounded-2xl border border-[#e0e8e2] dark:border-white/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#1a2820] dark:text-white">AI Interactions</h3>
              <span className="flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live
              </span>
            </div>
            <Link href="/dashboard/add-medicine" className="text-xs font-semibold text-[#9ab0a0] hover:text-[#5E7464]">View all</Link>
          </div>

          {interactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <Sparkles className="w-6 h-6 text-[#c3d4c8]" />
              <p className="text-xs text-[#9ab0a0] text-center">No interaction checks yet.<br />Add a medicine to run a safety check.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {interactions.slice(0, 4).map((v) => {
                const ago = Math.round((Date.now() - v.checkedAt) / 60000);
                const agoStr = ago < 1 ? "just now" : ago < 60 ? `${ago}m ago` : `${Math.floor(ago / 60)}h ago`;
                const vedge = {
                  red:    { dot: "bg-red-500",    badge: "bg-red-100 text-red-600 border-red-200",       label: "Severe" },
                  yellow: { dot: "bg-amber-500",  badge: "bg-amber-100 text-amber-600 border-amber-200", label: "Caution" },
                  green:  { dot: "bg-emerald-500",badge: "bg-emerald-100 text-emerald-600 border-emerald-200", label: "Safe" },
                }[v.verdict];
                return (
                  <div key={v.id} className="flex items-center gap-3 py-2 border-b border-[#f0f4f1] dark:border-white/5 last:border-0">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${vedge.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1a2820] dark:text-white truncate">{v.medicines.join(" + ")}</p>
                      <p className="text-[10px] text-[#9ab0a0]">{agoStr}</p>
                    </div>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border flex-shrink-0 ${vedge.badge}`}>
                      {vedge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Adherence bar */}
      {totalCount > 0 && (
        <div className="bg-white dark:bg-[#1e2820] rounded-2xl border border-[#e0e8e2] dark:border-white/10 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] mb-2">
            <span>{dateLabel} Adherence</span>
            <span className="text-[#42594A] dark:text-[#b5ccba]">{takenCount}/{totalCount} doses · {adherencePct}%</span>
          </div>
          <div className="h-2.5 bg-[#f0f4f1] dark:bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#5E7464] to-[#42594A] rounded-full transition-all duration-500"
              style={{ width: `${adherencePct}%` }} />
          </div>
        </div>
      )}

      {/* Empty state */}
      {totalCount === 0 && (
        <div className="bg-white dark:bg-[#1e2820] rounded-3xl border border-[#e0e8e2] dark:border-white/10 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#f0f8f2] dark:bg-[#1a2a1e] flex items-center justify-center mx-auto mb-5">
            <Pill className="w-8 h-8 text-[#c3d4c8]" />
          </div>
          <h3 className="font-bold text-[#1a2820] dark:text-white mb-2">No reminders yet</h3>
          <p className="text-sm text-[#7a9080] mb-6">Add a medicine to your regimen and reminders will appear here automatically based on your dose schedule.</p>
          <Link href="/dashboard/add-medicine"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl"
            style={{ background: "linear-gradient(135deg,#5E7464,#42594A)" }}>
            <Plus className="w-4 h-4" /> Add Medicine
          </Link>
        </div>
      )}

      {/* Timeline */}
      {totalCount > 0 && (
        <div className="bg-white dark:bg-[#1e2820] rounded-3xl border border-[#e0e8e2] dark:border-white/10 p-6 md:p-8">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-manrope font-bold text-lg text-[#1a2820] dark:text-white">{dateLabel}&apos;s Schedule</h2>
            <div className="h-px flex-1 bg-[#f0f4f1] dark:bg-white/5" />
            <span className="text-xs text-[#9ab0a0]">{totalCount} reminder{totalCount !== 1 ? "s" : ""}</span>
          </div>

          <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-[#f0f4f1] dark:before:bg-white/5">
            {reminders.map((r) => {
              const s = STATUS[r.status];
              return (
                <div key={r.id} className={`relative flex items-start gap-5 group transition-opacity ${s.card}`}>
                  {/* Timeline dot */}
                  <div className={`w-9 h-9 rounded-full flex-shrink-0 z-10 border-4 border-white dark:border-[#1e2820] flex items-center justify-center ${s.dot}`}>
                    {r.status === "taken"    ? <Check className="w-4 h-4 text-white" /> :
                     r.status === "missed"   ? <X className="w-4 h-4 text-white" /> :
                     r.status === "due_soon" ? <Bell className="w-4 h-4 text-white" /> :
                     <Clock className="w-4 h-4 text-[#9ab0a0]" />}
                  </div>

                  {/* Card */}
                  <div className="flex-1 p-5 rounded-2xl border border-[#e0e8e2] dark:border-white/10 bg-[#F8F8F4] dark:bg-[#141a15] hover:border-[#5E7464]/30 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-[#5E7464] font-mono">{r.displayTime}</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                            style={{ background: `${systemColor[r.system] || "#9ab0a0"}18`, color: systemColor[r.system] || "#9ab0a0" }}>
                            {r.system}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${s.labelCls}`}>{s.label}</span>
                        </div>
                        <h3 className="font-bold text-base text-[#1a2820] dark:text-white">{r.medName}</h3>
                        {r.dosage && <p className="text-xs text-[#9ab0a0]">{r.dosage}</p>}
                      </div>
                    </div>

                    {/* Actions */}
                    {(r.status === "upcoming" || r.status === "due_soon") && (
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => markTaken(r.id)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:shadow-md transition-all active:scale-[0.98]">
                          <Check className="w-3.5 h-3.5" /> Mark Taken
                        </button>
                        {r.status === "due_soon" && (
                          <button onClick={() => snoozeReminder(r.id)}
                            className="px-4 py-2.5 rounded-xl border border-[#e0e8e2] dark:border-white/10 text-xs font-bold text-[#52615a] dark:text-[#9ab0a0] hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600 transition-all">
                            Snooze +30m
                          </button>
                        )}
                        <button onClick={() => markMissed(r.id)}
                          className="px-4 py-2.5 rounded-xl border border-[#e0e8e2] dark:border-white/10 text-xs font-bold text-red-500 hover:bg-red-50 transition-all">
                          Skip
                        </button>
                      </div>
                    )}

                    {r.status === "missed" && isToday && (
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 text-red-600 text-[10px] font-bold uppercase tracking-wider">
                          <AlertCircle className="w-3 h-3" /> Missed dose
                        </div>
                        <button onClick={() => markTaken(r.id)} className="text-xs font-bold text-[#5E7464] hover:underline">
                          Log it now →
                        </button>
                      </div>
                    )}

                    {r.status === "taken" && (
                      <div className="flex items-center gap-2 mt-2 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                        <CheckCircle className="w-3 h-3" />
                        {r.loggedAt ? `Logged at ${r.loggedAt}` : "Taken"}
                      </div>
                    )}

                    {r.status === "missed" && isPast && (
                      <div className="flex items-center gap-2 mt-2 text-red-500 text-[10px] font-bold uppercase tracking-wider">
                        <X className="w-3 h-3" /> Dose missed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Reminder Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e2820] rounded-3xl w-full max-w-md border border-[#e0e8e2] dark:border-white/10 shadow-2xl">
            <div className="p-6 border-b border-[#f0f4f1] dark:border-white/10 flex items-center justify-between">
              <h3 className="font-manrope font-bold text-lg text-[#1a2820] dark:text-white">Add One-time Reminder</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-[#f0f5f1] dark:hover:bg-[#2a3430] flex items-center justify-center text-[#9ab0a0]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-[#f0f8f2] dark:bg-[#1a2a1e] border border-[#b7eb8f]/30 flex items-start gap-2">
                <Info className="w-4 h-4 text-[#5E7464] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#52615a] dark:text-[#9ab0a0]">
                  Medicines added to your regimen already have auto-generated reminders above.
                  Use this for a one-off reminder only.
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Medicine / Note</label>
                <input type="text"
                  list="regimen-meds"
                  placeholder="e.g. Paracetamol 500mg"
                  value={newMed}
                  onChange={(e) => setNewMed(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-[#F8F8F4] dark:bg-[#141a15] text-[#1a2820] dark:text-white placeholder-[#9ab0a0] focus:outline-none focus:border-[#5E7464] text-sm" />
                <datalist id="regimen-meds">
                  {regimen.map((m) => <option key={m.id} value={m.name} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Time</label>
                <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-[#F8F8F4] dark:bg-[#141a15] text-[#1a2820] dark:text-white focus:outline-none focus:border-[#5E7464] text-sm" />
              </div>
              <button onClick={addManualReminder}
                className="w-full py-3.5 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                style={{ background: "linear-gradient(135deg,#5E7464,#42594A)" }}>
                <Bell className="w-4 h-4" /> Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
