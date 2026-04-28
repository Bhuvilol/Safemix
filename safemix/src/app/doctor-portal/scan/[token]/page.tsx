"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AlertTriangle, CheckCircle, AlertCircle, Clock, Shield, Pill, ArrowLeft, XCircle } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

// Medicine data that would come from Firestore in production
const DEMO_REGIMEN = [
  { name: "Metformin 500mg", system: "Allopathic", dosage: "500mg", frequency: "Twice daily", timing: "After meals" },
  { name: "Lisinopril 10mg", system: "Allopathic", dosage: "10mg", frequency: "Once daily", timing: "Morning" },
  { name: "Karela (Bitter Gourd) Juice", system: "Ayurvedic", dosage: "30ml", frequency: "Once daily", timing: "Empty stomach" },
  { name: "Ashwagandha", system: "Herbal", dosage: "1 capsule", frequency: "Once daily", timing: "Night" },
];

const DEMO_ALERTS = [
  { verdict: "red" as const, pair: "Metformin + Karela Juice", reason: "Both lower blood glucose — combined use may cause hypoglycemia. Monitor blood sugar closely." },
  { verdict: "yellow" as const, pair: "Lisinopril + Ashwagandha", reason: "Ashwagandha may mildly lower blood pressure. Combination may potentiate hypotensive effects." },
];

const systemColor: Record<string, string> = {
  "Allopathic": "#3B82F6",
  "Ayurvedic": "#10B981",
  "Herbal": "#8B5CF6",
  "OTC": "#F59E0B",
  "Supplement": "#06B6D4",
};

interface TokenPayload {
  uid: string;
  expiry: number;
  issued: number;
}

function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = JSON.parse(atob(decodeURIComponent(token)));
    return decoded as TokenPayload;
  } catch {
    return null;
  }
}

