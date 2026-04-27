"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

const topics = ["Partnerships", "Hospital Onboarding", "Insurance Integration", "Technical Support", "Media & Press", "Careers", "General Inquiry"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", org: "", topic: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      <Navbar />
      <main className="pt-[68px]">

        {/* Hero */}
        <section className="py-20 bg-[#F8F8F4] dark:bg-[#0f1410]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#5E7464]/10 text-[#42594A] dark:text-[#9ab0a0] text-xs font-bold tracking-widest uppercase mb-6">Get In Touch</span>
            <h1 className="font-manrope font-bold text-5xl lg:text-6xl text-[#1a2820] dark:text-white mb-5">
              Let&apos;s <span className="text-[#5E7464]">Connect</span>
            </h1>
            <p className="text-xl text-[#52615a] dark:text-[#9ab0a0]">
              Whether you&apos;re a hospital, insurer, researcher, or patient — we&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* Main */}
        <section className="py-16 bg-white dark:bg-[#141a15]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-3 gap-12">

              {/* Left info */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-manrope font-bold text-2xl text-[#1a2820] dark:text-white mb-6">Contact Info</h2>
                  {[
                    { icon: Mail, label: "Email", val: "hello@safemix.in" },
                    { icon: Phone, label: "Phone", val: "+91 98765 43210" },
                    { icon: MapPin, label: "Location", val: "Bengaluru, India" },
                  ].map((c) => (
                    <div key={c.label} className="flex items-start gap-4 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-[#f0f5f1] dark:bg-[#1e2820] flex items-center justify-center flex-shrink-0">
                        <c.icon className="w-5 h-5 text-[#5E7464]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#9ab0a0] uppercase tracking-widest mb-0.5">{c.label}</p>
                        <p className="text-sm font-medium text-[#1a2820] dark:text-white">{c.val}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 rounded-2xl bg-[#F8F8F4] dark:bg-[#1e2820] border border-[#e0e8e2] dark:border-white/10">
                  <h3 className="font-manrope font-semibold text-lg text-[#1a2820] dark:text-white mb-3">Common Inquiries</h3>
                  <ul className="space-y-2">
                    {["Hospital onboarding & licensing", "Insurance data integrations", "Research partnerships", "Media & press kit", "Investor relations"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-[#52615a] dark:text-[#9ab0a0]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#5E7464]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2">
                {sent ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                    <CheckCircle className="w-16 h-16 text-[#5E7464] mb-5" />
                    <h3 className="font-manrope font-bold text-2xl text-[#1a2820] dark:text-white mb-3">Message Sent!</h3>
                    <p className="text-[#52615a] dark:text-[#9ab0a0] mb-6">We&apos;ll get back to you within 24 hours.</p>
                    <button onClick={() => setSent(false)} className="text-sm font-semibold text-[#5E7464] hover:underline">
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      {[
                        { id: "name", label: "Full Name", placeholder: "Rahul Sharma", type: "text" },
                        { id: "email", label: "Email Address", placeholder: "rahul@example.com", type: "email" },
                        { id: "phone", label: "Phone Number", placeholder: "+91 98765 43210", type: "tel" },
                        { id: "org", label: "Organization (optional)", placeholder: "Hospital / Clinic / Insurance", type: "text" },
                      ].map((f) => (
                        <div key={f.id}>
                          <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">{f.label}</label>
                          <input
                            type={f.type}
                            placeholder={f.placeholder}
                            value={form[f.id as keyof typeof form]}
                            onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-[#F8F8F4] dark:bg-[#1e2820] text-[#1a2820] dark:text-white placeholder-[#9ab0a0] focus:outline-none focus:border-[#5E7464] dark:focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 transition-all text-sm"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Topic</label>
                      <select
                        value={form.topic}
                        onChange={(e) => setForm({ ...form, topic: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-[#F8F8F4] dark:bg-[#1e2820] text-[#1a2820] dark:text-white focus:outline-none focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 transition-all text-sm"
                      >
                        <option value="">Select a topic...</option>
                        {topics.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Message</label>
                      <textarea
                        rows={5}
                        placeholder="Tell us how we can help..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/15 bg-[#F8F8F4] dark:bg-[#1e2820] text-[#1a2820] dark:text-white placeholder-[#9ab0a0] focus:outline-none focus:border-[#5E7464] focus:ring-2 focus:ring-[#5E7464]/20 transition-all text-sm resize-none"
                      />
                    </div>

                    <button type="submit"
                      className="inline-flex items-center gap-2 text-white text-sm font-semibold px-8 py-4 rounded-xl w-full justify-center transition-all hover:shadow-[0_8px_30px_rgba(94,116,100,0.35)] active:scale-[0.99]"
                      style={{ background: "linear-gradient(135deg,#5E7464,#42594A)" }}
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
