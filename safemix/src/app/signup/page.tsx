"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SafeMixLogo from "@/components/ui/Logo";
import { Eye, EyeOff, Check, ArrowRight } from "lucide-react";

const roles = [
  { id: "patient", label: "Patient", desc: "Managing my own medicines", icon: "person" },
  { id: "caregiver", label: "Caregiver", desc: "Managing medicines for family", icon: "family_restroom" },
  { id: "doctor", label: "Doctor", desc: "Reviewing patient medicines", icon: "stethoscope" },
];

export default function SignupPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("patient");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  return (
    <div className="min-h-screen flex bg-[#F8F8F4] dark:bg-[#0f1410]">

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] relative overflow-hidden p-12" style={{ background: "linear-gradient(145deg,#1e2f25 0%,#0f1a13 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle,#5E7464,transparent)" }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-15" style={{ background: "radial-gradient(circle,#3B82F6,transparent)" }} />
        </div>

        <Link href="/"><SafeMixLogo size={36} textSize="text-xl" /></Link>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#9ab0a0] text-xs font-semibold mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Free forever • No credit card
          </div>
          <h2 className="font-manrope font-bold text-4xl text-white mb-5 leading-tight">
            Start Protecting<br />Your Health Today
          </h2>
          <p className="text-[#9ab0a0] text-lg mb-10">
            It takes 30 seconds. No credit card. Full access immediately.
          </p>

          <div className="space-y-3">
            {["Instant AI interaction detection","Family profiles & caregiver mode","Doctor QR sharing built in","Works in 10+ Indian languages"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#5E7464]/40 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#9ab0a0]" />
                </div>
                <span className="text-[#c3d4c8] text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[#607060]">Trusted by 500,000+ users across India</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/"><SafeMixLogo size={30} textSize="text-lg" /></Link>
          </div>

          <div className="mb-7">
            <h1 className="font-manrope font-bold text-3xl text-[#1a2820] dark:text-white mb-2">Create your account</h1>
            <p className="text-[#52615a] dark:text-[#9ab0a0]">Free to start. Upgrade anytime.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role picker */}
            <div>
              <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button key={r.id} type="button" onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                      role === r.id
                        ? "border-[#5E7464] bg-[#f0f8f2] dark:bg-[#1e2820] text-[#42594A] dark:text-[#b5ccba]"
                        : "border-[#e0e8e2] dark:border-white/10 bg-white dark:bg-[#1a2218] text-[#52615a] dark:text-[#7a9080] hover:border-[#5E7464]/40"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-xl ${role === r.id ? "text-[#5E7464]" : "text-[#9ab0a0]"}`}>{r.icon}</span>
                    <span className="text-xs font-semibold">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Full Name</label>
                <input type="text" placeholder="Rahul Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-white dark:bg-[#1e2820] text-[#1a2820] dark:text-white placeholder-[#9ab0a0] focus:outline-none focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Phone</label>
                <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-white dark:bg-[#1e2820] text-[#1a2820] dark:text-white placeholder-[#9ab0a0] focus:outline-none focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Email</label>
              <input type="email" placeholder="rahul@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-white dark:bg-[#1e2820] text-[#1a2820] dark:text-white placeholder-[#9ab0a0] focus:outline-none focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} placeholder="Create a strong password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-white dark:bg-[#1e2820] text-[#1a2820] dark:text-white placeholder-[#9ab0a0] focus:outline-none focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 transition-all text-sm"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ab0a0] hover:text-[#5E7464]">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-3.5 rounded-xl transition-all hover:shadow-[0_8px_30px_rgba(94,116,100,0.35)] active:scale-[0.99] disabled:opacity-70 mt-2"
              style={{ background: "linear-gradient(135deg,#5E7464,#42594A)" }}
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Create SafeMix Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-xs text-[#9ab0a0] mt-5">
            By signing up, you agree to our{" "}
            <Link href="#" className="text-[#5E7464] hover:underline">Terms</Link> and{" "}
            <Link href="#" className="text-[#5E7464] hover:underline">Privacy Policy</Link>
          </p>
          <p className="text-center text-sm text-[#52615a] dark:text-[#9ab0a0] mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[#5E7464] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
