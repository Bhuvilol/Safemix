"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Scan, 
  Mic, 
  Zap, 
  Flag, 
  Clock, 
  Users, 
  QrCode, 
  Bell, 
  ShieldCheck, 
  AlertTriangle, 
  Globe,
  ChevronRight,
  Sparkles
} from "lucide-react";

const featureList = [
  { icon: Scan, title: "OCR Medicine Scan", desc: "Just point your camera at a prescription or medicine pack. Our AI extracts drug names instantly with 99% accuracy." },
  { icon: Mic, title: "Voice Input", desc: "Speak naturally in your preferred language. SafeMix understands 10+ Indian languages including Hindi, Tamil, and Marathi." },
  { icon: Zap, title: "AI Interaction Detection", desc: "Clinical-grade AI checks for dangerous clashes between Allopathic, Ayurvedic, and Home-remedy medicines." },
  { icon: Flag, title: "Red Yellow Green Verdict", desc: "Simple, color-coded safety statuses make complex medical data easy for anyone to understand at a glance." },
  { icon: Clock, title: "Timing Suggestions", desc: "Not just what to take, but when. Get smart suggestions on spacing medicines to maximize efficacy." },
  { icon: Users, title: "Family Profiles", desc: "Manage separate profiles for parents, spouse, and children. Keep everyone's medication safe in one app." },
  { icon: QrCode, title: "Doctor QR Share", desc: "Generate a secure, time-limited QR code. Your doctor can review your entire regimen in seconds without an app." },
  { icon: Bell, title: "Reminder Scheduling", desc: "Smart notifications that adapt to your schedule and notify your family if a critical dose is missed." },
  { icon: ShieldCheck, title: "Privacy Controls", desc: "Your health data is AES-256 encrypted and DPDP-compliant. You own your data; we just protect it." },
  { icon: AlertTriangle, title: "Adverse Event Reporting", desc: "Quickly log side effects and share them with your doctor to help refine your treatment plan." },
  { icon: Globe, title: "Multilingual Support", desc: "The entire experience is localized into 10+ Indian languages, ensuring safety for every citizen." },
  { icon: Sparkles, title: "Holistic Intelligence", desc: "The only platform that bridges the gap between modern medicine and traditional Indian home remedies." },
];

export default function FeaturesPage() {
  return (
    <div>
      <Navbar />
      <main className="pt-[68px]">
        {/* Hero */}
        <section className="py-24 bg-[#F8F8F4] overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-40">
             <div className="absolute top-[-10%] left-[10%] w-[400px] h-[400px] bg-[#5E7464] rounded-full blur-[120px]" />
             <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-blue-400 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-[#e0e8e2] text-[#42594A] text-xs font-bold tracking-widest uppercase mb-8 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Comprehensive Platform
            </span>
            <h1 className="font-manrope font-bold text-5xl lg:text-7xl text-[#1a2820] mb-8 tracking-tight">
              Why SafeMix <span className="text-[#5E7464]">Works</span>
            </h1>
            <p className="text-xl text-[#52615a] leading-relaxed max-w-2xl mx-auto">
              India&apos;s unique healthcare landscape requires more than just a list of drugs. SafeMix provides the clinical intelligence needed for a safer India.
            </p>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {featureList.map((f, i) => (
                <div key={f.title} className="group cursor-default">
                  <div className="w-14 h-14 rounded-2xl bg-[#F8F8F4] border border-[#e0e8e2] flex items-center justify-center mb-6 group-hover:bg-[#5E7464] group-hover:border-[#5E7464] transition-all duration-300">
                    <f.icon className="w-6 h-6 text-[#5E7464] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-manrope font-bold text-xl text-[#1a2820] mb-4 flex items-center gap-2">
                    {f.title}
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#5E7464]" />
                  </h3>
                  <p className="text-[#52615a] leading-relaxed text-[0.95rem]">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Quote */}
        <section className="py-20 bg-[#F8F8F4] border-y border-[#e0e8e2] text-center">
          <div className="max-w-3xl mx-auto px-6">
            <blockquote className="font-manrope italic text-2xl text-[#1a2820] leading-relaxed">
              &quot;SafeMix bridges the critical gap between traditional remedies and modern medicine, making it an essential tool for every Indian household.&quot;
            </blockquote>
            <div className="mt-8 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#5E7464]/20 flex items-center justify-center mb-4 font-bold text-[#5E7464]">DS</div>
              <cite className="not-italic font-bold text-[#1a2820]">Dr. Satya Vardhan</cite>
              <span className="text-xs text-[#9ab0a0] uppercase tracking-widest mt-1">Chief Clinical Officer</span>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-gradient-to-br from-[#42594A] to-[#1e2f25] rounded-[40px] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
               
               <h2 className="font-manrope font-bold text-3xl md:text-4xl mb-6 relative z-10">Ready to take control of your medication safety?</h2>
               <p className="text-white/80 mb-10 text-lg relative z-10">Join 500,000+ users who trust SafeMix every day.</p>
               
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                 <Link href="/signup" className="px-10 py-4 bg-white text-[#42594A] rounded-full font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all">
                   Get Started for Free
                 </Link>
                 <Link href="/contact" className="px-10 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all">
                   Contact Sales
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
