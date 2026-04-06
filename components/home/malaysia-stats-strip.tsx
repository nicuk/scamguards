"use client";

import { useLanguage } from "@/lib/language-context";

const stats = [
  { value: "RM2.77B", labelEn: "Lost to scams (2025)", labelMs: "Kerugian penipuan (2025)" },
  { value: "67,735", labelEn: "Cases in 2024", labelMs: "Kes pada 2024" },
  { value: "+76%", labelEn: "Year-on-year increase", labelMs: "Peningkatan tahunan" },
  { value: "RM5.62B", labelEn: "Total lost 2023-2025", labelMs: "Jumlah kerugian 2023-2025" },
];

export function MalaysiaStatsStrip() {
  const { lang } = useLanguage();

  return (
    <section className="py-6 bg-destructive/5 border-y border-destructive/10">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium text-muted-foreground mb-4">
          {lang === "ms"
            ? "Rakyat Malaysia kehilangan RM2.77 bilion kepada penipu pada 2025"
            : "Malaysians lost RM2.77 billion to scammers in 2025"}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <p className="text-lg md:text-xl font-bold text-destructive">{s.value}</p>
              <p className="text-xs text-muted-foreground">{lang === "ms" ? s.labelMs : s.labelEn}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-[11px] text-muted-foreground/60 mt-3">
          {lang === "ms" ? "Sumber" : "Source"}:{" "}
          <a
            href="https://www.malaymail.com/news/malaysia/2026/01/22/home-ministry-malaysias-online-fraud-surge-drains-rm277b-in-2025-the-highest-in-three-years/206298"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            Home Ministry / PDRM
          </a>
        </p>
      </div>
    </section>
  );
}
