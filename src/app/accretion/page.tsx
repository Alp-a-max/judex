"use client";

import EtchedAccretion from "@/components/ui/etched-accretion";
import LanguageToggle from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";

export default function AccretionPage() {
  const { language } = useLanguage();
  const isTr = language === "tr";

  return (
    <main className="relative w-full">
      <EtchedAccretion>
        <div className="relative h-full text-white">
          <div className="pointer-events-none flex h-full flex-col justify-end p-6 sm:p-10">
            <div className="max-w-xl">
              <h1 className="text-4xl font-light leading-[1.05] tracking-tight sm:text-6xl">
                {isTr ? <>Ufuktan <span className="italic text-[#ff3b47]">hiçbir şey</span><br />kaçamaz.</> : <>Nothing <span className="italic text-[#ff3b47]">escapes</span><br />the horizon.</>}
              </h1>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">
                {isTr ? "Hareket ettir · Beslemek için basılı tut" : "Move to drift · Hold to feed it"}
              </p>
            </div>
          </div>
          <div className="absolute right-5 top-5 z-20 flex items-center gap-3">
            <a href="/" className="border border-white/35 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/75 transition hover:border-white hover:text-white">{isTr ? "Portfolyoya dön" : "Back to portfolio"}</a>
            <LanguageToggle />
          </div>
        </div>
      </EtchedAccretion>
    </main>
  );
}
