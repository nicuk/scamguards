"use client";

import Link from "next/link";
import { ArrowRight, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

export function CtaSection() {
  const { lang } = useLanguage();

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {lang === "ms"
            ? "Jangan Jadi Mangsa Seterusnya"
            : "Don\u2019t Be the Next Victim"}
        </h2>
        <p className="text-primary-foreground/80 mb-4 max-w-2xl mx-auto text-lg">
          {lang === "ms"
            ? "Setiap hari, rakyat Malaysia kehilangan wang kepada penipu. Semak dahulu sebelum anda bayar — atau laporkan jika anda sudah kena tipu."
            : "Every day, Malaysians lose money to scammers. Check first before you pay — or report if you\u2019ve already been cheated."}
        </p>
        <p className="text-primary-foreground/60 mb-8 text-sm">
          {lang === "ms"
            ? "Percuma. Tiada daftar. 10 saat sahaja."
            : "Free. No sign-up. 10 seconds."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-lg px-8"
          >
            <Link href="/search" className="inline-flex items-center gap-2">
              <Search className="h-5 w-5" />
              <span>
                {lang === "ms" ? "Semak Sekarang" : "Check Someone Now"}
              </span>
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-lg px-8"
          >
            <Link href="/submit" className="inline-flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>
                {lang === "ms" ? "Lapor Penipu" : "Report a Scammer"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
