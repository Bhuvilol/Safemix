"use client";
import { useState } from "react";
import { Bell, Clock, Plus, Check, X, Calendar, MoreVertical, AlertCircle } from "lucide-react";

const reminders = [
  { id: 1, med: "Metformin 500mg", time: "08:00 AM", status: "Taken", date: "Today", system: "Allopathic" },
  { id: 2, med: "Lisinopril 10mg", type: "Allopathic", time: "08:00 AM", status: "Taken", date: "Today", system: "Allopathic" },
  { id: 3, med: "Karela Juice", time: "10:30 AM", status: "Missed", date: "Today", system: "Ayurvedic" },
  { id: 4, med: "Metformin 500mg", time: "08:00 PM", status: "Upcoming", date: "Today", system: "Allopathic" },
  { id: 5, med: "Ashwagandha", time: "10:00 PM", status: "Upcoming", date: "Today", system: "Herbal" },
];

export default function RemindersPage() {
  const [tab, setTab] = useState("Timeline");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-manrope font-bold text-2xl text-[#1a2820] dark:text-white">Reminders</h1>
          <p className="text-sm text-[#7a9080] mt-1">Stay on track with your medication schedule.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#42594A] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          Add Reminder
        </button>
      </div>

      {/* Calendar Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[-2, -1, 0, 1, 2, 3, 4].map((offset) => {
          const date = new Date();
          date.setDate(date.getDate() + offset);
          const active = offset === 0;
          return (
            <div key={offset} className={`flex-shrink-0 w-16 p-3 rounded-2xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
              active 
                ? "bg-[#42594A] border-[#42594A] text-white scale-110 shadow-lg" 
                : "bg-white dark:bg-[#1e2820] border-[#e0e8e2] dark:border-white/10 text-[#52615a] dark:text-[#9ab0a0] hover:border-[#5E7464]/30"
            }`}>
              <span className="text-[10px] font-bold uppercase mb-1">{date.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
              <span className="text-lg font-bold font-manrope">{date.getDate()}</span>
            </div>
          );
        })}
      </div>

      {/* Timeline UI */}
      <div className="bg-white dark:bg-[#1e2820] rounded-3xl border border-[#e0e8e2] dark:border-white/10 p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-manrope font-bold text-lg text-[#1a2820] dark:text-white">Today&apos;s Schedule</h2>
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
          {reminders.map((r) => (
            <div key={r.id} className="relative flex items-start gap-6 group">
              {/* Dot */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 border-white dark:border-[#1e2820] transition-colors ${
                r.status === "Taken" ? "bg-emerald-500" : r.status === "Missed" ? "bg-red-500" : "bg-[#e8ede9] dark:bg-[#2a3430]"
              }`}>
                {r.status === "Taken" ? <Check className="w-4 h-4 text-white" /> : 
                 r.status === "Missed" ? <X className="w-4 h-4 text-white" /> : 
                 <Clock className="w-4 h-4 text-[#9ab0a0]" />}
              </div>

              {/* Content */}
              <div className={`flex-1 p-5 rounded-2xl border transition-all ${
                r.status === "Upcoming" 
                  ? "bg-[#F8F8F4] dark:bg-[#141a15] border-[#e0e8e2] dark:border-white/10 hover:border-[#5E7464]/30" 
                  : "bg-white dark:bg-[#1e2820] border-[#f0f4f1] dark:border-white/5 opacity-80"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#5E7464] font-mono">{r.time}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      r.system === "Ayurvedic" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                    }`}>{r.system}</span>
                  </div>
                  <button className="text-[#9ab0a0] hover:text-[#52615a]"><MoreVertical className="w-4 h-4" /></button>
                </div>
                <h3 className="font-bold text-[#1a2820] dark:text-white mb-4">{r.med}</h3>
                
                {r.status === "Upcoming" && (
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                      <Check className="w-3.5 h-3.5" /> Mark Taken
                    </button>
                    <button className="px-4 py-2.5 rounded-xl border border-[#e0e8e2] dark:border-white/10 text-xs font-bold text-[#52615a] dark:text-[#9ab0a0] hover:bg-[#f0f5f1] transition-all">
                      Snooze
                    </button>
                    <button className="px-4 py-2.5 rounded-xl border border-[#e0e8e2] dark:border-white/10 text-xs font-bold text-red-500 hover:bg-red-50 transition-all">
                      Skip
                    </button>
                  </div>
                )}

                {r.status === "Missed" && (
                  <div className="flex items-center gap-2 text-red-600 text-[10px] font-bold uppercase tracking-wider">
                    <AlertCircle className="w-3 h-3" />
                    Missed this dose • Would you like to log it now?
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
    </div>
  );
}
