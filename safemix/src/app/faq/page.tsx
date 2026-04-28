"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is SafeMix giving me medical advice?",
    a: "No. SafeMix is an informational tool, not a substitute for professional medical advice. Our AI detects known interactions between medicines and provides educational information about risks. Always consult your doctor or pharmacist before making any changes to your medication regimen.",
  },
  {
    q: "Does it support Ayurveda, herbal, and home remedies?",
    a: "Yes — this is one of SafeMix's core differentiators. We support Allopathic, Ayurvedic, Unani, Siddha, Homeopathic, OTC, herbal, and home remedy medicines. India's unique polypharmacy landscape is fully covered.",
  },
  {
    q: "Can doctors use SafeMix without signing up?",
    a: "Yes. Doctors can access the Doctor Portal at safemix.in/doctor-portal by scanning a patient's QR code — no account or download required. The QR expires automatically after the chosen duration.",
  },
  {
    q: "Can family members or caregivers manage a parent's medicines?",
    a: "Absolutely. SafeMix supports Family Profiles — you can add and manage separate profiles for parents, spouse, children, or any dependent. Each profile is isolated with its own medicine list, reminders, and safety verdicts.",
  },
  {
    q: "Does SafeMix work offline?",
    a: "Core features like viewing saved medicines and past reports work offline. However, running a new AI safety check requires an internet connection as it communicates with our clinical database.",
  },
  {
    q: "Is my health data private and secure?",
    a: "Your data is encrypted with AES-256 at rest and TLS 1.3 in transit. We are compliant with India's DPDP Act 2023. We never sell your data. You can export or permanently delete your data at any time.",
  },
  {
    q: "Can I share reports with my doctor?",
    a: "Yes. You can generate a time-limited QR code from the Doctor Share page that gives your doctor a one-time view of your medicine regimen and interaction analysis. The link expires automatically.",
  },
  {
    q: "What languages does SafeMix support?",
    a: "SafeMix supports 10+ Indian languages including Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Odia, and Punjabi. Voice input works in all supported languages.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      <Navbar />
      <main className="pt-[68px]">

        {/* Hero */}
        <section className="py-24 bg-[#F8F8F4] text-center">
          <div className="max-w-2xl mx-auto px-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#5E7464]/10 text-[#42594A] text-xs font-bold tracking-widest uppercase mb-6">FAQ</span>
            <h1 className="font-manrope font-bold text-5xl lg:text-6xl text-[#1a2820] mb-5">
              Frequently Asked <span className="text-[#5E7464]">Questions</span>
            </h1>
            <p className="text-xl text-[#52615a]">
              Everything you need to know about SafeMix.
            </p>
          </div>
        </section>

        {/* Accordion */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${ open === i ? "border-[#5E7464]/30 bg-[#f4f8f5] " : "border-[#e0e8e2] bg-white hover:border-[#5E7464]/20" }`}
                >
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left group"
                  >
                    <span className={`font-manrope font-semibold text-[0.95rem] leading-snug transition-colors ${ open === i ? "text-[#42594A] " : "text-[#1a2820] group-hover:text-[#42594A] " }`}>
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 ml-4 transition-all duration-300 ${ open === i ? "rotate-180 text-[#5E7464]" : "text-[#9ab0a0]" }`} />
                  </button>
                  <div className={`transition-all duration-300 ${open === i ? "max-h-64 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
                    <div className="px-6 pb-6">
                      <p className="text-sm text-[#52615a] leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Still have questions */}
            <div className="mt-16 text-center p-10 rounded-2xl bg-[#F8F8F4] border border-[#e0e8e2]">
              <h3 className="font-manrope font-bold text-2xl text-[#1a2820] mb-3">Still have questions?</h3>
              <p className="text-[#52615a] mb-6">Our team responds within 24 hours.</p>
              <a href="/contact" className="inline-flex items-center gap-2 text-white text-sm font-semibold px-8 py-3.5 rounded-full" style={{ background: "linear-gradient(135deg,#5E7464,#42594A)" }}>
                Contact Us
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
