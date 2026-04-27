"use client";
import { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Trash2, 
  LogOut, 
  ChevronRight, 
  Smartphone,
  Eye,
  Type
} from "lucide-react";

const sections = [
  { id: "account", label: "Account Settings", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "language", label: "Language & Region", icon: Globe },
  { id: "display", label: "Display & Accessibility", icon: Eye },
];

export default function SettingsPage() {
  const [active, setActive] = useState("account");

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-1">
        <h1 className="font-manrope font-bold text-2xl text-[#1a2820] dark:text-white mb-6">Settings</h1>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
              active === s.id
                ? "bg-[#42594A] text-white shadow-lg"
                : "text-[#52615a] dark:text-[#9ab0a0] hover:bg-white dark:hover:bg-[#1e2820] hover:shadow-sm"
            }`}
          >
            <s.icon className={`w-4 h-4 ${active === s.id ? "text-white" : "text-[#9ab0a0]"}`} />
            {s.label}
          </button>
        ))}
        <div className="pt-4 mt-4 border-t border-[#e0e8e2] dark:border-white/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Settings Content */}
      <div className="flex-1 space-y-6">
        <div className="bg-white dark:bg-[#1e2820] rounded-3xl border border-[#e0e8e2] dark:border-white/10 p-6 md:p-8">
          
          {active === "account" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-[30px] bg-[#5E7464] flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                  R
                </div>
                <div>
                  <h2 className="font-manrope font-bold text-xl text-[#1a2820] dark:text-white">Rahul Sharma</h2>
                  <p className="text-sm text-[#7a9080]">Member since April 2026</p>
                  <button className="text-xs font-bold text-[#5E7464] hover:underline mt-2">Change Photo</button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Full Name</label>
                  <input type="text" defaultValue="Rahul Sharma" className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/10 bg-[#F8F8F4] dark:bg-[#141a15] text-[#1a2820] dark:text-white text-sm focus:border-[#5E7464] focus:ring-1 focus:ring-[#5E7464] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Email Address</label>
                  <input type="email" defaultValue="rahul@example.com" className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/10 bg-[#F8F8F4] dark:bg-[#141a15] text-[#1a2820] dark:text-white text-sm focus:border-[#5E7464] focus:ring-1 focus:ring-[#5E7464] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Phone Number</label>
                  <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/10 bg-[#F8F8F4] dark:bg-[#141a15] text-[#1a2820] dark:text-white text-sm focus:border-[#5E7464] focus:ring-1 focus:ring-[#5E7464] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-2">Blood Group</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-[#e0e8e2] dark:border-white/10 bg-[#F8F8F4] dark:bg-[#141a15] text-[#1a2820] dark:text-white text-sm focus:border-[#5E7464] focus:ring-1 focus:ring-[#5E7464] outline-none">
                    <option>B Positive</option>
                    <option>A Positive</option>
                    <option>O Negative</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-[#f0f4f1] dark:border-white/5 flex justify-end gap-3">
                <button className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#52615a] dark:text-[#9ab0a0] hover:bg-[#F8F8F4] transition-all">Discard Changes</button>
                <button className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#42594A] text-white shadow-md hover:shadow-lg transition-all">Save Profile</button>
              </div>
            </div>
          )}

          {active === "notifications" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="font-manrope font-bold text-xl text-[#1a2820] dark:text-white mb-6">Notification Preferences</h2>
              
              <div className="space-y-4">
                {[
                  { title: "Medication Reminders", desc: "Push notification when it's time to take your dose.", icon: Bell },
                  { title: "Safety Alerts", desc: "Instant alert when a dangerous interaction is detected.", icon: Shield },
                  { title: "Missed Dose Warnings", desc: "Notify you if a dose wasn't logged within 30 minutes.", icon: Clock },
                  { title: "Doctor Portal Access", desc: "Notify you when a doctor reviews your shared profile.", icon: Smartphone },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F8F4] dark:bg-[#141a15] border border-[#e0e8e2] dark:border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1e2820] flex items-center justify-center text-[#5E7464] shadow-sm">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1a2820] dark:text-white">{item.title}</p>
                        <p className="text-[11px] text-[#7a9080]">{item.desc}</p>
                      </div>
                    </div>
                    <div className="w-10 h-5 bg-[#5E7464] rounded-full relative cursor-pointer">
                      <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "display" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="font-manrope font-bold text-xl text-[#1a2820] dark:text-white mb-6">Display & Accessibility</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-4">Font Size</label>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8F8F4] dark:bg-[#141a15] border border-[#e0e8e2] dark:border-white/10">
                    <Type className="w-4 h-4 text-[#9ab0a0]" />
                    <input type="range" className="flex-1 accent-[#5E7464]" min="0" max="100" defaultValue="40" />
                    <Type className="w-6 h-6 text-[#1a2820] dark:text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#52615a] dark:text-[#9ab0a0] uppercase tracking-widest mb-4">Color Theme</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border-2 border-[#5E7464] bg-white text-[#1a2820] text-sm font-bold flex items-center justify-between cursor-pointer">
                      Light Mode
                      <div className="w-4 h-4 rounded-full border-4 border-[#5E7464]" />
                    </div>
                    <div className="p-4 rounded-2xl border border-[#e0e8e2] dark:border-white/10 bg-[#1e2820] text-white text-sm font-bold flex items-center justify-between cursor-pointer">
                      Dark Mode
                      <div className="w-4 h-4 rounded-full border border-white/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {active === "language" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="font-manrope font-bold text-xl text-[#1a2820] dark:text-white mb-6">Language Settings</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["English", "Hindi", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati", "Kannada", "Malayalam"].map((lang) => (
                  <button key={lang} className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                    lang === "English" 
                      ? "border-[#5E7464] bg-[#f0f8f2] dark:bg-[#202a22] text-[#42594A] dark:text-[#b5ccba]" 
                      : "border-[#e0e8e2] dark:border-white/10 bg-[#F8F8F4] dark:bg-[#141a15] text-[#7a9080] hover:border-[#5E7464]/40"
                  }`}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          )}

          {active === "privacy" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-center py-10">
              <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/10 flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="font-manrope font-bold text-xl text-[#1a2820] dark:text-white">Delete Account</h2>
              <p className="text-sm text-[#7a9080] max-w-sm mx-auto mb-8">This action is permanent and will delete all your medication history and family profiles from our servers.</p>
              <button className="px-8 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-200 dark:shadow-none hover:bg-red-600 transition-all">
                Delete My Data & Account
              </button>
            </div>
          )}
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-br from-[#F8F8F4] to-[#e8ede9] dark:from-[#1e2820] dark:to-[#141a15] rounded-3xl border border-[#e0e8e2] dark:border-white/10 p-6 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-[#1a2820] dark:text-white text-sm">Need help?</h4>
            <p className="text-xs text-[#7a9080]">Our clinical support team is here for you.</p>
          </div>
          <Link href="/contact" className="px-4 py-2 bg-white dark:bg-[#2a3430] rounded-xl text-xs font-bold text-[#42594A] dark:text-white shadow-sm hover:shadow-md transition-all border border-[#e0e8e2] dark:border-white/10">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
