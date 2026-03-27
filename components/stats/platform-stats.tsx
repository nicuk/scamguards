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
            className="bg-muted/50 rounded-lg p-4 animate-pulse h-24"
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
      color: "text-primary",
    },
    {
      label: "Numbers & Accounts Flagged",
      value: stats.totalDataPoints.toLocaleString(),
      icon: Database,
      color: "text-primary",
      sublabel: "phones, emails, bank accounts",
    },
    {
      label: "Lost to Scams",
      value: stats.totalAmountLost > 0 ? formatMoney(stats.totalAmountLost) : "RM0",
      icon: AlertTriangle,
      color: "text-destructive",
      sublabel: "reported by victims",
    },
    {
      label: "Checks Run",
      value: stats.totalSearches.toLocaleString(),
      icon: Search,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="bg-muted/50 rounded-lg p-4 text-center"
          >
            <item.icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-sm text-muted-foreground">{item.label}</p>
            {item.sublabel && (
              <p className="text-xs text-muted-foreground">{item.sublabel}</p>
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
