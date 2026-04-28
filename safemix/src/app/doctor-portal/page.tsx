"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SafeMixLogo from "@/components/ui/Logo";
import { 
  Stethoscope, 
  User, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Printer, 
  Download, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  ClipboardCheck,
  Zap
} from "lucide-react";

const patientData = {
  name: "Rahul Sharma",
  age: 42,
  gender: "Male",
  id: "P-77291",
  lastCheck: "26 Apr 2026, 11:40 AM",
  // expiry is computed dynamically — 45 min window from page load
};

const medicines = [
  { name: "Metformin 500mg", type: "Allopathic", dose: "1-0-1", timing: "After meals", duration: "90 Days" },
  { name: "Lisinopril 10mg", type: "Allopathic", dose: "1-0-0", timing: "Morning", duration: "Ongoing" },
  { name: "Karela Juice", type: "Ayurvedic", dose: "20ml", timing: "Empty stomach", duration: "Daily" },
  { name: "Ashwagandha", type: "Herbal", dose: "1 cap", timing: "Night", duration: "30 Days" },
];

const interactions = [
  {
    pair: ["Metformin", "Karela Juice"],
    severity: "red",
    title: "Severe Glycemic Risk",
    desc: "Synergistic effect may lead to profound hypoglycemia. Patient's glucose levels may drop dangerously low if taken concurrently.",
    recommendation: "Stop Karela juice or space at least 8 hours from Metformin. Monitor HbA1c."
  },
  {
    pair: ["Lisinopril", "Potassium-rich foods"],
    severity: "yellow",
    title: "Hyperkalemia Caution",
    desc: "Lisinopril is potassium-sparing. Combined with high dietary potassium (e.g., Bananas), risk of hyperkalemia increases.",
    recommendation: "Advise patient to limit high-potassium intake. Check serum electrolytes."
  }
];

