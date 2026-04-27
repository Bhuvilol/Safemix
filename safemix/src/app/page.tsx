"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Play, ScanLine, AlertTriangle, CheckCircle, Info } from "lucide-react";

const problems = [
  { tags: ["Allopathic", "Ayurvedic"], severity: "error", title: "Metformin + Karela", desc: "Taking bitter gourd juice with diabetes medication can cause dangerously low blood sugar levels." },
  { tags: ["Allopathic", "Natural"], severity: "warning", title: "BP Meds + Mulethi", desc: "Licorice root (Mulethi) can reduce the effectiveness of certain blood pressure medications." },
  { tags: ["Allopathic", "Supplement"], severity: "error", title: "Thyroid + Calcium", desc: "Calcium supplements can block the absorption of thyroid medication if taken too closely together." },
];

const steps = [
  { step: "01", title: "Add Your Medicines", desc: "Scan, type, or voice-input your prescriptions and home remedies.", icon: "document_scanner" },
  { step: "02", title: "AI Checks Safety", desc: "Clinical-grade AI cross-references 10,000+ interaction rules instantly.", icon: "psychology" },
  { step: "03", title: "Get Risk Verdict", desc: "Clear Red / Yellow / Green verdicts with precise timing suggestions.", icon: "fact_check" },
  { step: "04", title: "Share with Doctor", desc: "Generate a QR code your doctor can scan to review your full regimen.", icon: "qr_code_2" },
];

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="pt-20">

        {/* HERO */}
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-40">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-secondary-fixed rounded-full blur-3xl opacity-40 translate-x-1/3 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-fixed rounded-full blur-3xl opacity-40 -translate-x-1/4 translate-y-1/4" />
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left copy */}
              <div className="max-w-xl">
                <span className="inline-block py-1.5 px-4 rounded-full bg-primary-fixed/60 text-primary text-xs font-semibold tracking-widest uppercase mb-6 border border-primary-fixed">
                  India&apos;s First Medicine Safety AI
                </span>
                <h1 className="font-manrope text-5xl lg:text-6xl font-bold text-on-surface leading-[1.1] tracking-tight mb-6">
                  Know If Your Medicines{" "}
                  <span className="text-primary">Clash Before</span>{" "}
                  They Harm You
                </h1>
                <p className="text-lg text-on-surface-variant mb-10 leading-relaxed">
                  Instantly scan prescriptions, ayurvedic remedies, and supplements to detect dangerous interactions using clinical-grade AI.
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <Link href="/dashboard/add-medicine" className="inline-flex items-center gap-2 bg-[#465b4c] text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-[#4e6354] transition-colors shadow-[0_8px_24px_rgba(70,91,76,0.25)]">
                    <ScanLine className="w-5 h-5" />
                    Scan Medicines
                  </Link>
                  <button className="inline-flex items-center gap-2 bg-white text-[#465b4c] text-sm font-semibold px-8 py-4 rounded-full hover:bg-[#efeeeb] transition-colors border border-[#c3c8c1]">
                    <Play className="w-4 h-4" style={{fill:'#465b4c'}} />
                    Watch Demo
                  </button>
                </div>
                <div className="flex items-center gap-8 mt-10">
                  {[{ value: "500K+", label: "Safety Checks" }, { value: "10+", label: "Languages" }, { value: "24/7", label: "AI Monitoring" }].map((s) => (
                    <div key={s.label}>
                      <div className="font-manrope font-bold text-2xl text-[#465b4c]">{s.value}</div>
                      <div className="text-xs text-[#434843] mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — phone mockup */}
              <div className="relative mx-auto w-full max-w-[300px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-secondary-fixed to-primary-fixed rounded-[40px] rotate-3 scale-105 opacity-60 blur-2xl" />
                <div className="relative w-full rounded-[2.5rem] shadow-2xl border-[10px] border-slate-900 bg-slate-900 overflow-hidden aspect-[9/19.5]">
                  <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-20">
                    <div className="w-24 h-5 bg-slate-900 rounded-b-3xl" />
                  </div>
                  <div className="relative h-full w-full bg-slate-50 flex flex-col pt-8 pb-4 px-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person</span>
                      </div>
                      <div className="font-manrope text-base font-bold text-primary">SafeMix</div>
                      <div className="relative w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>notifications</span>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border border-white" />
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-[0_8px_24px_-8px_rgba(186,26,26,0.25)] border border-error-container mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-error text-white flex items-center justify-center">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-error font-bold text-[10px] tracking-widest">RED ALERT</span>
                      </div>
                      <h3 className="font-manrope font-bold text-on-surface mb-2 text-sm">Severe Interaction Detected</h3>
                      <div className="bg-surface-container-low rounded-xl p-2.5 mb-2 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-on-surface text-[11px]">Metformin 500mg</span>
                          <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[8px] font-bold">ALLOPATHIC</span>
                        </div>
                        <div className="text-center text-outline my-1">✕</div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-on-surface text-[11px]">Karela Juice</span>
                          <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[8px] font-bold">AYURVEDIC</span>
                        </div>
                      </div>
                      <p className="text-error text-[10px] leading-relaxed mb-2">High risk of extreme hypoglycemia from this combination.</p>
                      <button className="w-full bg-error text-white text-[10px] font-semibold py-2 rounded-lg">View Alternatives</button>
                    </div>
                    <div className="mt-auto">
                      <button className="w-full bg-primary text-white text-[10px] font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>document_scanner</span>
                        Scan New Medicine
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="py-10 bg-surface-container-low border-y border-surface-container-highest">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[{ value: "500K+", label: "Checks Performed" }, { value: "10+", label: "Indian Languages" }, { value: "99.9%", label: "Secure & Private" }, { value: "24/7", label: "AI Monitoring" }].map((s) => (
                <div key={s.label}>
                  <div className="font-manrope font-bold text-3xl text-[#465b4c] mb-1">{s.value}</div>
                  <div className="text-sm text-[#434843]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-manrope font-bold text-4xl text-on-surface mb-4">Millions Mix Medicines Without Knowing The Risk</h2>
            <p className="text-lg text-on-surface-variant">Common combinations of allopathic medicines and natural remedies can have unintended consequences.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-outline-variant/20 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2 flex-wrap">
                    {p.tags.map((t) => (
                      <span key={t} className="bg-surface-container px-2.5 py-1 rounded-full text-xs font-semibold text-on-surface-variant">{t}</span>
                    ))}
                  </div>
                  {p.severity === "error" ? <AlertTriangle className="w-5 h-5 text-error flex-shrink-0" /> : <Info className="w-5 h-5 text-amber-500 flex-shrink-0" />}
                </div>
                <h3 className="font-manrope font-semibold text-lg text-on-surface mb-2">{p.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-manrope font-bold text-4xl text-on-surface mb-4">4 Steps to Medicine Safety</h2>
              <p className="text-lg text-on-surface-variant">From scan to safety verdict in under 60 seconds.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s, i) => (
                <div key={s.step} className={`rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${i === 1 ? "bg-primary border-primary shadow-lg" : "bg-white border-outline-variant/20 shadow-card hover:shadow-card-hover"}`}>
                  <div className={`text-4xl font-manrope font-bold mb-4 ${i === 1 ? "text-white/30" : "text-outline-variant"}`}>{s.step}</div>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${i === 1 ? "bg-white/20" : "bg-primary-fixed"}`}>
                    <span className={`material-symbols-outlined ${i === 1 ? "text-white" : "text-primary"}`}>{s.icon}</span>
                  </div>
                  <h3 className={`font-manrope font-semibold text-lg mb-2 ${i === 1 ? "text-white" : "text-on-surface"}`}>{s.title}</h3>
                  <p className={`text-sm leading-relaxed ${i === 1 ? "text-white/75" : "text-on-surface-variant"}`}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-gradient-to-br from-primary-fixed to-secondary-fixed rounded-[2rem] p-12 text-center relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="relative z-10 max-w-xl mx-auto">
              <CheckCircle className="w-12 h-12 text-[#465b4c] mx-auto mb-6" />
              <h2 className="font-manrope font-bold text-4xl text-[#0b1f14] mb-4">Protect Your Family Today</h2>
              <p className="text-lg text-[#374b3d] mb-8">Join over 500,000 Indians making safer healthcare decisions with SafeMix AI.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-[#465b4c] text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-[#4e6354] transition-colors shadow-lg">
                  Get SafeMix for Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/doctors" className="inline-flex items-center justify-center bg-white/70 text-[#465b4c] text-sm font-semibold px-8 py-4 rounded-full hover:bg-white transition-colors border border-[#465b4c]/20">
                  For Doctors
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
