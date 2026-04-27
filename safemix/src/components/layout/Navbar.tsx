"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import SafeMixLogo from "@/components/ui/Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Doctors", href: "/doctors" },
  { label: "Security", href: "/security" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("safemix-dark");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "true" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("safemix-dark", String(next));
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isDash = pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/doctor-portal");

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white/96 dark:bg-[#141a15]/96 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-[#c3c8c1]/40 dark:border-white/10"
        : "bg-white/80 dark:bg-[#141a15]/70 backdrop-blur-md"
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link href="/" className="hover:opacity-85 transition-opacity">
            <SafeMixLogo size={34} textSize="text-[1.2rem]" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => {
              const active = pathname === l.href;
              return (
                <Link key={l.href} href={l.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                    active
                      ? "text-[#42594A] dark:text-[#b5ccba] bg-[#f0f5f1] dark:bg-[#2a3430]"
                      : "text-[#52615a] dark:text-[#9ab0a0] hover:text-[#42594A] dark:hover:text-[#b5ccba] hover:bg-[#f4f7f5] dark:hover:bg-[#202820]"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Dark toggle */}
            <button onClick={toggleDark}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#f0f5f1] dark:bg-[#202820] text-[#5E7464] dark:text-[#9ab0a0] hover:bg-[#dceae0] dark:hover:bg-[#2a3430] transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="w-[15px] h-[15px]" /> : <Moon className="w-[15px] h-[15px]" />}
            </button>

            {!isDash && (
              <>
                <Link href="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#42594A] dark:text-[#9ab0a0] hover:bg-[#f0f5f1] dark:hover:bg-[#202820] rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link href="/signup"
                  className="px-5 py-2 text-sm font-semibold text-white rounded-full transition-all duration-200 active:scale-95 shadow-[0_4px_12px_rgba(94,116,100,0.3)]"
                  style={{ background: "linear-gradient(135deg, #5E7464 0%, #42594A 100%)" }}
                >
                  Get Started
                </Link>
              </>
            )}
            {isDash && (
              <Link href="/dashboard"
                className="px-5 py-2 text-sm font-semibold text-white rounded-full"
                style={{ background: "linear-gradient(135deg, #5E7464 0%, #42594A 100%)" }}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <button onClick={toggleDark}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#f0f5f1] dark:bg-[#202820] text-[#5E7464] dark:text-[#9ab0a0]"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-[#42594A] dark:text-[#9ab0a0] hover:bg-[#f0f5f1] dark:hover:bg-[#202820] transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-[600px]" : "max-h-0"}`}>
        <div className="bg-white dark:bg-[#141a15] border-t border-[#c3c8c1]/30 dark:border-white/10 px-6 py-4 space-y-1">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === l.href
                  ? "bg-[#dceae0] dark:bg-[#2a3430] text-[#42594A] dark:text-[#b5ccba]"
                  : "text-[#52615a] dark:text-[#9ab0a0] hover:bg-[#f0f5f1] dark:hover:bg-[#202820]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-[#c3c8c1]/30 dark:border-white/10 mt-2">
            <Link href="/login" className="text-center py-3 text-sm font-semibold text-[#42594A] dark:text-[#9ab0a0] border border-[#c3c8c1] dark:border-white/20 rounded-xl hover:bg-[#f0f5f1] dark:hover:bg-[#202820] transition-colors">
              Login
            </Link>
            <Link href="/signup" className="text-center py-3 text-sm font-semibold text-white rounded-xl" style={{ background: "linear-gradient(135deg, #5E7464 0%, #42594A 100%)" }}>
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
