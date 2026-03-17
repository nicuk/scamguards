"use client";

import { useState } from "react";
import { Heart, Shield, Coffee, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

const PRESET_AMOUNTS = [
  { amount: 5, label: "RM5", emoji: "☕", desc: "Buy us a coffee" },
  { amount: 15, label: "RM15", emoji: "🛡️", desc: "Keep the AI running for a day" },
  { amount: 30, label: "RM30", emoji: "💪", desc: "Support a week of protection" },
  { amount: 50, label: "RM50", emoji: "🚀", desc: "Help us reach more Malaysians" },
];

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(15);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { lang } = useLanguage();

  const getAmount = (): number => {
    if (isCustom) return parseFloat(customAmount) || 0;
    return selectedAmount || 0;
  };

  const handleDonate = async () => {
    const amount = getAmount();
    if (amount < 1) {
      setError(lang === "ms" ? "Minimum RM1" : "Minimum RM1");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-500/10 mb-4">
            <Heart className="h-8 w-8 text-pink-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {lang === "ms"
              ? "Sokong ScamGuards"
              : "Support ScamGuards"}
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
              {lang === "ms" ? "Ke mana wang anda pergi" : "Where your money goes"}
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

        {/* Donation amounts */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset.amount}
                  onClick={() => {
                    setSelectedAmount(preset.amount);
                    setIsCustom(false);
                    setError("");
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    !isCustom && selectedAmount === preset.amount
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-2xl mb-1">{preset.emoji}</div>
                  <div className="font-bold text-lg">{preset.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {preset.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="mb-4">
              <button
                onClick={() => {
                  setIsCustom(true);
                  setSelectedAmount(null);
                  setError("");
                }}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                  isCustom
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="text-sm font-medium">
                  {lang === "ms" ? "Jumlah lain" : "Custom amount"}
                </span>
              </button>
              {isCustom && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-lg font-bold">RM</span>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    placeholder="0"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setError("");
                    }}
                    className="flex-1 h-12 px-4 text-lg font-bold rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {error && (
              <p className="text-destructive text-sm mb-4">{error}</p>
            )}

            {/* Donate button */}
            <Button
              onClick={handleDonate}
              disabled={loading || getAmount() < 1}
              className="w-full h-14 text-lg font-semibold"
              size="lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  {lang === "ms" ? "Memproses..." : "Processing..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  {lang === "ms"
                    ? `Sumbang RM${getAmount()}`
                    : `Donate RM${getAmount()}`}
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-3">
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
