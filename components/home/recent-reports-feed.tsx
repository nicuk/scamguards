"use client";

import { useEffect, useState } from "react";
import {
  Phone, Mail, CreditCard, MessageCircle, Globe, AlertTriangle,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface RecentReport {
  id: string;
  scamType: string;
  createdAt: string;
  dataPointType: string | null;
  maskedValue: string | null;
}

const SCAM_TYPE_SHORT: Record<string, { en: string; ms: string }> = {
  collectibles_scam: { en: "Collectibles scam", ms: "Penipuan koleksi" },
  precious_metals_scam: { en: "Gold/silver scam", ms: "Penipuan emas/perak" },
  ecommerce_scam: { en: "E-commerce scam", ms: "Penipuan e-dagang" },
  macau_scam: { en: "Phone scam", ms: "Macau scam" },
  love_scam: { en: "Love scam", ms: "Love scam" },
  investment_scam: { en: "Investment scam", ms: "Penipuan pelaburan" },
  parcel_scam: { en: "Parcel scam", ms: "Penipuan bungkusan" },
  job_scam: { en: "Job scam", ms: "Penipuan kerja" },
  loan_scam: { en: "Loan scam", ms: "Penipuan pinjaman" },
  mule_recruitment: { en: "Money mule", ms: "Keldai wang" },
  phishing: { en: "Phishing", ms: "Phishing" },
  other: { en: "Scam reported", ms: "Penipuan dilaporkan" },
};

const DP_ICONS: Record<string, typeof Phone> = {
  phone: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  bank_account: CreditCard,
  website: Globe,
};

function timeAgo(dateStr: string, lang: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (lang === "ms") {
    if (mins < 1) return "baru sahaja";
    if (mins < 60) return `${mins} minit lalu`;
    if (hrs < 24) return `${hrs} jam lalu`;
    if (days === 1) return "semalam";
    return `${days} hari lalu`;
  }

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

export function RecentReportsFeed() {
  const [reports, setReports] = useState<RecentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    fetch("/api/recent-reports")
      .then((r) => r.json())
      .then((d) => setReports(d.reports || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || reports.length === 0) return null;

  return (
    <section className="py-6 bg-muted/30 border-b overflow-hidden">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          {lang === "ms" ? "Laporan terkini" : "Recent reports"}
        </p>

        <div className="relative">
          <div className="flex animate-marquee gap-6">
            {[...reports, ...reports].map((r, i) => {
              const Icon = (r.dataPointType && DP_ICONS[r.dataPointType]) || AlertTriangle;
              const label = SCAM_TYPE_SHORT[r.scamType]?.[lang] ||
                SCAM_TYPE_SHORT.other[lang];

              return (
                <div
                  key={`${r.id}-${i}`}
                  className="flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-border/50 text-sm whitespace-nowrap flex-shrink-0"
                >
                  <Icon className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
                  <span className="font-medium">{label}</span>
                  {r.maskedValue && (
                    <span className="text-muted-foreground font-mono text-xs">
                      {r.maskedValue}
                    </span>
                  )}
                  <span className="text-muted-foreground/60 text-xs">
                    {timeAgo(r.createdAt, lang)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
