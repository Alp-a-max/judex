"use client";

import { useLanguage } from "@/components/language-provider";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const favorites = [
  { title: "NARUTO", kind: "anime", category: "ANIME / 01", image: "/images/anime/naruto.jpg", href: "https://anilist.co/anime/20/NARUTO/" },
  { title: "VINLAND SAGA", kind: "anime", category: "ANIME / 02", image: "/images/anime/vinland-saga.jpg", href: "https://anilist.co/anime/101348/VINLAND-SAGA/" },
  { title: "LOOKISM", kind: "manga", category: "MANGA / 01", image: "/images/anime/lookism.jpg", href: "https://anilist.co/manga/86848/Oemo-Jisangjuui/" },
  { title: "ONE PIECE", kind: "manga", category: "MANGA / 02", image: "/images/anime/one-piece.jpg", href: "https://anilist.co/manga/30013/ONE-PIECE/" },
] as const;

export default function AnimeSection() {
  const { language } = useLanguage();
  const isTr = language === "tr";

  return (
    <section id="anime" className="border-b border-white/15 bg-black px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="scroll-reveal mb-10 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
              {isTr ? "05 / İzlediklerim ve okuduklarım" : "05 / What I watch & read"}
            </p>
            <h2 className="font-mono text-3xl font-bold tracking-wide sm:text-5xl">ANİME & MANGA</h2>
          </div>
          <p className="max-w-sm font-mono text-[10px] leading-5 tracking-wide text-white/40">
            {isTr ? "Hikâyesi ve dünyası aklımda kalan favorilerim." : "Stories and worlds that stayed with me."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {favorites.map((favorite, index) => (
            <a
              key={favorite.title}
              className="anime-card scroll-reveal group relative isolate aspect-[4/5] overflow-hidden border border-white/15 bg-[#111]"
              href={favorite.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${favorite.title} — ${favorite.kind}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <img
                src={`${basePath}${favorite.image}`}
                alt={`${favorite.title} ${isTr ? "kapak görseli" : "cover art"}`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/15 opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-4">
                <span className="border border-white/25 bg-black/35 px-2 py-1 font-mono text-[8px] tracking-[0.14em] text-white/75 backdrop-blur-sm">
                  {favorite.category}
                </span>
                <span className="font-mono text-[9px] text-white/60">0{index + 1}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-px w-5 bg-[#ff3b47] transition-all duration-300 group-hover:w-8" />
                  <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/55">
                    {favorite.kind === "anime" ? (isTr ? "İZLEDİĞİM" : "WATCHED") : (isTr ? "OKUDUĞUM" : "READ")}
                  </span>
                </div>
                <h3 className="font-mono text-xs font-bold tracking-[0.12em] text-white sm:text-sm">{favorite.title}</h3>
              </div>
              <div className="pointer-events-none absolute inset-2 border border-white/0 transition-colors duration-300 group-hover:border-white/20 sm:inset-3" />
            </a>
          ))}
        </div>
        <p className="scroll-reveal mt-5 font-mono text-[8px] tracking-wide text-white/30" style={{ transitionDelay: "250ms" }}>
          {isTr ? "Kapak görselleri · AniList" : "Cover art · AniList"}
        </p>
      </div>
    </section>
  );
}
