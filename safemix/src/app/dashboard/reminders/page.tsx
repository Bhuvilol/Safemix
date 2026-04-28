"use client";
import { useState } from "react";
import { Bell, Clock, Plus, Check, X, MoreVertical, AlertCircle, CheckCircle } from "lucide-react";

interface Reminder {
  id: number;
  med: string;
  time: string;
  status: "Taken" | "Missed" | "Upcoming" | "Snoozed";
  date: string;
  system: string;
}

const INITIAL_REMINDERS: Reminder[] = [
  { id: 1, med: "Metformin 500mg", time: "08:00 AM", status: "Taken", date: "Today", system: "Allopathic" },
  { id: 2, med: "Lisinopril 10mg", time: "08:00 AM", status: "Taken", date: "Today", system: "Allopathic" },
  { id: 3, med: "Karela Juice", time: "10:30 AM", status: "Missed", date: "Today", system: "Ayurvedic" },
  { id: 4, med: "Metformin 500mg", time: "08:00 PM", status: "Upcoming", date: "Today", system: "Allopathic" },
  { id: 5, med: "Ashwagandha", time: "10:00 PM", status: "Upcoming", date: "Today", system: "Herbal" },
];

const MEDICINE_OPTIONS = ["Metformin 500mg", "Lisinopril 10mg", "Karela Juice", "Ashwagandha", "Vitamin D3", "Omega-3"];
const TIME_SLOTS = ["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "06:00 PM", "08:00 PM", "10:00 PM"];
const SYSTEMS = ["Allopathic", "Ayurvedic", "Herbal", "OTC", "Supplement"];

export default function RemindersPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [tab, setTab] = useState("Timeline");
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [showModal, setShowModal] = useState(false);
  const [newReminder, setNewReminder] = useState({ med: "", time: "08:00 AM", system: "Allopathic" });
  const [selectedOffset, setSelectedOffset] = useState(0); // 0 = today

  const markTaken = (id: number) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: "Taken" } : r));
  };

  const snooze = (id: number) => {
    setReminders(prev => prev.map(r => {
      if (r.id !== id) return r;
      // Add 30 minutes to the time
      const [time, meridiem] = r.time.split(" ");
      const [h, m] = time.split(":").map(Number);
      const totalMin = (h % 12 + (meridiem === "PM" ? 12 : 0)) * 60 + m + 30;
      const newH = Math.floor(totalMin / 60) % 24;
      const newM = totalMin % 60;
      const newMeridiem = newH >= 12 ? "PM" : "AM";
      const displayH = newH % 12 === 0 ? 12 : newH % 12;
      const newTime = `${String(displayH).padStart(2, "0")}:${String(newM).padStart(2, "0")} ${newMeridiem}`;
      return { ...r, status: "Snoozed", time: newTime };
    }));
  };

  const skip = (id: number) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: "Missed" } : r));
  };

  const logMissed = (id: number) => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const meridiem = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const nowTime = `${String(displayH).padStart(2, "0")}:${String(m).padStart(2, "0")} ${meridiem}`;
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: "Taken", time: nowTime } : r));
  };

  const addReminder = () => {
    if (!newReminder.med.trim()) return;
    const id = Date.now();
    setReminders(prev => [...prev, { id, med: newReminder.med, time: newReminder.time, status: "Upcoming", date: "Today", system: newReminder.system }]);
    setNewReminder({ med: "", time: "08:00 AM", system: "Allopathic" });
    setShowModal(false);
  };

  const selectedDate = new Date(today);
  selectedDate.setDate(today.getDate() + selectedOffset);
  const isToday = selectedOffset === 0;
  const isPast = selectedOffset < 0;
  const isFuture = selectedOffset > 0;

  const selectedDateLabel = isToday ? "Today" :
    isPast ? selectedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" }) :
    selectedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });

  // For past days show all as Taken, for future days show all as Upcoming
  const visibleReminders = reminders.map((r) => {
    if (isPast) return { ...r, status: "Taken" as const };
    if (isFuture) return { ...r, status: "Upcoming" as const };
    return r;
  });

  const takenCount = visibleReminders.filter(r => r.status === "Taken").length;
  const totalCount = visibleReminders.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-manrope font-bold text-2xl text-[#1a2820] dark:text-white">Reminders</h1>
          <p className="text-sm text-[#7a9080] mt-1">
            {isToday
              ? `${takenCount}/${totalCount} doses taken today — ${totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0}% adherence`
              : isPast
              ? `${selectedDateLabel} — all doses logged`
              : `${selectedDateLabel} — ${totalCount} doses scheduled`}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#42594A] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Reminder
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[-2, -1, 0, 1, 2, 3, 4].map((offset) => {
          const date = new Date(today);
          date.setDate(today.getDate() + offset);
          const active = offset === selectedOffset;
          return (
            <button
              key={offset}
              onClick={() => setSelectedOffset(offset)}
              className={`flex-shrink-0 w-16 p-3 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                active
                  ? "bg-[#42594A] border-[#42594A] text-white scale-110 shadow-lg"
                  : "bg-white dark:bg-[#1e2820] border-[#e0e8e2] dark:border-white/10 text-[#52615a] dark:text-[#9ab0a0] hover:border-[#5E7464]/40 hover:scale-105"
              }`}
            >
              <span className="text-[10px] font-bold uppercase mb-1">{date.toLocaleDateString("en-IN", { weekday: "short" })}</span>
              <span className="text-lg font-bold font-manrope">{date.getDate()}</span>
              {offset === 0 && !active && <span className="w-1.5 h-1.5 rounded-full bg-[#5E7464] mt-1" />}
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="bg-white dark:bg-[#1e2820] rounded-2xl border border-[#e0e8e2] dark:border-white/10 p-4">
        <div className="flex items-center justify-between text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] mb-2">
          <span>{selectedDateLabel}&apos;s Adherence</span>
          <span className="text-[#42594A] dark:text-[#b5ccba]">{takenCount}/{totalCount} doses</span>
        </div>
        <div className="h-2 bg-[#f0f4f1] dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#5E7464] to-[#42594A] rounded-full transition-all duration-500"
            style={{ width: totalCount > 0 ? `${(takenCount / totalCount) * 100}%` : "0%" }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white dark:bg-[#1e2820] rounded-3xl border border-[#e0e8e2] dark:border-white/10 p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-manrope font-bold text-lg text-[#1a2820] dark:text-white">
            {isToday ? "Today" : isPast ? "Past" : "Upcoming"}&apos;s Schedule
          </h2>
          <div className="h-px flex-1 bg-[#f0f4f1] dark:bg-white/5" />
          <div className="flex gap-1 p-1 bg-[#f0f5f1] dark:bg-[#141a15] rounded-xl">
            {["Timeline", "Calendar"].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === t ? "bg-white dark:bg-[#202a22] text-[#42594A] dark:text-[#b5ccba] shadow-sm" : "text-[#7a9080]"
              }`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-[#f0f4f1] dark:before:bg-white/5">
          {visibleReminders.map((r) => (
            <div key={r.id} className="relative flex items-start gap-6 group">
              {/* Dot */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 border-white dark:border-[#1e2820] transition-colors ${
                r.status === "Taken" ? "bg-emerald-500" :
                r.status === "Missed" ? "bg-red-500" :
                r.status === "Snoozed" ? "bg-amber-500" :
                "bg-[#e8ede9] dark:bg-[#2a3430]"
              }`}>
                {r.status === "Taken" ? <Check className="w-4 h-4 text-white" /> :
                 r.status === "Missed" ? <X className="w-4 h-4 text-white" /> :
                 r.status === "Snoozed" ? <Clock className="w-4 h-4 text-white" /> :
                 <Clock className="w-4 h-4 text-[#9ab0a0]" />}
              </div>

              {/* Content */}
              <div className={`flex-1 p-5 rounded-2xl border transition-all ${
                r.status === "Upcoming" || r.status === "Snoozed"
                  ? "bg-[#F8F8F4] dark:bg-[#141a15] border-[#e0e8e2] dark:border-white/10 hover:border-[#5E7464]/30"
                  : "bg-white dark:bg-[#1e2820] border-[#f0f4f1] dark:border-white/5 opacity-80"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#5E7464] font-mono">{r.time}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      r.system === "Ayurvedic" ? "bg-emerald-100 text-emerald-700" :
                      r.system === "Herbal" ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>{r.system}</span>
                    {r.status === "Snoozed" && <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase bg-amber-100 text-amber-700">Snoozed</span>}
                  </div>
                  <button className="text-[#9ab0a0] hover:text-[#52615a]"><MoreVertical className="w-4 h-4" /></button>
                </div>
                <h3 className="font-bold text-[#1a2820] dark:text-white mb-4">{r.med}</h3>

                {(r.status === "Upcoming" || r.status === "Snoozed") && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => markTaken(r.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark Taken
                    </button>
                    <button
                      onClick={() => snooze(r.id)}
                      className="px-4 py-2.5 rounded-xl border border-[#e0e8e2] dark:border-white/10 text-xs font-bold text-[#52615a] dark:text-[#9ab0a0] hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600 transition-all"
                    >
                      Snooze +30m
                    </button>
                    <button
                      onClick={() => skip(r.id)}
                      className="px-4 py-2.5 rounded-xl border border-[#e0e8e2] dark:border-white/10 text-xs font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                      Skip
                    </button>
                  </div>
                )}

                {r.status === "Missed" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-600 text-[10px] font-bold uppercase tracking-wider">
                      <AlertCircle className="w-3 h-3" />
                      Missed dose
                    </div>
                    <button
                      onClick={() => logMissed(r.id)}
                      className="text-xs font-bold text-[#5E7464] hover:underline"
                    >
                      Log it now →
                    </button>
                  </div>
                )}

                {r.status === "Taken" && (
                  <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle className="w-3 h-3" />
                    Logged at {r.time}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e2820] rounded-3xl w-full max-w-md border border-[#e0e8e2] dark:border-white/10 shadow-2xl animate-[fadeIn_0.2s_ease]">
            <div className="p-6 border-b border-[#f0f4f1] dark:border-white/10 flex items-center justify-between">
              <h3 className="font-manrope font-bold text-lg text-[#1a2820] dark:text-white">Add New Reminder</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-[#f0f5f1] dark:hover:bg-[#2a3430] flex items-center justify-center text-[#9ab0a0]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Medicine</label>
                <input
                  type="text"
                  list="med-options"
                  placeholder="Type or select medicine..."
                  value={newReminder.med}
                  onChange={(e) => setNewReminder({ ...newReminder, med: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-[#F8F8F4] dark:bg-[#141a15] text-[#1a2820] dark:text-white placeholder-[#9ab0a0] focus:outline-none focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 text-sm"
                />
                <datalist id="med-options">
                  {MEDICINE_OPTIONS.map((m) => <option key={m} value={m} />)}
                </datalist>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Time</label>
                  <select
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-[#F8F8F4] dark:bg-[#141a15] text-[#1a2820] dark:text-white focus:outline-none focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 text-sm"
                  >
                    {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">System</label>
                  <select
                    value={newReminder.system}
                    onChange={(e) => setNewReminder({ ...newReminder, system: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-[#F8F8F4] dark:bg-[#141a15] text-[#1a2820] dark:text-white focus:outline-none focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 text-sm"
                  >
                    {SYSTEMS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button
                onClick={addReminder}
                className="w-full py-3.5 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                style={{ background: "linear-gradient(135deg,#5E7464,#42594A)" }}
              >
                <Bell className="w-4 h-4" />
                Set Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
