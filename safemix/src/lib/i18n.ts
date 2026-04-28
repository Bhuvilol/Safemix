/**
 * Lightweight i18n for SafeMix.
 *
 * Why hand-rolled? PRD requires 10 Indian languages with low bundle cost on
 * 2 GB-RAM phones — a heavy i18n framework (~30 KB) is overkill for a string
 * map and would block the critical render path. This module:
 *  - Persists the user's choice in localStorage (`safemix-lang`).
 *  - Falls back to English for any missing key (never shows a key to the user).
 *  - Exposes a `useT()` hook so components rerender on language change via a
 *    custom-event listener (so language changes propagate without React context).
 */
"use client";
import { useEffect, useState, useCallback } from "react";

export const LANGUAGES = [
  { code: "en", label: "English",  native: "English"   },
  { code: "hi", label: "Hindi",    native: "हिन्दी"      },
  { code: "bn", label: "Bengali",  native: "বাংলা"      },
  { code: "ta", label: "Tamil",    native: "தமிழ்"      },
  { code: "te", label: "Telugu",   native: "తెలుగు"     },
  { code: "or", label: "Odia",     native: "ଓଡ଼ିଆ"       },
  { code: "mr", label: "Marathi",  native: "मराठी"      },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી"     },
  { code: "kn", label: "Kannada",  native: "ಕನ್ನಡ"      },
  { code: "ml", label: "Malayalam",native: "മലയാളം"    },
  { code: "pa", label: "Punjabi",  native: "ਪੰਜਾਬੀ"      },
  { code: "ur", label: "Urdu",     native: "اُردُو"      },
] as const;

export type LangCode = typeof LANGUAGES[number]["code"];

const STORAGE_KEY = "safemix-lang";
const CHANGE_EVENT = "safemix-lang-change";

