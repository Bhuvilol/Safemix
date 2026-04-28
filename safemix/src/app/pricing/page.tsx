"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Check, X } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    desc: "For individuals managing their own medicines",
    cta: "Get Started Free",
    href: "/signup",
    highlight: false,
    badge: null,
    features: [
      "Up to 10 medicines",
      "AI Interaction Detection",
      "Red/Yellow/Green verdicts",
      "1 Family Profile",
      "Basic Reminders",
      "7-day history",
    ],
  },
  {
    name: "Pro",
    price: "₹99",
    period: "per month",
    desc: "For families and power users who need more",
    cta: "Start Pro Trial",
    href: "/signup?plan=pro",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Unlimited medicines",
      "AI Interaction Detection",
      "Red/Yellow/Green verdicts",
      "Unlimited Family Profiles",
      "Smart Reminders + Snooze",
      "Full history & reports",
      "Doctor QR Sharing",
      "OCR & Voice Input",
      "PDF Export",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    desc: "For hospitals, clinics, and insurance providers",
    cta: "Contact Sales",
    href: "/contact",
    highlight: false,
    badge: "For Hospitals",
    features: [
      "Everything in Pro",
      "Hospital-wide deployment",
      "Doctor portal integration",
      "EHR/EMR API access",
      "Insurance integration",
      "DPDP compliance reports",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom branding",
      "Training & onboarding",
    ],
  },
];

const tableFeatures = [
  { feature: "AI Interaction Detection", free: true, pro: true, ent: true },
  { feature: "Medicine Limit", free: "10", pro: "Unlimited", ent: "Unlimited" },
  { feature: "Family Profiles", free: "1", pro: "Unlimited", ent: "Unlimited" },
  { feature: "OCR Medicine Scan", free: false, pro: true, ent: true },
  { feature: "Voice Input", free: false, pro: true, ent: true },
  { feature: "Doctor QR Sharing", free: false, pro: true, ent: true },
  { feature: "PDF Reports", free: false, pro: true, ent: true },
  { feature: "History (days)", free: "7", pro: "365", ent: "Unlimited" },
  { feature: "Adverse Event Reporting", free: false, pro: true, ent: true },
  { feature: "EHR/EMR API", free: false, pro: false, ent: true },
  { feature: "SLA Guarantee", free: false, pro: false, ent: true },
  { feature: "Priority Support", free: false, pro: true, ent: true },
];

function Cell({ val }: { val: boolean | string }) {
  if (typeof val === "string") return <span className="text-sm font-medium text-[#42594A]">{val}</span>;
  return val
    ? <Check className="w-5 h-5 text-[#5E7464] mx-auto" />
    : <X className="w-4 h-4 text-[#c3c8c1] mx-auto" />;
}

export default function PricingPage() {
  return (
    <div>
      <Navbar />
      <main className="pt-[68px]">

        {/* Hero */}
        <section className="py-24 bg-[#F8F8F4] text-center">
          <div className="max-w-3xl mx-auto px-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#5E7464]/10 text-[#42594A] text-xs font-bold tracking-widest uppercase mb-6">Simple Pricing</span>
            <h1 className="font-manrope font-bold text-5xl lg:text-6xl text-[#1a2820] mb-5">
              Start Free. <span className="text-[#5E7464]">Scale Smart.</span>
            </h1>
            <p className="text-xl text-[#52615a]">
              No surprise charges. Cancel anytime. Trusted by 500K+ Indians.
            </p>
          </div>
        </section>

        {/* Cards */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((p) => (
                <div key={p.name}
                  className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${ p.highlight ? "shadow-[0_20px_60px_rgba(94,116,100,0.25)] scale-[1.02]" : "shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1" }`}
                  style={p.highlight
                    ? { background: "linear-gradient(145deg,#42594A,#2d4035)", border: "1px solid rgba(255,255,255,0.1)" }
                    : { background: "#F8F8F4", border: "1px solid #e0e8e2" }
                  }
                >
                  {p.badge && (
                    <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap ${ p.highlight ? "bg-[#3B82F6] text-white" : "bg-[#dceae0] text-[#42594A]" }`}>
                      {p.badge}
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className={`font-manrope font-bold text-xl mb-1 ${p.highlight ? "text-white" : "text-[#1a2820] "}`}>{p.name}</h3>
                    <p className={`text-sm mb-5 ${p.highlight ? "text-white/70" : "text-[#6b7b70] "}`}>{p.desc}</p>
                    <div className="flex items-end gap-2 mb-1">
                      <span className={`font-manrope font-bold text-5xl ${p.highlight ? "text-white" : "text-[#1a2820] "}`}>{p.price}</span>
                      {p.price !== "Custom" && <span className={`text-sm mb-2 ${p.highlight ? "text-white/60" : "text-[#7a9080]"}`}>{p.period}</span>}
                    </div>
                    {p.price === "Custom" && <span className={`text-sm ${p.highlight ? "text-white/60" : "text-[#7a9080]"}`}>{p.period}</span>}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${p.highlight ? "bg-white/20" : "bg-[#dceae0] "}`}>
                          <Check className={`w-3 h-3 ${p.highlight ? "text-white" : "text-[#5E7464]"}`} />
                        </div>
                        <span className={`text-sm ${p.highlight ? "text-white/85" : "text-[#52615a] "}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={p.href}
                    className={`block text-center py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg ${ p.highlight ? "bg-white text-[#42594A] hover:bg-[#f0f5f1]" : "text-white hover:opacity-90" }`}
                    style={!p.highlight ? { background: "linear-gradient(135deg,#5E7464,#42594A)" } : {}}
                  >
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="py-20 bg-[#F8F8F4]">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-manrope font-bold text-3xl text-[#1a2820] text-center mb-12">Full Feature Comparison</h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#e0e8e2]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e0e8e2]">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#1a2820]">Feature</th>
                    {["Free","Pro","Enterprise"].map((h) => (
                      <th key={h} className="text-center px-4 py-4 text-sm font-semibold text-[#42594A]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableFeatures.map((row, i) => (
                    <tr key={row.feature} className={`border-b border-[#f0f4f1] ${i % 2 === 0 ? "" : "bg-[#f8faf8] "}`}>
                      <td className="px-6 py-4 text-sm text-[#52615a]">{row.feature}</td>
                      <td className="px-4 py-4 text-center"><Cell val={row.free} /></td>
                      <td className="px-4 py-4 text-center"><Cell val={row.pro} /></td>
                      <td className="px-4 py-4 text-center"><Cell val={row.ent} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
