"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const cards = [
  { icon: "shield_locked", title: "Encrypted Health Data", desc: "All medicine data is AES-256 encrypted at rest and in transit. Your health information is never stored in plain text.", color: "#3B82F6" },
  { icon: "how_to_reg", title: "Consent Based Sharing", desc: "You choose exactly what to share, with whom, and for how long. No data leaves your account without explicit consent.", color: "#5E7464" },
  { icon: "qr_code_2", title: "QR Expiry Access", desc: "Doctor QR codes expire automatically (15 min / 1 hr / 24 hr). No permanent access is ever granted.", color: "#8B5CF6" },
  { icon: "manage_accounts", title: "Role Based Permissions", desc: "Patients, caregivers, and doctors each see only what they are authorized to see. Strict role isolation.", color: "#F59E0B" },
  { icon: "verified_user", title: "DPDP India Ready", desc: "Fully compliant with India's Digital Personal Data Protection Act 2023. Your data rights are legally protected.", color: "#10B981" },
  { icon: "download_for_offline", title: "Data Export & Delete", desc: "Download your full health record or permanently delete all data at any time. No questions asked.", color: "#EF4444" },
  { icon: "history", title: "Audit Logs", desc: "Every access to your data is logged. See exactly who viewed your information and when.", color: "#6366F1" },
  { icon: "lock", title: "Secure Doctor Sharing", desc: "Doctor portal access is one-time, time-limited, and cryptographically signed. Cannot be reused or forwarded.", color: "#0EA5E9" },
];

const certifications = [
  { label: "AES-256", sub: "Encryption" },
  { label: "DPDP 2023", sub: "Compliant" },
  { label: "TLS 1.3", sub: "In Transit" },
  { label: "Zero Logs", sub: "Policy" },
];

export default function SecurityPage() {
  return (
    <div>
      <Navbar />
      <main className="pt-[68px]">

        {/* Hero */}
        <section className="relative py-28 overflow-hidden bg-[#F8F8F4] dark:bg-[#0f1410]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #5E7464 0%, transparent 70%)" }} />
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-bold tracking-widest uppercase mb-8">
                <span className="material-symbols-outlined text-base">security</span>
                Security & Privacy
              </div>
              <h1 className="font-manrope font-bold text-5xl lg:text-6xl text-[#1a2820] dark:text-white mb-6 leading-tight">
                Privacy Built Into <span className="text-[#5E7464]">Every Layer</span>
              </h1>
              <p className="text-xl text-[#52615a] dark:text-[#9ab0a0] mb-12 leading-relaxed">
                Your health data is sacred. SafeMix is designed from the ground up with privacy-first architecture, clinical-grade encryption, and full DPDP compliance.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-4">
                {certifications.map((c) => (
                  <div key={c.label} className="flex flex-col items-center bg-white dark:bg-[#1e2820] rounded-2xl px-8 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#e0e8e2] dark:border-white/10">
                    <span className="font-manrope font-bold text-2xl text-[#42594A] dark:text-[#b5ccba]">{c.label}</span>
                    <span className="text-xs text-[#7a9080] mt-1">{c.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="py-20 bg-white dark:bg-[#141a15]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="text-center mb-14">
              <h2 className="font-manrope font-bold text-4xl text-[#1a2820] dark:text-white mb-3">
                8 Layers of Protection
              </h2>
              <p className="text-[#52615a] dark:text-[#9ab0a0] text-lg">
                Security isn&apos;t a feature — it&apos;s the foundation.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {cards.map((c) => (
                <div key={c.title}
                  className="bg-[#F8F8F4] dark:bg-[#1e2820] rounded-2xl p-7 border border-[#e0e8e2] dark:border-white/10 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${c.color}18` }}>
                    <span className="material-symbols-outlined" style={{ color: c.color }}>{c.icon}</span>
                  </div>
                  <h3 className="font-manrope font-semibold text-lg text-[#1a2820] dark:text-white mb-3">{c.title}</h3>
                  <p className="text-sm text-[#6b7b70] dark:text-[#7a9080] leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#F8F8F4] dark:bg-[#0f1410]">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-manrope font-bold text-3xl text-[#1a2820] dark:text-white mb-4">Your Data, Your Control</h2>
            <p className="text-[#52615a] dark:text-[#9ab0a0] mb-8">Join 500,000+ Indians who trust SafeMix with their health data.</p>
            <Link href="/signup" className="inline-flex items-center gap-2 text-white text-sm font-semibold px-8 py-4 rounded-full shadow-[0_4px_20px_rgba(94,116,100,0.3)] transition-all hover:shadow-[0_8px_30px_rgba(94,116,100,0.4)]" style={{ background: "linear-gradient(135deg,#5E7464,#42594A)" }}>
              Start for Free — No Credit Card
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
