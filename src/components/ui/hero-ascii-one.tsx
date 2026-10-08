"use client";

import { useEffect } from "react";
import LanguageToggle from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import AnimeSection from "@/components/ui/anime-section";

declare global {
  interface Window {
    UnicornStudio?: { isInitialized?: boolean; init: () => void };
  }
}

function useUnicornStudio() {
  useEffect(() => {
    const initialize = () => {
      if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
        window.UnicornStudio.init();
        window.UnicornStudio.isInitialized = true;
      }
    };
    if (window.UnicornStudio) {
      initialize();
      return;
    }
    const scriptId = "unicorn-studio-script";
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", initialize, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
    script.async = true;
    script.onload = initialize;
    document.head.appendChild(script);
  }, []);
}

function useScrollEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(".scroll-reveal"));
    let observer: IntersectionObserver | undefined;

    if (!reduceMotion && "IntersectionObserver" in window) {
      document.documentElement.classList.add("scroll-effects-ready");
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
      revealItems.forEach((item) => observer?.observe(item));
    }
    return () => {
      observer?.disconnect();
      document.documentElement.classList.remove("scroll-effects-ready");
    };
  }, []);
}

export default function AnimationPage() {
  useUnicornStudio();
  useScrollEffects();
  const { language } = useLanguage();
  const isTr = language === "tr";

  useEffect(() => {
    const hideBranding = () => {
      document.querySelectorAll<HTMLElement>("a, button, [title], [aria-label], [class*='unicorn' i], [class*='brand' i], [class*='credit' i], [class*='watermark' i]").forEach((element) => {
        const text = element.textContent?.toLowerCase() ?? "";
        const title = element.getAttribute("title")?.toLowerCase() ?? "";
        const label = element.getAttribute("aria-label")?.toLowerCase() ?? "";
        const href = element.getAttribute("href")?.toLowerCase() ?? "";
        const isUnicornBadge =
          text.includes("made with unicorn") ||
          title.includes("made with unicorn") ||
          title.includes("unicorn.studio") ||
          label.includes("unicorn.studio") ||
          href.includes("unicorn.studio");

        if (isUnicornBadge) {
          element.style.setProperty("display", "none", "important");
          element.style.setProperty("visibility", "hidden", "important");
        }
      });
    };

    hideBranding();
    const observer = new MutationObserver(hideBranding);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["href", "title", "aria-label"] });
    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-black text-white">
      <section className="relative flex min-h-screen flex-col overflow-hidden bg-black">
        <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
          <div data-us-project="OMzqyUv6M3kSnv0JeAtC" className="unicorn-project h-full w-full" style={{ minHeight: "100vh" }} />
        </div>
        <div className="stars-bg absolute inset-0 lg:hidden" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/95 via-black/60 to-black/10" aria-hidden="true" />

        <header className="relative z-20 border-b border-white/20">
          <div className="container mx-auto flex items-center justify-between px-4 py-3 lg:px-8 lg:py-4">
            <a href="#top" className="flex items-center gap-2 lg:gap-4">
              <span className="-skew-x-12 transform font-mono text-xl font-bold italic tracking-widest lg:text-2xl">UIMIX</span>
              <span className="h-3 w-px bg-white/40 lg:h-4" />
              <span className="font-mono text-[8px] text-white/60 lg:text-[10px]">EST. 2025</span>
            </a>
            <nav className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.15em] text-white/65 sm:gap-7 sm:text-[10px]">
              <a className="transition hover:text-white" href="#about">{isTr ? "Hakkımda" : "About"}</a>
              <a className="transition hover:text-white" href="#anime">Anime &amp; Manga</a>
              <LanguageToggle />
            </nav>
          </div>
        </header>

        <div id="top" className="pointer-events-none absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-white/30 lg:h-12 lg:w-12" />
        <div className="pointer-events-none absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-white/30 lg:h-12 lg:w-12" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-white/30 lg:h-12 lg:w-12" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-white/30 lg:h-12 lg:w-12" />

        <section className="relative z-10 flex flex-1 items-center justify-end py-16 lg:py-0">
          <div className="w-full px-6 lg:w-1/2 lg:px-16 lg:pr-[10%]">
            <div className="relative max-w-lg lg:ml-auto">
              <div className="mb-3 flex items-center gap-2 opacity-60">
                <div className="h-px w-8 bg-white" /><span className="font-mono text-[10px]">∞</span><div className="h-px flex-1 bg-white" />
              </div>
              <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.24em] text-white/50">{isTr ? "Kişisel portfolyo — Hakkımda" : "Personal portfolio — About me"}</p>
              <h1 className="mb-4 whitespace-nowrap font-mono text-2xl font-bold leading-tight tracking-wider lg:-ml-[5%] lg:text-5xl" style={{ letterSpacing: "0.1em" }}>
                {isTr ? "SONSUZ ARAYIŞ" : "ENDLESS PURSUIT"}
              </h1>
              <p className="mb-6 font-mono text-xs leading-relaxed text-gray-300/85 lg:text-sm">
                {isTr ? "Dijital deneyler, arayüzler ve fikirler… Her biri, tekrar tekrar geliştirilerek şekillendi." : "A collection of digital experiments, interfaces, and ideas — made one iteration at a time."}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a href="#about" className="group relative border border-white bg-transparent px-5 py-2.5 text-center font-mono text-xs transition hover:bg-white hover:text-black lg:px-6 lg:text-sm">
                  {isTr ? "BENİ TANI" : "A LITTLE ABOUT ME"}
                  <span className="absolute -left-1 -top-1 hidden h-2 w-2 border-l border-t border-white opacity-0 transition group-hover:opacity-100 lg:block" />
                  <span className="absolute -bottom-1 -right-1 hidden h-2 w-2 border-b border-r border-white opacity-0 transition group-hover:opacity-100 lg:block" />
                </a>
              </div>
              <div className="mt-6 hidden items-center gap-2 opacity-40 lg:flex">
                <span className="font-mono text-[9px]">∞</span><div className="h-px flex-1 bg-white" /><span className="font-mono text-[9px]">SISYPHUS.PROTOCOL</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="relative z-20 border-t border-white/20 bg-black/40 backdrop-blur-sm">
          <div className="container mx-auto flex items-center justify-between px-4 py-2 font-mono text-[8px] text-white/50 lg:px-8 lg:py-3 lg:text-[9px]">
            <span>{isTr ? "KİŞİSEL PORTFOLYO / 2025—26" : "PERSONAL PORTFOLIO / 2025—26"}</span><span className="hidden sm:inline">{isTr ? "DİJİTAL TASARIM · YARATICI KOD" : "DIGITAL DESIGN · CREATIVE CODE"}</span><a href="#about" className="transition hover:text-white">{isTr ? "HAKKIMDA ↓" : "ABOUT ME ↓"}</a>
          </div>
        </footer>
      </section>

      <section id="about" className="border-b border-white/15 bg-black px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div className="scroll-reveal"><p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">{isTr ? "01 / Hakkımda" : "01 / About me"}</p><h2 className="font-mono text-3xl font-bold tracking-wide sm:text-5xl">{isTr ? "BİRAZ BEN" : "A LITTLE ABOUT ME"}</h2></div>
          <div className="scroll-reveal" style={{ transitionDelay: "120ms" }}>
            <p className="text-lg leading-8 text-white/75 sm:text-2xl sm:leading-10">
              {isTr
                ? "Web sitesi ağırlıklı kod yazıyorum. Bunun yanında beat üretiyor, müzik üzerinde çalışıyor ve aranjman denemeleri yapıyorum."
                : "I write code, mostly for websites. I also make beats, work on music, and experiment with arrangements."}
            </p>
            <p className="mb-3 mt-8 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">{isTr ? "İlgi alanlarım" : "Things I’m into"}</p>
            <div className="flex flex-wrap gap-2">
              {(isTr ? ["WEB GELİŞTİRME", "BEAT ÜRETİMİ", "ARANJMAN", "OYUNLAR"] : ["WEB DEVELOPMENT", "BEATMAKING", "ARRANGEMENT", "GAMES"]).map((label) => <span key={label} className="border border-white/20 px-3 py-2 font-mono text-[9px] tracking-[0.12em] text-white/60">{label}</span>)}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-10 border-t border-white/15 pt-10 md:grid-cols-2 lg:mt-20">
          <div>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">{isTr ? "02 / Neler yapıyorum" : "02 / What I do"}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <article className="scroll-reveal border border-white/15 bg-white/[0.025] p-5" style={{ transitionDelay: "140ms" }}>
                <p className="mb-8 font-mono text-[9px] text-white/35">01 — WEB</p>
                <h3 className="font-mono text-sm font-bold tracking-wide">{isTr ? "WEB GELİŞTİRME" : "WEB DEVELOPMENT"}</h3>
                <p className="mt-2 text-xs leading-5 text-white/50">{isTr ? "Ağırlıklı olarak web siteleri ve arayüzler kodluyorum." : "Mostly building websites and coding interfaces."}</p>
              </article>
              <article className="scroll-reveal border border-white/15 bg-white/[0.025] p-5" style={{ transitionDelay: "300ms" }}>
                <p className="mb-8 font-mono text-[9px] text-white/35">02 — AUDIO</p>
                <h3 className="font-mono text-sm font-bold tracking-wide">{isTr ? "MÜZİK ÜRETİMİ" : "MUSIC PRODUCTION"}</h3>
                <p className="mt-2 text-xs leading-5 text-white/50">{isTr ? "Beat üretiyor, aranje üzerine çalışıyorum." : "Making beats and working on arrangements."}</p>
              </article>
            </div>

            <div className="scroll-reveal mt-8 border border-white/15 bg-white/[0.025] p-5" style={{ transitionDelay: "260ms" }}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{isTr ? "MIDI ekipmanım" : "MIDI gear"}</p>
                <span className="font-mono text-[9px] text-[#ff3b47]">STUDIO / 01</span>
              </div>
              <p className="font-mono text-lg font-bold tracking-wide">AKAI MPK5</p>
              <p className="mt-1 text-xs text-white/45">{isTr ? "MIDI klavye" : "MIDI keyboard"}</p>
            </div>
          </div>

          <div>
            <p className="scroll-reveal mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45" style={{ transitionDelay: "100ms" }}>{isTr ? "03 / Sistem özellikleri" : "03 / System specs"}</p>
            <div className="scroll-reveal border border-white/15 bg-white/[0.025] p-5 sm:p-6" style={{ transitionDelay: "220ms" }}>
              <p className="mb-5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">ASUS TUF</p>
              <dl className="grid grid-cols-2 gap-x-5 gap-y-6">
                {[
                  [isTr ? "İşlemci" : "CPU", "14650HX"],
                  [isTr ? "Ekran kartı" : "GPU", "RTX 5060 · 8 GB VRAM"],
                  ["RAM", "16 GB"],
                ].map(([label, value]) => <div key={label} className="border-t border-white/10 pt-3"><dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">{label}</dt><dd className="mt-2 text-sm text-white/85">{value}</dd></div>)}
              </dl>
            </div>

            <div className="mt-8">
              <p className="scroll-reveal mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45" style={{ transitionDelay: "120ms" }}>{isTr ? "04 / Oynadığım oyunlar" : "04 / Games I play"}</p>
              <div className="flex flex-wrap gap-2">
                {["BeamNG.drive", "Forza 6", "Roblox", "Marvel’s Spider-Man", "Wuthering Waves", "Stardew Valley", "Ghost of Tsushima"].map((game, index) => <span key={game} className="scroll-reveal border border-white/15 px-3 py-2 font-mono text-[9px] tracking-[0.08em] text-white/65 transition hover:border-white/40 hover:text-white" style={{ transitionDelay: `${index * 45}ms` }}>{game}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimeSection />

      <div className="border-t border-white/15 px-5 py-4 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-6xl items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-white/35"><span>UIMIX © 2026</span><a href="#top" className="transition hover:text-white">{isTr ? "Başa dön ↑" : "Back to top ↑"}</a><span>{isTr ? "Her seferinde bir adım." : "Built one iteration at a time."}</span></div></div>

      <style jsx global>{`
        [data-us-project] { position: relative !important; overflow: hidden !important; }
        [data-us-project] canvas { clip-path: inset(0 0 10% 0) !important; }
        .unicorn-project * { pointer-events: none !important; }
        [data-us-project] a[href*="unicorn" i],
        [data-us-project] button[title*="unicorn" i],
        [data-us-project] [title*="made with" i],
        [data-us-project] [class*="brand" i],
        [data-us-project] [class*="credit" i],
        [data-us-project] [class*="watermark" i] { display: none !important; visibility: hidden !important; }
        .scroll-effects-ready .scroll-reveal {
          opacity: 0;
          filter: blur(10px);
          transform: translate3d(0, 30px, 0);
          transition: opacity 850ms cubic-bezier(.2, .7, .2, 1), filter 850ms cubic-bezier(.2, .7, .2, 1), transform 850ms cubic-bezier(.2, .7, .2, 1);
        }
        .scroll-effects-ready .scroll-reveal.is-visible {
          opacity: 1;
          filter: blur(0);
          transform: translate3d(0, 0, 0);
        }
        .stars-bg {
          background-color: #050505;
          background-image: radial-gradient(1px 1px at 20% 30%, white, transparent), radial-gradient(1px 1px at 60% 70%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent), radial-gradient(1px 1px at 80% 10%, white, transparent), radial-gradient(1px 1px at 90% 60%, white, transparent), radial-gradient(1px 1px at 33% 80%, white, transparent), radial-gradient(1px 1px at 15% 60%, white, transparent), radial-gradient(1px 1px at 70% 40%, white, transparent);
          background-size: 200% 200%, 180% 180%, 250% 250%, 220% 220%, 190% 190%, 240% 240%, 210% 210%, 230% 230%;
          opacity: .3;
        }
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
        }
      `}</style>
    </main>
  );
}
