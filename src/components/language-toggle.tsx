"use client";

import { useLanguage } from "@/components/language-provider";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="border border-white/35 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/75 transition hover:border-white hover:text-white"
      aria-label={language === "tr" ? "Switch language to English" : "Dili Türkçeye geçir"}
      title={language === "tr" ? "English" : "Türkçe"}
    >
      {language === "tr" ? "EN" : "TR"}
    </button>
  );
}
