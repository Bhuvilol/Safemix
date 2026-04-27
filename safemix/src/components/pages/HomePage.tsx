"use client";

import Link from "next/link";
import { ArrowRight, Play, ScanLine, AlertTriangle, CheckCircle, Info } from "lucide-react";

const problems = [
  {
    tags: ["Allopathic", "Ayurvedic"],
    severity: "error",
    title: "Metformin + Karela",
    desc: "Taking bitter gourd juice with diabetes medication can cause dangerously low blood sugar levels.",
  },
  {
    tags: ["Allopathic", "Natural"],
    severity: "warning",
    title: "BP Meds + Mulethi",
    desc: "Licorice root (Mulethi) can reduce the effectiveness of certain blood pressure medications.",
  },
  {
    tags: ["Allopathic", "Supplement"],
    severity: "error",
    title: "Thyroid + Calcium",
    desc: "Calcium supplements can block the absorption of thyroid medication if taken too closely together.",
  },
];

const steps = [
  { step: "01", title: "Add Your Medicines", desc: "Scan, type, or voice-input your prescriptions and home remedies.", icon: "document_scanner" },
  { step: "02", title: "AI Checks Safety", desc: "Our clinical-grade AI cross-references 10,000+ interaction rules instantly.", icon: "psychology" },
  { step: "03", title: "Get Risk Verdict", desc: "Receive clear Red / Yellow / Green verdicts with timing suggestions.", icon: "fact_check" },
  { step: "04", title: "Share with Doctor", desc: "Generate a QR code your doctor can scan to review your full regimen.", icon: "qr_code_2" },
];

