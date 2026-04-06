"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Search, FileText, Zap, ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { detectInputType } from "@/lib/utils/validation";

export function HeroSection() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsSearching(true);
    const type = detectInputType(trimmed);
    const params = new URLSearchParams({
      type_0: type,
      value_0: trimmed,
      count: "1",
    });
    router.push(`/results?${params.toString()}`);
  };

  return (
    <section className="relative py-16 lg:py-28 bg-gradient-to-b from-primary/5 via-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4" />
            {t("tagline")}
            <Zap className="h-3 w-3" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            {t("heroTitle")}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("heroDescription")}
          </p>

          {/* Search input */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={lang === "ms" ? "cth: 012-345 6789" : "e.g. 012-345 6789"}
                  className="w-full h-14 pl-12 pr-4 text-lg rounded-xl border-2 border-input bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!query.trim() || isSearching}
                className="h-14 px-6 md:px-8 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center gap-2 whitespace-nowrap"
              >
                {isSearching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Search className="h-5 w-5 flex-shrink-0" />
                    <span className="hidden sm:inline">
                      {lang === "ms" ? "Semak" : "Check Now"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              {lang === "ms" ? "100% Percuma" : "100% Free"}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              {lang === "ms" ? "Tiada Daftar" : "No Sign-up"}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              {lang === "ms" ? "Hasil Serta-merta" : "Instant Results"}
            </span>
          </div>

          {/* Secondary actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              href="/search"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {lang === "ms" ? "Carian lanjutan" : "Advanced search"}
            </Link>
            <span className="text-muted-foreground/40">|</span>
            <Link
              href="/submit"
              className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline"
            >
              <FileText className="h-4 w-4" />
              {lang === "ms" ? "Lapor penipu" : "Report a scammer"}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