const STRINGS: Record<string, Partial<Record<LangCode, string>>> = {
  "common.signIn":       { en: "Sign in",         hi: "साइन इन करें",      bn: "সাইন ইন করুন", ta: "உள்நுழைய", te: "సైన్ ఇన్", or: "ସାଇନ୍ ଇନ୍" },
  "common.signOut":      { en: "Sign out",        hi: "साइन आउट",          bn: "সাইন আউট",   ta: "வெளியேறு", te: "సైన్ అవుట్", or: "ସାଇନ୍ ଆଉଟ୍" },
  "common.dashboard":    { en: "Dashboard",       hi: "डैशबोर्ड",           bn: "ড্যাশবোর্ড",   ta: "டாஷ்போர்டு", te: "డాష్‌బోర్డ్", or: "ଡ୍ୟାସବୋର୍ଡ" },
  "common.add":          { en: "Add",             hi: "जोड़ें",              bn: "যোগ করুন",   ta: "சேர்",      te: "జోడించు",  or: "ଯୋଗ କରନ୍ତୁ" },
  "common.cancel":       { en: "Cancel",          hi: "रद्द करें",          bn: "বাতিল",      ta: "ரத்து",     te: "రద్దు",      or: "ବାତିଲ" },
  "common.save":         { en: "Save",            hi: "सहेजें",             bn: "সংরক্ষণ",   ta: "சேமி",      te: "సేవ్ చేయండి", or: "ସେଭ୍ କରନ୍ତୁ" },

  "nav.home":            { en: "Home",            hi: "होम",                bn: "হোম",       ta: "முகப்பு",   te: "హోమ్",     or: "ହୋମ" },
  "nav.addMedicine":     { en: "Add Medicine",    hi: "दवा जोड़ें",         bn: "ওষুধ যোগ করুন", ta: "மருந்து சேர்", te: "మందు జోడించు", or: "ଔଷଧ ଯୋଗ କରନ୍ତୁ" },
  "nav.reports":         { en: "Reports",         hi: "रिपोर्ट",            bn: "রিপোর্ট",    ta: "அறிக்கை",   te: "నివేదికలు", or: "ରିପୋର୍ଟ" },
  "nav.reminders":       { en: "Reminders",       hi: "रिमाइंडर",           bn: "রিমাইন্ডার", ta: "நினைவூட்டல்", te: "రిమైండర్‌లు", or: "ରିମାଇଣ୍ଡର" },
  "nav.settings":        { en: "Settings",        hi: "सेटिंग्स",            bn: "সেটিংস",    ta: "அமைப்புகள்", te: "సెట్టింగ్‌లు", or: "ସେଟିଂସ୍" },

  "verdict.red":         { en: "Severe risk",     hi: "गंभीर खतरा",        bn: "মারাত্মক ঝুঁকি", ta: "தீவிர அபாயம்", te: "తీవ్రమైన ప్రమాదం", or: "ଗମ୍ଭୀର ବିପଦ" },
  "verdict.yellow":      { en: "Caution",         hi: "सावधानी",           bn: "সাবধান",    ta: "எச்சரிக்கை", te: "జాగ్రత్త",  or: "ସାବଧାନ" },
  "verdict.green":       { en: "Safe",            hi: "सुरक्षित",            bn: "নিরাপদ",   ta: "பாதுகாப்பானது", te: "సురక్షితం", or: "ସୁରକ୍ଷିତ" },

  "disclaimer.short":    {
    en: "For awareness, not diagnosis. Talk to a doctor or pharmacist.",
    hi: "यह जानकारी जागरूकता के लिए है, निदान के लिए नहीं। कृपया डॉक्टर या फार्मासिस्ट से सलाह लें।",
    bn: "এটি সচেতনতার জন্য, রোগনির্ণয়ের জন্য নয়। ডাক্তার বা ফার্মাসিস্টের সাথে কথা বলুন।",
    ta: "இது விழிப்புணர்வுக்காக, நோய் கண்டறிதலுக்காக அல்ல. மருத்துவரை அணுகவும்.",
    te: "ఇది అవగాహన కోసం, రోగనిర్ధారణ కోసం కాదు. వైద్యుడిని సంప్రదించండి.",
    or: "ଏହା ସଚେତନତା ପାଇଁ, ରୋଗନିର୍ଣ୍ଣୟ ପାଇଁ ନୁହେଁ। ଡାକ୍ତରଙ୍କ ସହ କଥାବାର୍ତ୍ତା କରନ୍ତୁ।",
  },

  "lang.label":          { en: "Language",        hi: "भाषा",               bn: "ভাষা",       ta: "மொழி",      te: "భాష",      or: "ଭାଷା" },
};

export function getLanguage(): LangCode {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
  if (stored && LANGUAGES.some((l) => l.code === stored)) return stored;
  return "en";
}

export function setLanguage(code: LangCode) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, code);
  document.documentElement.lang = code;
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: code }));
}

export function t(key: string, lang?: LangCode): string {
  const l = lang ?? getLanguage();
  const entry = STRINGS[key];
  if (!entry) return key;
  return entry[l] ?? entry.en ?? key;
}

/** React hook — returns a translator that re-renders when the language changes. */
export function useT(): { t: (key: string) => string; lang: LangCode; setLang: (l: LangCode) => void } {
  const [lang, setLangState] = useState<LangCode>(() => getLanguage());

  useEffect(() => {
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent<LangCode>).detail;
      if (detail) setLangState(detail);
    };
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
  }, []);

  const translate = useCallback((key: string) => t(key, lang), [lang]);
  return { t: translate, lang, setLang: setLanguage };
}

export const LANG_NAME_FOR_PROMPT: Record<LangCode, string> = {
  en: "English",
  hi: "Hindi (हिन्दी)",
  bn: "Bengali (বাংলা)",
  ta: "Tamil (தமிழ்)",
  te: "Telugu (తెలుగు)",
  or: "Odia (ଓଡ଼ିଆ)",
  mr: "Marathi (मराठी)",
  gu: "Gujarati (ગુજરાતી)",
  kn: "Kannada (ಕನ್ನಡ)",
  ml: "Malayalam (മലയാളം)",
  pa: "Punjabi (ਪੰਜਾਬੀ)",
  ur: "Urdu (اردو)",
};
