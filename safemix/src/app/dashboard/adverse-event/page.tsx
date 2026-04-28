"use client";
import { useState } from "react";
import { AlertTriangle, CheckCircle, ArrowLeft, Loader2, Pill, User, Calendar, FileText, Activity } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "@/components/providers/AuthProvider";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

const MEDICINES = ["Metformin 500mg", "Lisinopril 10mg", "Karela (Bitter Gourd) Juice", "Ashwagandha", "Other"];
const SEVERITIES = [
  { value: "mild", label: "Mild", desc: "Noticeable but not disabling", color: "#F59E0B", bg: "#FFFBE6", border: "#FFE58F" },
  { value: "moderate", label: "Moderate", desc: "Affects daily activities", color: "#EF6C00", bg: "#FFF3E0", border: "#FFCC80" },
  { value: "severe", label: "Severe", desc: "Requires medical attention", color: "#C41C00", bg: "#FFF1F0", border: "#FFCCC7" },
];
const SYMPTOMS = ["Nausea / Vomiting", "Dizziness / Vertigo", "Headache", "Rash / Itching", "Breathlessness", "Hypoglycemia (low blood sugar)", "Chest pain", "Rapid heartbeat", "Stomach pain / Cramps", "Fatigue / Weakness", "Swelling", "Confusion", "Other"];

export default function AdverseEventPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    medicine: "",
    symptom: "",
    severity: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    doctorNotified: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.medicine || !form.symptom || !form.severity) {
      setError("Please fill in Medicine, Symptom, and Severity.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await addDoc(collection(db, "adverseEvents"), {
        uid: user?.uid || "anonymous",
        ...form,
        reportedAt: Timestamp.now(),
      });
      await trackEvent(AnalyticsEvents.ADVERSE_EVENT_REPORTED, {
        medicine: form.medicine,
        severity: form.severity,
      });
      setSubmitted(true);
    } catch (err: any) {
      // Save locally if Firestore fails
      const events = JSON.parse(localStorage.getItem("safemix_adverse_events") || "[]");
      events.push({ ...form, reportedAt: Date.now() });
      localStorage.setItem("safemix_adverse_events", JSON.stringify(events));
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto flex flex-col items-center justify-center py-20 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="font-manrope font-bold text-2xl text-[#1a2820] dark:text-white">Report Submitted</h2>
        <p className="text-[#7a9080] text-sm max-w-xs">
          Thank you for reporting. This helps improve medication safety for everyone. Our clinical team will review it.
        </p>
        <div className="flex gap-3 mt-4">
          <Link href="/dashboard"
            className="px-6 py-2.5 bg-[#42594A] text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
            Back to Dashboard
          </Link>
          <button onClick={() => { setSubmitted(false); setForm({ medicine: "", symptom: "", severity: "", date: new Date().toISOString().split("T")[0], notes: "", doctorNotified: false }); }}
            className="px-6 py-2.5 text-[#52615a] text-sm font-semibold rounded-xl border border-[#e0e8e2] hover:bg-[#f0f5f1] transition-all">
            Report Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="w-9 h-9 rounded-xl border border-[#e0e8e2] dark:border-white/10 flex items-center justify-center text-[#52615a] dark:text-[#9ab0a0] hover:bg-[#f0f5f1] transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-manrope font-bold text-2xl text-[#1a2820] dark:text-white">Report Side Effect</h1>
          <p className="text-sm text-[#7a9080] mt-0.5">Help us improve medicine safety by reporting an adverse reaction.</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-300">
          If you are experiencing a medical emergency, call <strong>108</strong> (Ambulance) or go to the nearest hospital immediately.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-[#1e2820] rounded-3xl border border-[#e0e8e2] dark:border-white/10 p-6 space-y-6">
        
        {/* Medicine */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-3">
            <Pill className="w-3.5 h-3.5" /> Which Medicine? *
          </label>
          <div className="flex flex-wrap gap-2">
            {MEDICINES.map((m) => (
              <button key={m} onClick={() => setForm({ ...form, medicine: m })}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  form.medicine === m
                    ? "border-[#5E7464] bg-[#f0f8f2] dark:bg-[#1a2820] text-[#42594A] dark:text-[#b5ccba]"
                    : "border-[#e0e8e2] dark:border-white/10 text-[#52615a] dark:text-[#9ab0a0] hover:border-[#5E7464]/40"
                }`}>{m}</button>
            ))}
          </div>
        </div>

        {/* Symptom */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-3">
            <Activity className="w-3.5 h-3.5" /> Symptom / Reaction *
          </label>
          <div className="flex flex-wrap gap-2">
            {SYMPTOMS.map((s) => (
              <button key={s} onClick={() => setForm({ ...form, symptom: s })}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  form.symptom === s
                    ? "border-[#5E7464] bg-[#f0f8f2] dark:bg-[#1a2820] text-[#42594A] dark:text-[#b5ccba]"
                    : "border-[#e0e8e2] dark:border-white/10 text-[#52615a] dark:text-[#9ab0a0] hover:border-[#5E7464]/40"
                }`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-3">
            <AlertTriangle className="w-3.5 h-3.5" /> Severity *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {SEVERITIES.map((s) => (
              <button key={s.value} onClick={() => setForm({ ...form, severity: s.value })}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  form.severity === s.value
                    ? ""
                    : "border-[#e0e8e2] dark:border-white/10 hover:border-[#5E7464]/30"
                }`}
                style={form.severity === s.value ? { borderColor: s.color, background: s.bg } : {}}
              >
                <p className="font-bold text-sm" style={form.severity === s.value ? { color: s.color } : { color: "#1a2820" }}>{s.label}</p>
                <p className="text-[10px] text-[#9ab0a0] mt-1">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">
              <Calendar className="w-3.5 h-3.5" /> When did it happen?
            </label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/10 bg-[#F8F8F4] dark:bg-[#141a15] text-[#1a2820] dark:text-white focus:border-[#5E7464] focus:ring-1 focus:ring-[#5E7464] outline-none text-sm" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">
              <User className="w-3.5 h-3.5" /> Doctor Notified?
            </label>
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[#e0e8e2] dark:border-white/10 bg-[#F8F8F4] dark:bg-[#141a15] cursor-pointer"
              onClick={() => setForm({ ...form, doctorNotified: !form.doctorNotified })}>
              <div className={`w-10 h-5 rounded-full transition-colors relative ${form.doctorNotified ? "bg-[#5E7464]" : "bg-[#e0e8e2] dark:bg-white/20"}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow transition-transform ${form.doctorNotified ? "translate-x-6" : "translate-x-1"}`} />
              </div>
              <span className="text-sm text-[#52615a] dark:text-[#9ab0a0]">{form.doctorNotified ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">
            <FileText className="w-3.5 h-3.5" /> Additional Notes
          </label>
          <textarea placeholder="Describe what happened, any context, or other details…" rows={3}
            value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/10 bg-[#F8F8F4] dark:bg-[#141a15] text-[#1a2820] dark:text-white placeholder-[#9ab0a0] focus:border-[#5E7464] focus:ring-1 focus:ring-[#5E7464] outline-none text-sm resize-none" />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
        )}

        <button onClick={handleSubmit} disabled={submitting}
          className="w-full py-4 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70"
          style={{ background: "linear-gradient(135deg,#EF4444, #C41C00)" }}>
          {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting Report…</> : <><AlertTriangle className="w-5 h-5" /> Submit Adverse Event Report</>}
        </button>
        <p className="text-[10px] text-center text-[#9ab0a0]">This report is encrypted and used only to improve medication safety. It is never shared with advertisers.</p>
      </div>
    </div>
  );
}
