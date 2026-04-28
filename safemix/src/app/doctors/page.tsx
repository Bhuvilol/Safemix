"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { QrCode, ClipboardList, Zap, ShieldCheck, Printer, FileDown, MessageSquare } from "lucide-react";

const modules = [
  { icon: QrCode, title: "Scan Shared QR", desc: "Instantly access patient medication history by scanning a secure, time-limited QR code." },
  { icon: ClipboardList, title: "View Current Regimen", desc: "See all Allopathic, Ayurvedic, and OTC medicines the patient is currently taking in one view." },
  { icon: Zap, title: "Interaction Matrix", desc: "Our AI highlights potential drug-drug and drug-herb interactions with clinical severity levels." },
  { icon: ShieldCheck, title: "Timing Recommendations", desc: "Get smart suggestions for spacing out medications to avoid metabolic competition." },
  { icon: FileDown, title: "Download PDF Report", desc: "Generate a comprehensive clinical report of the patient's regimen and safety analysis." },
  { icon: Printer, title: "Print Summary", desc: "Print a high-quality summary for the patient's physical file or for your own reference." },
  { icon: MessageSquare, title: "Send Acknowledgement", desc: "Securely notify the patient that you have reviewed their medications." },
];

export default function DoctorsPage() {
  return (
    <div>
      <Navbar />
      <main className="pt-[68px]">
        {/* Hero */}
        <section className="py-20 bg-[#F8F8F4]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#5E7464]/10 text-[#42594A] text-xs font-bold tracking-widest uppercase mb-6">For Medical Professionals</span>
            <h1 className="font-manrope font-bold text-5xl lg:text-6xl text-[#1a2820] mb-6">
              Review Patient Medicines <span className="text-[#5E7464]">in 60 Seconds</span>
            </h1>
            <p className="text-xl text-[#52615a] max-w-2xl mx-auto">
              SafeMix helps doctors identify dangerous drug-herb and drug-drug interactions that are often missed in standard EHRs.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="px-8 py-4 bg-[#42594A] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
                Request Hospital Demo
              </Link>
              <Link href="/login" className="px-8 py-4 bg-white text-[#42594A] border border-[#e0e8e2] rounded-full font-semibold hover:bg-[#f0f5f1] transition-all">
                Doctor Login
              </Link>
            </div>
          </div>
        </section>

        {/* Modules */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map((m) => (
                <div key={m.title} className="p-8 rounded-2xl border border-[#e0e8e2] bg-[#F8F8F4] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[#5E7464]/10 flex items-center justify-center mb-6">
                    <m.icon className="w-6 h-6 text-[#5E7464]" />
                  </div>
                  <h3 className="font-manrope font-bold text-xl text-[#1a2820] mb-3">{m.title}</h3>
                  <p className="text-[#52615a] leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#F8F8F4] border-t border-[#e0e8e2]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-manrope font-bold text-3xl text-[#1a2820] mb-6">Empower Your Practice with AI Safety</h2>
            <p className="text-[#52615a] mb-10">
              Join the network of clinical professionals using SafeMix to ensure medication safety for their patients.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 text-white text-sm font-semibold px-8 py-4 rounded-full" style={{ background: "linear-gradient(135deg,#5E7464,#42594A)" }}>
              Contact our Clinical Team
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
