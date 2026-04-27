"use client";
import { useState } from "react";
import { QrCode, Clock, Shield, Share2, ArrowRight, History } from "lucide-react";

const pastShares = [
  { id: "S123", doctor: "Dr. Sharma", hospital: "Apollo Hospitals", date: "24 Apr 2026", expiry: "Expired", status: "Expired" },
  { id: "S124", doctor: "Dr. Reddy", hospital: "Self-Share", date: "26 Apr 2026", expiry: "In 2 hours", status: "Active" },
];

export default function DoctorSharePage() {
  const [expiry, setExpiry] = useState("1 hour");
  const [generating, setGenerating] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setQrGenerated(true);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-manrope font-bold text-2xl text-[#1a2820] dark:text-white">Doctor Share</h1>
        <p className="text-sm text-[#7a9080] mt-1">Generate a secure, time-limited QR code for your doctor to review your medicines.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Generator */}
        <div className="bg-white dark:bg-[#1e2820] rounded-3xl border border-[#e0e8e2] dark:border-white/10 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5E7464]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#5E7464]" />
            </div>
            <h2 className="font-manrope font-semibold text-[#1a2820] dark:text-white">Generate Secure Link</h2>
          </div>

          {!qrGenerated ? (
            <>
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest">Access Duration</label>
                <div className="grid grid-cols-3 gap-3">
                  {["15 min", "1 hour", "24 hour"].map((time) => (
                    <button
                      key={time}
                      onClick={() => setExpiry(time)}
                      className={`py-3 rounded-2xl border text-sm font-medium transition-all ${
                        expiry === time
                          ? "border-[#5E7464] bg-[#f0f8f2] dark:bg-[#202a22] text-[#42594A] dark:text-[#b5ccba]"
                          : "border-[#e0e8e2] dark:border-white/10 bg-[#F8F8F4] dark:bg-[#141a15] text-[#7a9080] hover:border-[#5E7464]/40"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  <strong>Privacy Note:</strong> Your doctor will see your current medicine regimen and interaction analysis. They will NOT see your personal settings or full history.
                </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full flex items-center justify-center gap-3 text-white text-sm font-semibold py-4 rounded-2xl transition-all hover:shadow-[0_8px_30px_rgba(94,116,100,0.35)] active:scale-[0.99] disabled:opacity-70"
                style={{ background: "linear-gradient(135deg,#5E7464,#42594A)" }}
              >
                {generating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <QrCode className="w-5 h-5" />
                    Generate Doctor QR
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="w-48 h-48 mx-auto bg-white p-4 rounded-3xl border-4 border-[#f0f8f2] shadow-sm relative group">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://safemix.ai/doctor-portal/view/S125" 
                  alt="Doctor Portal QR"
                  className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                  <span className="text-xs font-bold text-[#42594A]">SCAN TO VIEW</span>
                </div>
              </div>
              
              <div>
                <p className="font-semibold text-[#1a2820] dark:text-white">QR Code Active</p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  Expires in {expiry}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#e0e8e2] dark:border-white/10 text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] hover:bg-[#f0f5f1] dark:hover:bg-[#2a3430] transition-all">
                  <Share2 className="w-3.5 h-3.5" />
                  Copy Link
                </button>
                <button onClick={() => setQrGenerated(false)} className="flex-1 py-3 rounded-2xl bg-[#f0f5f1] dark:bg-[#2a3430] text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] hover:bg-[#e0e8e2] dark:hover:bg-[#344038] transition-all">
                  Revoke Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info / Past Shares */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1e2820] rounded-3xl border border-[#e0e8e2] dark:border-white/10 p-6">
            <h3 className="font-manrope font-semibold text-[#1a2820] dark:text-white mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-[#9ab0a0]" />
              Past Shares
            </h3>
            <div className="space-y-3">
              {pastShares.map((share) => (
                <div key={share.id} className="p-4 rounded-2xl bg-[#F8F8F4] dark:bg-[#141a15] border border-[#e0e8e2] dark:border-white/10 flex items-center justify-between group hover:border-[#5E7464]/30 transition-all">
                  <div>
                    <p className="text-sm font-semibold text-[#1a2820] dark:text-white">{share.doctor}</p>
                    <p className="text-[10px] text-[#9ab0a0] mt-0.5">{share.hospital} • {share.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      share.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-[#e8ede9] text-[#7a9080]"
                    }`}>
                      {share.status}
                    </span>
                    <p className="text-[10px] text-[#9ab0a0] mt-1">{share.expiry}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#42594A] to-[#2d4035] rounded-3xl p-6 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="font-manrope font-bold text-lg mb-2 relative z-10">How it works</h3>
            <ul className="space-y-3 relative z-10">
              {[
                "1. Choose an expiry duration",
                "2. Show the QR to your doctor",
                "3. They see your safety report",
                "4. Access vanishes automatically"
              ].map((step) => (
                <li key={step} className="text-xs text-white/80 flex items-center gap-2 font-medium">
                  <ArrowRight className="w-3 h-3 text-[#b5ccba]" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
