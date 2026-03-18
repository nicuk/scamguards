"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  ClipboardPaste,
  Sparkles,
  CheckCircle,
  FileText,
  Brain,
  Users,
  Search,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

type Path = "victim" | "buyer";

const pathConfig = {
  victim: {
    en: {
      tab: "I Got Scammed",
      headline: "Already a victim? Make sure there isn\u2019t another.",
      description:
        "Your report takes 2 minutes and could save the next person thousands.",
      steps: [
        {
          icon: FileText,
          title: "Tell Your Story",
          desc: "Paste the scammer\u2019s phone number, bank account, email — or just paste the whole conversation. Our AI extracts the details.",
        },
        {
          icon: Brain,
          title: "AI Processes",
          desc: "Our AI identifies key identifiers, matches patterns, and adds your report to our growing database.",
        },
        {
          icon: Users,
          title: "Protect Others",
          desc: "The next person who checks that number or account will see the warning. You just saved them.",
        },
      ],
      cta: "Report a Scammer",
      ctaLink: "/submit",
    },
    ms: {
      tab: "Saya Kena Tipu",
      headline: "Sudah jadi mangsa? Pastikan tiada mangsa seterusnya.",
      description:
        "Laporan anda ambil 2 minit dan boleh selamatkan orang lain ribuan ringgit.",
      steps: [
        {
          icon: FileText,
          title: "Kongsi Kisah Anda",
          desc: "Tampal nombor telefon, akaun bank, emel penipu — atau tampal sahaja perbualan. AI kami akan keluarkan butiran penting.",
        },
        {
          icon: Brain,
          title: "AI Proses",
          desc: "AI kami kenal pasti maklumat penting, padankan corak, dan tambah laporan anda ke pangkalan data kami.",
        },
        {
          icon: Users,
          title: "Lindungi Orang Lain",
          desc: "Orang seterusnya yang semak nombor atau akaun itu akan nampak amaran. Anda baru sahaja selamatkan mereka.",
        },
      ],
      cta: "Lapor Penipu",
      ctaLink: "/submit",
    },
  },
  buyer: {
    en: {
      tab: "I\u2019m About to Deal",
      headline: "About to buy or transfer? Check here first.",
      description:
        "It takes 10 seconds to check. It\u2019s free. Don\u2019t learn the hard way.",
      steps: [
        {
          icon: ClipboardPaste,
          title: "Copy & Paste",
          desc: "Grab the seller\u2019s phone number, bank account, or email. Paste it into ScamGuards.",
        },
        {
          icon: Sparkles,
          title: "AI Scans Instantly",
          desc: "Our AI searches thousands of community reports and analyzes patterns in seconds.",
        },
        {
          icon: CheckCircle,
          title: "Decide Safely",
          desc: "See a clear risk level — suspicious, unknown, or clear — with a confidence score before you pay.",
        },
      ],
      cta: "Check Now (Free)",
      ctaLink: "/search",
    },
    ms: {
      tab: "Saya Nak Beli",
      headline: "Nak beli atau transfer? Semak di sini dulu.",
      description:
        "Ambil 10 saat untuk semak. Percuma. Jangan belajar dengan cara yang susah.",
      steps: [
        {
          icon: ClipboardPaste,
          title: "Salin & Tampal",
          desc: "Ambil nombor telefon, akaun bank, atau emel penjual. Tampal ke ScamGuards.",
        },
        {
          icon: Sparkles,
          title: "AI Imbas Serta-Merta",
          desc: "AI kami cari ribuan laporan komuniti dan analisis corak dalam beberapa saat.",
        },
        {
          icon: CheckCircle,
          title: "Buat Keputusan Selamat",
          desc: "Lihat tahap risiko yang jelas — mencurigakan, tidak diketahui, atau selamat — dengan skor keyakinan sebelum anda bayar.",
        },
      ],
      cta: "Semak Sekarang (Percuma)",
      ctaLink: "/search",
    },
  },
};

const accentColors: Record<Path, { border: string; bg: string; badge: string; icon: string }> = {
  victim: {
    border: "border-red-500/30",
    bg: "bg-red-500/5",
    badge: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    icon: "text-red-500",
  },
  buyer: {
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: "text-blue-500",
  },
};

export function HowItWorksSection() {
  const [activePath, setActivePath] = useState<Path>("buyer");
  const { lang } = useLanguage();

  const config = pathConfig[activePath][lang];
  const colors = accentColors[activePath];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {lang === "ms" ? "Cara Ia Berfungsi" : "How It Works"}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {lang === "ms"
              ? "Pilih situasi anda. Kami tunjukkan apa yang perlu buat."
              : "Pick your situation. We\u2019ll show you what to do."}
          </p>
        </div>

        {/* Path selector — big obvious cards */}
        <p className="text-center text-sm font-medium text-muted-foreground mb-3">
          {lang === "ms" ? "👇 Pilih satu:" : "👇 Choose one:"}
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
          <button
            onClick={() => setActivePath("victim")}
            className={`relative flex flex-col items-center text-center p-5 rounded-2xl transition-all border-2 cursor-pointer ${
              activePath === "victim"
                ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/10 scale-[1.02]"
                : "border-border bg-background hover:border-red-500/40 hover:bg-red-500/5"
            }`}
          >
            {activePath === "victim" && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            )}
            <ShieldAlert className={`h-8 w-8 mb-2 ${activePath === "victim" ? "text-red-500" : "text-muted-foreground"}`} />
            <span className={`font-bold text-base ${activePath === "victim" ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
              {pathConfig.victim[lang].tab}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {lang === "ms" ? "Saya kena tipu" : "I already lost money"}
            </span>
          </button>
          <button
            onClick={() => setActivePath("buyer")}
            className={`relative flex flex-col items-center text-center p-5 rounded-2xl transition-all border-2 cursor-pointer ${
              activePath === "buyer"
                ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10 scale-[1.02]"
                : "border-border bg-background hover:border-blue-500/40 hover:bg-blue-500/5"
            }`}
          >
            {activePath === "buyer" && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            )}
            <ShieldCheck className={`h-8 w-8 mb-2 ${activePath === "buyer" ? "text-blue-500" : "text-muted-foreground"}`} />
            <span className={`font-bold text-base ${activePath === "buyer" ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>
              {pathConfig.buyer[lang].tab}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {lang === "ms" ? "Nak beli / transfer" : "I want to check first"}
            </span>
          </button>
        </div>

        {/* Headline for selected path */}
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold mb-2">{config.headline}</h3>
          <p className="text-muted-foreground">{config.description}</p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
          {config.steps.map((step, i) => {
            const StepIcon = step.icon;
            const isMiddle = i === 1;
            return (
              <Card
                key={i}
                className={`relative transition-all ${
                  isMiddle
                    ? `border-2 ${colors.border} ${colors.bg}`
                    : ""
                }`}
              >
                <div
                  className={`absolute -top-4 left-6 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    isMiddle
                      ? `${
                          activePath === "victim"
                            ? "bg-gradient-to-r from-red-500 to-orange-500"
                            : "bg-gradient-to-r from-blue-500 to-purple-500"
                        } text-white`
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <StepIcon
                      className={`h-5 w-5 ${isMiddle ? colors.icon : "text-primary"}`}
                    />
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={config.ctaLink}
            className={`inline-flex items-center justify-center gap-2 h-12 px-8 text-base font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105 ${
              activePath === "victim"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            <Search className="h-4 w-4" />
            {config.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