export default function DoctorPortalPage() {
  const [acknowledged, setAcknowledged] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [expired, setExpired] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 45-minute demo access window starting from page load
  useEffect(() => {
    const expiryTs = Date.now() + 45 * 60 * 1000;

    const formatMs = (ms: number) => {
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    setTimeLeft(formatMs(expiryTs - Date.now()));

    timerRef.current = setInterval(() => {
      const remaining = expiryTs - Date.now();
      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        setExpired(true);
        setTimeLeft("00:00");
        return;
      }
      setTimeLeft(formatMs(remaining));
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, []);

  const handlePrint = () => window.print();

  const handleDownloadPDF = () => {
    const prev = document.title;
    document.title = `SafeMix_Doctor_Report_${patientData.id}.pdf`;
    window.print();
    document.title = prev;
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col font-sans">
      {/* Clinical Header */}
      <header className="bg-white border-b border-[#e0e8e2] h-16 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/doctor-share"
            className="print:hidden flex items-center gap-1.5 text-xs font-semibold text-[#52615a] hover:text-[#5E7464] transition-colors group">
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Patient Portal</span>
          </Link>
          <div className="h-6 w-px bg-[#e0e8e2] print:hidden" />
          <Link href="/">
            <SafeMixLogo size={28} textSize="text-base" />
          </Link>
          <div className="h-6 w-px bg-[#e0e8e2] hidden md:block" />
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#52615a] uppercase tracking-widest">
            <Stethoscope className="w-4 h-4 text-[#5E7464]" />
            Doctor Portal <span className="mx-2 text-[#c3d4c8]">•</span> Clinical Review Mode
          </div>
        </div>

          <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col items-end text-right">
            <span className="text-xs font-bold text-[#1a2820]">Access expires in</span>
            <span className={`text-[10px] font-bold font-mono ${expired ? "text-red-500" : "text-emerald-600"}`}>
              {expired ? "Expired" : timeLeft}
            </span>
          </div>
          <button
            onClick={handlePrint}
            title="Print this report"
            className="print:hidden p-2 rounded-xl bg-[#F8F8F4] border border-[#e0e8e2] text-[#52615a] hover:bg-white hover:border-[#5E7464]/40 hover:text-[#5E7464] transition-all">
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadPDF}
            className="print:hidden hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#42594A] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid lg:grid-cols-3 gap-8">
        {/* Left Col: Patient Info & Medicines */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Card */}
          <div className="bg-white rounded-3xl border border-[#e0e8e2] p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#5E7464]/10 flex items-center justify-center text-[#5E7464]">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="font-manrope font-bold text-2xl text-[#1a2820]">{patientData.name}</h1>
                  <p className="text-sm text-[#7a9080]">{patientData.gender} • {patientData.age} Years • ID: {patientData.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center md:text-left">
                <div className="p-3 rounded-2xl bg-[#F8F8F4] border border-[#e0e8e2]">
                  <p className="text-[10px] font-bold text-[#9ab0a0] uppercase tracking-wider">Weight</p>
                  <p className="text-sm font-bold text-[#1a2820]">74 kg</p>
                </div>
                <div className="p-3 rounded-2xl bg-[#F8F8F4] border border-[#e0e8e2]">
                  <p className="text-[10px] font-bold text-[#9ab0a0] uppercase tracking-wider">Blood Group</p>
                  <p className="text-sm font-bold text-red-600">B+</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-manrope font-bold text-lg text-[#1a2820] flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-[#5E7464]" />
                Current Medication Regimen
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-[#9ab0a0] uppercase tracking-widest border-b border-[#f0f4f1]">
                      <th className="pb-3 px-2">Medicine</th>
                      <th className="pb-3 px-2">System</th>
                      <th className="pb-3 px-2">Dosage</th>
                      <th className="pb-3 px-2">Timing</th>
                      <th className="pb-3 px-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f4f1]">
                    {medicines.map((m) => (
                      <tr key={m.name} className="hover:bg-[#F8F8F4] transition-colors group">
                        <td className="py-4 px-2">
                          <p className="text-sm font-bold text-[#1a2820] group-hover:text-[#5E7464] transition-colors">{m.name}</p>
                        </td>
                        <td className="py-4 px-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ m.type === "Ayurvedic" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700" }`}>
                            {m.type}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-sm font-medium text-[#52615a]">{m.dose}</td>
                        <td className="py-4 px-2 text-sm text-[#52615a]">{m.timing}</td>
                        <td className="py-4 px-2 text-sm text-[#52615a] font-mono">{m.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Clinical Insights */}
          <div className="bg-white rounded-3xl border border-[#e0e8e2] p-6 md:p-8">
            <h3 className="font-manrope font-bold text-lg text-[#1a2820] mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#F59E0B]" />
              AI Interaction Analysis
            </h3>
            <div className="space-y-4">
              {interactions.map((ix, i) => (
                <div key={i} className={`p-6 rounded-2xl border ${ ix.severity === "red" ? "bg-red-50/50 border-red-100 " : "bg-amber-50/50 border-amber-100 " }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${ ix.severity === "red" ? "bg-red-600 text-white" : "bg-amber-500 text-white" }`}>
                      {ix.severity === "red" ? "Severe Alert" : "Clinical Caution"}
                    </span>
                    <h4 className="font-manrope font-bold text-[#1a2820]">{ix.pair[0]} <span className="text-[#9ab0a0] mx-1">×</span> {ix.pair[1]}</h4>
                  </div>
                  <p className="text-sm font-bold text-[#1a2820] mb-2">{ix.title}</p>
                  <p className="text-sm text-[#52615a] mb-4 leading-relaxed">{ix.desc}</p>
                  <div className={`p-4 rounded-xl border flex items-start gap-3 ${ ix.severity === "red" ? "bg-white/80 border-red-200 " : "bg-white/80 border-amber-200 " }`}>
                    <ShieldCheck className={`w-5 h-5 flex-shrink-0 mt-0.5 ${ix.severity === "red" ? "text-red-600" : "text-amber-600"}`} />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-[#9ab0a0] mb-1">Recommendation</p>
                      <p className="text-sm font-medium text-[#1a2820] leading-relaxed">{ix.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Review & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#e0e8e2] p-6 sticky top-24">
            <h3 className="font-manrope font-bold text-lg text-[#1a2820] mb-4">Complete Review</h3>
            <p className="text-sm text-[#52615a] mb-6 leading-relaxed">
              Once you have discussed these findings with the patient, please acknowledge the review. This will notify the patient and update their safety history.
            </p>
            
            <div className="space-y-4 mb-6">
              <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#F8F8F4] border border-[#e0e8e2] cursor-pointer group hover:border-[#5E7464]/30 transition-all">
                <input type="checkbox" className="mt-1 accent-[#5E7464] w-4 h-4" checked={acknowledged} onChange={() => setAcknowledged(!acknowledged)} />
                <span className="text-sm text-[#52615a] group-hover:text-[#1a2820] transition-colors">
                  I have reviewed the medication interactions with the patient.
                </span>
              </label>
            </div>

            <button 
              disabled={!acknowledged}
              onClick={() => alert("Review Acknowledged. Patient has been notified.")}
              className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${ acknowledged ? "bg-[#42594A] text-white hover:shadow-xl" : "bg-[#e8ede9] text-[#9ab0a0] cursor-not-allowed" }`}
            >
              Send Clinical Acknowledgment
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-8 pt-6 border-t border-[#f0f4f1] space-y-4">
              <h4 className="text-[10px] font-black text-[#9ab0a0] uppercase tracking-widest">Clinical Audit</h4>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#52615a]">Shared via QR Code</span>
                <span className="font-bold text-[#1a2820]">Yes</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#52615a]">Generated At</span>
                <span className="font-bold text-[#1a2820]">11:40 AM today</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#52615a]">Data Source</span>
                <span className="font-bold text-emerald-600">SafeMix AI Core v2.4</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-emerald-600 text-white">
            <h4 className="font-manrope font-bold text-lg mb-2">Need a Hospital Demo?</h4>
            <p className="text-sm text-white/80 mb-6 leading-relaxed">
              Integrate SafeMix directly into your EMR system for automated patient safety checks.
            </p>
            <Link href="/contact" className="w-full py-3 bg-white text-emerald-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#f0f5f1] transition-all">
              Request Full Integration
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 px-6 text-center text-[#9ab0a0] text-xs mt-auto">
        SafeMix Doctor Portal v4.2 • Secured with AES-256 • DPDP Compliant
      </footer>
    </div>
  );
}
