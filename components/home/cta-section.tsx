"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

export function CtaSection() {
  const { t, lang } = useLanguage();

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          {lang === "ms"
            ? "Jumpa Sesuatu Mencurigakan?"
            : "Encountered Something Suspicious?"}
        </h2>
        <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          {lang === "ms"
            ? "Laporan anda boleh membantu orang lain dari menjadi mangsa. Kongsi pengalaman anda untuk melindungi masyarakat."
            : "Your report could help prevent someone else from becoming a victim. Share your experience to protect the community."}
        </p>
        <Button
          asChild
          size="lg"
          variant="secondary"
          className="text-lg px-8"
        >
          <Link href="/submit" className="inline-flex items-center gap-2">
            <span>{t("reportNow")}</span>
            <ArrowRight className="h-5 w-5 flex-shrink-0" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