export default function DoctorPortalScanPage() {
  const params = useParams();
  const token = params?.token as string | undefined;

  const [status, setStatus] = useState<"loading" | "valid" | "expired" | "invalid">("loading");
  const [payload, setPayload] = useState<TokenPayload | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!token) { setStatus("invalid"); return; }

    const decoded = decodeToken(token);
    if (!decoded) { setStatus("invalid"); return; }

    setPayload(decoded);
    if (Date.now() > decoded.expiry) {
      setStatus("expired");
    } else {
      setStatus("valid");
    }
  }, [token]);

  // Live countdown
  useEffect(() => {
    if (status !== "valid" || !payload) return;
    const interval = setInterval(() => {
      const remaining = payload.expiry - Date.now();
      if (remaining <= 0) { setStatus("expired"); clearInterval(interval); return; }
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      setTimeLeft(`${mins}m ${secs}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [status, payload]);

  const verdictConfig = {
    red: { bg: "#FFF1F0", border: "#FFCCC7", text: "#C41C00", iconBg: "#FFCCC7", icon: AlertTriangle },
    yellow: { bg: "#FFFBE6", border: "#FFE58F", text: "#875400", iconBg: "#FFE58F", icon: AlertCircle },
    green: { bg: "#F6FFED", border: "#B7EB8F", text: "#237804", iconBg: "#B7EB8F", icon: CheckCircle },
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF8]">
        <div className="w-10 h-10 rounded-full border-4 border-[#5E7464] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF8] dark:bg-[#0f1410] p-4">
        <div className="max-w-sm w-full bg-white dark:bg-[#1e2820] rounded-3xl border border-[#e0e8e2] dark:border-white/10 p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="font-manrope font-bold text-xl text-[#1a2820] dark:text-white">QR Code Expired</h2>
          <p className="text-sm text-[#7a9080]">This secure link has expired. Ask the patient to generate a new QR code from their SafeMix app.</p>
          <Link href="/" className="block w-full py-3 text-sm font-semibold rounded-xl bg-[#42594A] text-white text-center">
            Go to SafeMix
          </Link>
        </div>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF8] dark:bg-[#0f1410] p-4">
        <div className="max-w-sm w-full bg-white dark:bg-[#1e2820] rounded-3xl border border-[#e0e8e2] dark:border-white/10 p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="font-manrope font-bold text-xl text-[#1a2820] dark:text-white">Invalid QR Code</h2>
          <p className="text-sm text-[#7a9080]">This link is invalid or has been tampered with. Please scan the QR code directly from the patient's device.</p>
          <Link href="/" className="block w-full py-3 text-sm font-semibold rounded-xl bg-[#42594A] text-white text-center">
            Go to SafeMix
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0f1410] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white dark:bg-[#1e2820] rounded-3xl border border-[#e0e8e2] dark:border-white/10 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#5E7464,#42594A)" }}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#5E7464]">SafeMix Doctor Portal</p>
              <h1 className="font-manrope font-bold text-xl text-[#1a2820] dark:text-white">Patient Medication Review</h1>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Secure · Temporary Access
            </div>
            {timeLeft && <p className="text-[11px] text-[#9ab0a0] mt-1">Expires in {timeLeft}</p>}
          </div>
        </div>

        {/* Patient Info */}
        <div className="bg-white dark:bg-[#1e2820] rounded-3xl border border-[#e0e8e2] dark:border-white/10 p-6">
          <h2 className="font-manrope font-semibold text-[#1a2820] dark:text-white mb-4">Patient Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Name", value: "Rahul (ID: " + (payload?.uid?.slice(0, 6) || "S125") + ")" },
              { label: "Age", value: "45 years" },
              { label: "Conditions", value: "Type 2 Diabetes, Hypertension" },
              { label: "Shared", value: new Date(payload?.issued || Date.now()).toLocaleString("en-IN") },
            ].map((f) => (
              <div key={f.label} className="p-3 rounded-xl bg-[#f8faf8] dark:bg-[#141a15]">
                <p className="text-[10px] font-bold text-[#9ab0a0] uppercase tracking-widest mb-1">{f.label}</p>
                <p className="text-sm font-semibold text-[#1a2820] dark:text-white">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Interaction Alerts */}
        <div className="space-y-3">
          <h2 className="font-manrope font-semibold text-[#1a2820] dark:text-white px-1">AI Interaction Analysis</h2>
          {DEMO_ALERTS.map((alert, i) => {
            const v = verdictConfig[alert.verdict];
            return (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl border" style={{ background: v.bg, borderColor: v.border }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: v.iconBg }}>
                  <v.icon className="w-5 h-5" style={{ color: v.text }} />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: v.text }}>{alert.pair}</p>
                  <p className="text-sm mt-1" style={{ color: v.text, opacity: 0.85 }}>{alert.reason}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Medicines Table */}
        <div className="bg-white dark:bg-[#1e2820] rounded-3xl border border-[#e0e8e2] dark:border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#f0f4f1] dark:border-white/10 flex items-center gap-3">
            <Pill className="w-4 h-4 text-[#5E7464]" />
            <h2 className="font-manrope font-semibold text-[#1a2820] dark:text-white">Current Medicines ({DEMO_REGIMEN.length})</h2>
          </div>
          <div className="divide-y divide-[#f0f4f1] dark:divide-white/5">
            {DEMO_REGIMEN.map((m) => (
              <div key={m.name} className="flex items-center gap-4 px-6 py-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: systemColor[m.system] || "#9ab0a0" }}>
                  {m.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1a2820] dark:text-white">{m.name}</p>
                  <p className="text-xs text-[#9ab0a0]">{m.dosage} · {m.frequency} · {m.timing}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${systemColor[m.system]}15`, color: systemColor[m.system] || "#9ab0a0" }}>
                  {m.system}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#9ab0a0] pb-8">
          ⚕ SafeMix · Secure Doctor Portal · Data encrypted in transit · Access expires automatically
        </p>
      </div>
    </div>
  );
}
