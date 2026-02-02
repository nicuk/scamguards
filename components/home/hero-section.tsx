"use client";

import Link from "next/link";
import { Sparkles, Search, FileText, Zap } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function HeroSection() {
  const { t, lang } = useLanguage();

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* AI Badge - Super prominent */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4" />
            {t("tagline")}
            <Zap className="h-3 w-3" />
          </div>
          
          {/* Main headline - Question format is more engaging */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t("heroTitle")}
          </h1>
          
          {/* Simple description */}
          <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            {t("heroDescription")}
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {lang === "ms" ? "100% Percuma" : "100% Free"}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {lang === "ms" ? "Tiada Daftar" : "No Sign-up"}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {lang === "ms" ? "Hasil Serta-merta" : "Instant Results"}
            </span>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 h-14 px-10 text-lg font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Search className="h-5 w-5 flex-shrink-0" />
              <span>{t("checkNow")}</span>
            </Link>
            <Link
              href="/submit"
              className="inline-flex items-center justify-center gap-2 h-14 px-10 text-lg font-medium rounded-xl border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all"
            >
              <FileText className="h-5 w-5 flex-shrink-0" />
              <span>{t("reportScam")}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
