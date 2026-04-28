"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Globe } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", disabled: true },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", disabled: true },
];

export default function OnboardingLanguagePage() {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selectedLang) {
      // In a real app we'd save this to preferences/local storage
      localStorage.setItem("safemix_language", selectedLang);
      router.push("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] flex flex-col px-6 py-12 max-w-md mx-auto relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D0E9D5] rounded-full blur-3xl opacity-40 translate-x-1/3 -translate-y-1/2 pointer-events-none" />
      
      {/* Header */}
      <div className="flex justify-center mb-12">
        <Logo size={48} />
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-card">
            <Globe className="w-8 h-8 text-[#465b4c]" />
          </div>
          <h1 className="font-manrope font-bold text-3xl text-[#1B1C1A] mb-3">
            Choose Language
          </h1>
          <p className="text-[#434843] text-base">
            Which language do you prefer to read your medication safety reports in?
          </p>
        </div>

        {/* Language Options */}
        <div className="space-y-4 mb-12">
          {languages.map((lang) => (
            <button
              key={lang.code}
              disabled={lang.disabled}
              onClick={() => setSelectedLang(lang.code)}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 ${ lang.disabled ? "opacity-50 cursor-not-allowed border-transparent bg-[#EFEEEB] " : selectedLang === lang.code ? "border-[#465b4c] bg-[#D0E9D5]/30 " : "border-[#C3C8C1] bg-white hover:border-[#465b4c]/50" }`}
            >
              <div className="flex flex-col items-start gap-1">
                <span className={`font-manrope font-semibold text-lg ${ selectedLang === lang.code ? "text-[#465b4c] " : "text-[#1B1C1A] " }`}>
                  {lang.nativeName}
                </span>
                <span className="text-sm text-[#737873]">
                  {lang.name}
                  {lang.disabled && " (Coming Soon)"}
                </span>
              </div>
              
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${ selectedLang === lang.code ? "border-[#465b4c] " : "border-[#C3C8C1] " }`}>
                {selectedLang === lang.code && (
                  <div className="w-3 h-3 rounded-full bg-[#465b4c]" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="mt-auto pt-6">
        <button
          onClick={handleContinue}
          disabled={!selectedLang}
          className={`w-full py-4 px-6 rounded-full font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${ selectedLang ? "bg-[#465b4c] text-white hover:bg-[#4E6354] shadow-primary" : "bg-[#E3E2E0] text-[#737873] cursor-not-allowed" }`}
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      
    </div>
  );
}