const floatingCards = [
  { icon: "document_scanner", label: "OCR Scan", sub: "Auto-read Rx", color: "text-blue-600 bg-blue-50", delay: "" },
  { icon: "mic", label: "Voice Input", sub: "Works in Hindi", color: "text-orange-500 bg-orange-50", delay: "animate-float-delay-1" },
  { icon: "family_restroom", label: "Family Profiles", sub: "Track for loved ones", color: "text-purple-600 bg-purple-50", delay: "animate-float-delay-2" },
  { icon: "translate", label: "Multilingual", sub: "10+ Languages", color: "text-teal-600 bg-teal-50", delay: "animate-float-delay-3" },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-40">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-secondary-fixed rounded-full mix-blend-multiply filter blur-3xl opacity-40 translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-fixed rounded-full mix-blend-multiply filter blur-3xl opacity-40 -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="max-w-xl">
              <span className="inline-block py-1.5 px-4 rounded-full bg-primary-fixed/60 text-primary text-xs font-semibold tracking-widest uppercase mb-6 border border-primary-fixed">
                India&apos;s First Medicine Safety AI
              </span>
              <h1 className="font-manrope text-5xl lg:text-6xl font-bold text-on-surface leading-[1.1] tracking-tight mb-6">
                Know If Your Medicines{" "}
                <span className="text-primary relative">
                  Clash Before{" "}
                  <svg className="absolute -bottom-1 left-0 w-full h-2 text-primary-fixed-dim opacity-70" fill="none" preserveAspectRatio="none" viewBox="0 0 200 8">
                    <path d="M0,6 Q100,0 200,6" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
                  </svg>
                </span>{" "}
                They Harm You
              </h1>
              <p className="text-lg text-on-surface-variant mb-10 leading-relaxed">
                Instantly scan prescriptions, ayurvedic remedies, and supplements to detect dangerous interactions using clinical-grade AI.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  href="/dashboard/add-medicine"
                  className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-surface-tint transition-colors shadow-[0_8px_24px_rgba(70,91,76,0.25)] active:scale-95 transition-transform"
                >
                  <ScanLine className="w-5 h-5" />
                  Scan Medicines
                </Link>
                <button className="inline-flex items-center gap-2 bg-white text-primary text-sm font-semibold px-8 py-4 rounded-full hover:bg-surface-container transition-colors border border-outline-variant">
                  <Play className="w-4 h-4 fill-primary" />
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center gap-6 mt-10">
                {[
                  { value: "500K+", label: "Safety Checks" },
                  { value: "10+", label: "Languages" },
                  { value: "99.9%", label: "Data Privacy" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="font-manrope font-bold text-2xl text-primary">{s.value}</div>
                    <div className="text-xs text-on-surface-variant mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Phone mockup */}
            <div className="relative mx-auto w-full max-w-[340px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary-fixed to-primary-fixed rounded-[40px] rotate-3 scale-105 opacity-60 blur-2xl" />
              <div className="relative w-full rounded-[2.8rem] shadow-2xl border-[10px] border-slate-900 bg-slate-900 overflow-hidden aspect-[9/19.5]">
                <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                  <div className="w-28 h-6 bg-slate-900 rounded-b-3xl" />
                </div>
                <div className="relative h-full w-full bg-slate-50 flex flex-col pt-10 pb-4 px-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-base">person</span>
                    </div>
                    <div className="font-manrope text-lg font-bold text-primary">SafeMix</div>
                    <div className="relative w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-base">notifications</span>
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-white" />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-[0_8px_32px_-10px_rgba(186,26,26,0.2)] border border-error-container mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-error text-white flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <span className="text-error font-bold text-xs tracking-widest">RED ALERT</span>
                    </div>
                    <h3 className="font-manrope font-bold text-on-surface mb-3 text-sm leading-tight">Severe Interaction Detected</h3>
                    <div className="bg-surface-container-low rounded-xl p-3 mb-3 text-xs">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-semibold text-on-surface">Metformin 500mg</span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[9px] font-bold uppercase">Allopathic</span>
                      </div>
                      <div className="text-center text-outline my-1 text-xs">✕</div>
                      <div className="flex justify-between items-center mt-1.5">
                        <span className="font-semibold text-on-surface">Karela Juice</span>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[9px] font-bold uppercase">Ayurvedic</span>
                      </div>
                    </div>
                    <p className="text-error text-xs leading-relaxed mb-3">High risk of extreme hypoglycemia from this combination.</p>
                    <button className="w-full bg-error text-white text-xs font-semibold py-2.5 rounded-lg">View Alternatives</button>
                  </div>

                  <div className="mt-auto">
                    <button className="w-full bg-primary text-white text-xs font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-sm">document_scanner</span>
                      Scan New Medicine
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating chips */}
              {floatingCards.map((c, i) => (
                <div
                  key={i}
                  className={`absolute glass-card px-3 py-2 rounded-xl z-30 ${c.delay || "animate-float"}
                    ${i === 0 ? "-left-16 top-16" : i === 1 ? "-right-10 top-28" : i === 2 ? "-left-10 bottom-28" : "-right-8 bottom-16"}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${c.color}`}>
                      <span className="material-symbols-outlined text-sm">{c.icon}</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 whitespace-nowrap">{c.label}</div>
                      <div className="text-[10px] text-slate-500 whitespace-nowrap">{c.sub}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-10 bg-surface-container-low border-y border-surface-container-highest">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500K+", label: "Checks Performed" },
              { value: "10+", label: "Indian Languages" },
              { value: "99.9%", label: "Secure & Private" },
              { value: "24/7", label: "AI Monitoring" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-manrope font-bold text-3xl text-primary mb-1">{s.value}</div>
                <div className="text-sm text-on-surface-variant">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-manrope font-bold text-4xl text-on-surface mb-4">
            Millions Mix Medicines Without Knowing The Risk
          </h2>
          <p className="text-lg text-on-surface-variant">
            Common combinations of allopathic medicines and natural remedies can have unintended consequences.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div
              key={p.title}
              className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-outline-variant/20 group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2 flex-wrap">
                  {p.tags.map((t) => (
                    <span key={t} className="bg-surface-container px-2.5 py-1 rounded-full text-xs font-semibold text-on-surface-variant">
                      {t}
                    </span>
                  ))}
                </div>
                {p.severity === "error" ? (
                  <AlertTriangle className="w-5 h-5 text-error flex-shrink-0" />
                ) : (
                  <Info className="w-5 h-5 text-amber-500 flex-shrink-0" />
                )}
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
              <div
                key={s.step}
                className={`bg-white rounded-2xl p-6 shadow-card border border-outline-variant/20 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 ${
                  i === 1 ? "lg:bg-primary text-white" : ""
                }`}
              >
                <div className={`text-4xl font-manrope font-bold mb-4 ${i === 1 ? "text-white/40" : "text-outline-variant"}`}>
                  {s.step}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  i === 1 ? "bg-white/20" : "bg-primary-fixed"
                }`}>
                  <span className={`material-symbols-outlined ${i === 1 ? "text-white" : "text-primary"}`}>{s.icon}</span>
                </div>
                <h3 className={`font-manrope font-semibold text-lg mb-2 ${i === 1 ? "text-white" : "text-on-surface"}`}>{s.title}</h3>
                <p className={`text-sm leading-relaxed ${i === 1 ? "text-white/80" : "text-on-surface-variant"}`}>{s.desc}</p>
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
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="font-manrope font-bold text-4xl text-on-primary-fixed mb-4">Protect Your Family Today</h2>
            <p className="text-lg text-on-primary-fixed-variant mb-8">
              Join over 500,000 Indians making safer healthcare decisions with SafeMix AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-surface-tint transition-colors shadow-lg"
              >
                Get SafeMix for Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/doctors"
                className="inline-flex items-center justify-center gap-2 bg-white/70 text-primary text-sm font-semibold px-8 py-4 rounded-full hover:bg-white transition-colors border border-primary/20"
              >
                For Doctors
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
