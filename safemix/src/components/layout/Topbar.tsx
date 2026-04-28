"use client";
import Link from "next/link";
import { Bell, Search, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import LanguagePicker from "@/components/ui/LanguagePicker";

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const displayName = user?.displayName || user?.phoneNumber || user?.email || "User";
  const initial = (user?.displayName?.[0] || user?.phoneNumber?.replace(/\D/g, "").charAt(0) || user?.email?.[0] || "U").toUpperCase();

  const notifs = [
    { text: "⚠️ Interaction: Metformin + Karela", time: "5m ago", type: "red" },
    { text: "🔔 Reminder: Lisinopril at 8 PM", time: "1h ago", type: "blue" },
    { text: "✅ Dr. Sharma reviewed your regimen", time: "2h ago", type: "green" },
  ];

  return (
    <header className="h-16 bg-white border-b border-[#e0e8e2] flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 flex-shrink-0">
      
      {/* Left side: Mobile Menu + Search */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-lg text-[#52615a] hover:bg-[#f0f5f1] md:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search (Desktop only) */}
        <div className="hidden md:flex items-center gap-2 bg-[#F8F8F4] rounded-xl px-4 py-2.5 text-sm text-[#9ab0a0] border border-[#e0e8e2] hover:border-[#5E7464]/30 transition-colors cursor-pointer min-w-[220px]">
          <Search className="w-4 h-4" />
          <span>Search medicines...</span>
          <kbd className="ml-auto text-[10px] bg-[#e8ede9] text-[#7a9080] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-1.5 md:gap-2">

        {/* Language */}
        <LanguagePicker />

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            className="relative w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center bg-[#F8F8F4] text-[#52615a] hover:bg-[#dceae0] transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          {showNotif && (
            <div className="absolute right-0 top-12 w-72 md:w-80 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-[#e0e8e2] p-4 z-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-[#1a2820]">Notifications</h3>
                <button className="text-xs text-[#5E7464] font-medium">Mark all read</button>
              </div>
              {notifs.map((n, i) => (
                <div key={i} className="px-3 py-2.5 rounded-xl hover:bg-[#f4f8f5] cursor-pointer transition-colors mb-1">
                  <p className="text-sm text-[#1a2820]">{n.text}</p>
                  <p className="text-xs text-[#9ab0a0] mt-0.5">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-2 pl-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold font-manrope uppercase" style={{ background: "linear-gradient(135deg,#5E7464,#42594A)" }}>
              {initial}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-[#1a2820] leading-none truncate max-w-[120px]">{displayName}</p>
              <p className="text-xs text-[#9ab0a0] mt-0.5">Patient</p>
            </div>
            <ChevronDown className="w-4 h-4 text-[#9ab0a0] hidden md:block" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-[#e0e8e2] p-2 z-50">
              {[
                { label: "Profile", href: "/dashboard/settings" },
                { label: "Doctor Portal", href: "/doctor-portal" },
              ].map((item) => (
                <Link key={item.label} href={item.href}
                  className="block px-3 py-2 text-sm text-[#52615a] hover:bg-[#f4f8f5] hover:text-[#42594A] rounded-xl transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-[#e0e8e2] mt-1 pt-1">
                <button
                  onClick={async () => { await logout(); setShowProfile(false); }}
                  className="w-full text-left block px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
