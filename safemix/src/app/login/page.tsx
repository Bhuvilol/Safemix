"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SafeMixLogo from "@/components/ui/Logo";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { loginLocal } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ credential: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Bypass: create a local session using the credential as phone/email
    const uid = "user_login_" + Math.random().toString(36).substr(2, 9);
    loginLocal(uid, form.credential || "+91-login-user");
    setTimeout(() => router.push("/dashboard"), 800);
  };

  return (
    <div className="min-h-screen flex bg-[#F8F8F4] dark:bg-[#0f1410]">

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-12" style={{ background: "linear-gradient(145deg,#2d4035 0%,#1a2820 100%)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-20 right-20 w-80 h-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle,#5E7464,transparent)" }} />
          <div className="absolute bottom-20 left-20 w-60 h-60 rounded-full blur-3xl" style={{ background: "radial-gradient(circle,#3B82F6,transparent)" }} />
        </div>

        <Link href="/">
          <SafeMixLogo size={36} textSize="text-xl" />
        </Link>

        <div className="relative z-10">
          <h2 className="font-manrope font-bold text-4xl text-white mb-5 leading-tight">
            Safer Medicine,<br />Smarter Decisions
          </h2>
          <p className="text-[#9ab0a0] text-lg mb-10 leading-relaxed">
            Join 500,000+ Indians who check their medicines before they take them.
          </p>
          <div className="space-y-4">
            {[
              { icon: "fact_check", text: "Red / Yellow / Green safety verdicts" },
              { icon: "qr_code_2", text: "Share regimen with doctors via QR" },
              { icon: "family_restroom", text: "Manage medicines for your whole family" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#9ab0a0] text-base">{f.icon}</span>
                </div>
                <span className="text-[#c3d4c8] text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {[1,2,3].map((i) => (
            <div key={i} className={`rounded-full bg-white/20 ${i === 1 ? "w-8 h-2" : "w-2 h-2"}`} />
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/"><SafeMixLogo size={32} textSize="text-lg" /></Link>
          </div>

          <div className="mb-8">
            <h1 className="font-manrope font-bold text-3xl text-[#1a2820] dark:text-white mb-2">Welcome back</h1>
            <p className="text-[#52615a] dark:text-[#9ab0a0]">Sign in to your SafeMix account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Email or Phone</label>
              <input
                type="text"
                placeholder="rahul@example.com or +91 98765 43210"
                value={form.credential}
                onChange={(e) => setForm({ ...form, credential: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-white dark:bg-[#1e2820] text-[#1a2820] dark:text-white placeholder-[#9ab0a0] focus:outline-none focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 transition-all text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest">Password</label>
                <Link href="#" className="text-xs text-[#5E7464] hover:underline font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-white dark:bg-[#1e2820] text-[#1a2820] dark:text-white placeholder-[#9ab0a0] focus:outline-none focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 transition-all text-sm"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ab0a0] hover:text-[#5E7464]">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-3.5 rounded-xl transition-all hover:shadow-[0_8px_30px_rgba(94,116,100,0.35)] active:scale-[0.99] disabled:opacity-70"
              style={{ background: "linear-gradient(135deg,#5E7464,#42594A)" }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#e0e8e2] dark:bg-white/10" />
            <span className="text-xs text-[#9ab0a0] font-medium">or continue with</span>
            <div className="flex-1 h-px bg-[#e0e8e2] dark:bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { 
                setLoading(true); 
                const uid = "user_google_" + Math.random().toString(36).substr(2, 9);
                loginLocal(uid, "google-user@gmail.com");
                setTimeout(() => router.push("/dashboard"), 800); 
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-white dark:bg-[#1e2820] text-sm font-medium text-[#1a2820] dark:text-white hover:border-[#5E7464]/40 hover:bg-[#f4f8f5] dark:hover:bg-[#2a3430] transition-all"
            >
              <GoogleIcon />
              Google
            </button>
            <button
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-white dark:bg-[#1e2820] text-sm font-medium text-[#1a2820] dark:text-white hover:border-[#5E7464]/40 hover:bg-[#f4f8f5] dark:hover:bg-[#2a3430] transition-all"
            >
              <span className="material-symbols-outlined text-base text-[#5E7464]">smartphone</span>
              OTP
            </button>
          </div>

          <p className="text-center text-sm text-[#52615a] dark:text-[#9ab0a0] mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#5E7464] font-semibold hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
