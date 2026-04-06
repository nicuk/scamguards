"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Search, AlertTriangle, Database, ArrowRight } from "lucide-react";

interface Stats {
  totalReports: number;
  verifiedReports: number;
  totalSearches: number;
  totalAmountLost: number;
  totalDataPoints: number;
}

function formatMoney(amount: number): string {
  if (amount >= 1_000_000) return `RM${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `RM${(amount / 1_000).toFixed(1)}K`;
  return `RM${amount.toLocaleString()}`;
}

export function PlatformStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl p-5 animate-pulse h-28 bg-muted/50"
          />
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statItems = [
    {
      label: "Scammers Reported",
      value: stats.totalReports.toLocaleString(),
      icon: FileText,
      iconColor: "text-primary",
      accent: "border-l-primary",
    },
    {
      label: "Numbers & Accounts Flagged",
      value: stats.totalDataPoints.toLocaleString(),
      icon: Database,
      iconColor: "text-blue-500",
      accent: "border-l-blue-500",
      sublabel: "phones, emails, bank accounts",
    },
    {
      label: "Lost to Scams",
      value: stats.totalAmountLost > 0 ? formatMoney(stats.totalAmountLost) : "RM0",
      icon: AlertTriangle,
      iconColor: "text-destructive",
      accent: "border-l-destructive",
      sublabel: "reported by victims",
    },
    {
      label: "Checks Run",
      value: stats.totalSearches.toLocaleString(),
      icon: Search,
      iconColor: "text-emerald-500",
      accent: "border-l-emerald-500",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className={`rounded-xl p-5 bg-card border border-border/50 border-l-4 ${item.accent} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`h-5 w-5 ${item.iconColor}`} />
              <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
            </div>
            <p className="text-3xl font-bold tracking-tight">{item.value}</p>
            {item.sublabel && (
              <p className="text-xs text-muted-foreground mt-1">{item.sublabel}</p>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Every report helps protect someone else.{" "}
        <Link href="/submit" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
          Report a scammer <ArrowRight className="h-3 w-3" />
        </Link>
      </p>
    </div>
  );
}
