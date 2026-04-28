"use client";
import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { LANGUAGES, useT, type LangCode } from "@/lib/i18n";

export default function LanguagePicker() {
  const { lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 h-9 rounded-full bg-[#f0f5f1] text-[#42594A] hover:bg-[#dceae0] transition-colors text-xs font-semibold"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden md:inline">{current.native}</span>
        <span className="md:hidden uppercase">{current.code}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-11 w-56 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-[#e0e8e2] py-1.5 z-50 max-h-[60vh] overflow-y-auto">
          {LANGUAGES.map((l) => {
            const active = l.code === lang;
            return (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code as LangCode);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[#f4f8f5] transition-colors ${
                  active ? "text-[#42594A] font-semibold" : "text-[#52615a]"
                }`}
              >
                <span>
                  <span className="block">{l.native}</span>
                  <span className="block text-[10px] text-[#9ab0a0] uppercase tracking-wider">
                    {l.label}
                  </span>
                </span>
                {active && <Check className="w-4 h-4 text-[#5E7464]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
