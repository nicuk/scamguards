"use client";

import { Heart, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

const STRIPE_PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_DONATE_LINK || "";

export default function DonatePage() {
  const { lang } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-500/10 mb-4">
            <Heart className="h-8 w-8 text-pink-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {lang === "ms" ? "Sokong ScamGuards" : "Support ScamGuards"}
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            {lang === "ms"
              ? "ScamGuards 100% percuma untuk semua orang. Sumbangan anda bantu kami terus melindungi rakyat Malaysia dari penipu."
              : "ScamGuards is 100% free for everyone. Your donation helps us keep protecting Malaysians from scammers."}
          </p>
        </div>

        {/* Where money goes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {lang === "ms"
                ? "Ke mana wang anda pergi"
                : "Where your money goes"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                {lang === "ms"
                  ? "Kos AI & pelayan untuk menjalankan platform"
                  : "AI & server costs to keep the platform running"}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                {lang === "ms"
                  ? "Domain & hosting untuk scamguards.app"
                  : "Domain & hosting for scamguards.app"}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full" />
                {lang === "ms"
                  ? "Pembangunan ciri baru untuk lindungi lebih ramai orang"
                  : "Development of new features to protect more people"}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full" />
                {lang === "ms"
                  ? "Tiada gaji — ini projek peribadi dari hati"
                  : "No salaries — this is a passion project from the heart"}
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Donate button */}
        <Card className="mb-6">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-6">
              {lang === "ms"
                ? "Pilih apa-apa jumlah yang anda selesa. Minimum RM5."
                : "Choose any amount you're comfortable with. Minimum RM5."}
            </p>

            {STRIPE_PAYMENT_LINK ? (
              <Button asChild size="lg" className="w-full h-14 text-lg font-semibold">
                <a
                  href={STRIPE_PAYMENT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Heart className="h-5 w-5" />
                  {lang === "ms" ? "Sumbang Sekarang" : "Donate Now"}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-8">
                <p className="text-muted-foreground text-sm">
                  {lang === "ms"
                    ? "Sumbangan akan diaktifkan tidak lama lagi. Terima kasih atas minat anda!"
                    : "Donations will be enabled soon. Thank you for your interest!"}
                </p>
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-4">
              {lang === "ms"
                ? "Pembayaran selamat melalui Stripe. Kami tidak menyimpan maklumat kad anda."
                : "Secure payment via Stripe. We never store your card details."}
            </p>
          </CardContent>
        </Card>

        {/* Personal note */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            {lang === "ms"
              ? "Terima kasih. Setiap ringgit membantu kami terus melindungi komuniti. 🙏"
              : "Thank you. Every ringgit helps us keep protecting the community. 🙏"}
          </p>
        </div>
      </div>
    </div>
  );
}
