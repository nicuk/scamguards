"use client";

import { MessageCircleWarning, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export function FounderStorySection() {
  const { lang } = useLanguage();

  return (
    <section className="py-20 bg-muted/20 border-y">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Section label */}
          <div className="flex items-center gap-2 text-sm font-medium text-primary mb-6">
            <MessageCircleWarning className="h-4 w-4" />
            {lang === "ms" ? "Kisah Sebenar" : "A Real Story"}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            {lang === "ms"
              ? "Kenapa Saya Bina ScamGuards"
              : "Why I Built ScamGuards"}
          </h2>

          {/* The story */}
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              {lang === "ms" ? (
                <>
                  Saya kena tipu. Saya beli dalam grup WhatsApp bernama{" "}
                  <span className="font-semibold text-foreground">&quot;COZ on One Piece&quot;</span>{" "}
                  — satu komuniti untuk peminat kad One Piece TCG. Saya fikir
                  grup itu selamat sebab mereka kata penipu telah ditapis.{" "}
                  <span className="font-semibold text-foreground">Rupanya tidak.</span>
                </>
              ) : (
                <>
                  I got scammed. I was buying in a WhatsApp group called{" "}
                  <span className="font-semibold text-foreground">&quot;COZ on One Piece&quot;</span>{" "}
                  — a community for One Piece TCG card collectors. I thought the
                  group was safe because they claimed to filter out scammers.{" "}
                  <span className="font-semibold text-foreground">Turns out, they don&apos;t.</span>
                </>
              )}
            </p>

            <p>
              {lang === "ms"
                ? "Saya bayar. Barang tak sampai. Penjual hilang. Dan tiada siapa dalam grup yang boleh membantu."
                : "I paid. Nothing arrived. The seller vanished. And nobody in the group could help."}
            </p>

            <p className="text-foreground font-medium">
              {lang === "ms"
                ? "Jadi saya bina ScamGuards — supaya orang lain tak perlu belajar dengan cara yang sama."
                : "So I built ScamGuards — so no one else has to learn the hard way."}
            </p>
          </div>

          {/* Closing tagline */}
          <div className="mt-8 pt-8 border-t border-border/50">
            <p className="text-muted-foreground mb-4">
              {lang === "ms"
                ? "Hanya perlu 10 saat untuk semak. Ia percuma. Dan ia mungkin menyelamatkan wang anda."
                : "It takes 10 seconds to check. It's free. And it might just save your money."}
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              {lang === "ms" ? "Semak sekarang" : "Check someone now"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
