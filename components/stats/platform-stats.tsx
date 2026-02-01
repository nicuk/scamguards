"use client";

import { useEffect, useState } from "react";
import { FileText, Search, ShieldCheck, TrendingUp } from "lucide-react";

interface Stats {
  totalReports: number;
  verifiedReports: number;
  totalSearches: number;
  totalAmountLost: number;
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
      label: "Reports",
      value: stats.totalReports,
      icon: FileText,
      format: (n: number) => n.toLocaleString(),
    },
    {
      label: "Verified",
      value: stats.verifiedReports,
      icon: ShieldCheck,
      format: (n: number) => n.toLocaleString(),
    },
    {
      label: "Searches",
      value: stats.totalSearches,
      icon: Search,
      format: (n: number) => n.toLocaleString(),
    },
    {
      label: "Protected",
      value: stats.totalSearches > 0 ? Math.floor(stats.totalSearches * 0.7) : 0,
      icon: TrendingUp,
      format: (n: number) => `${n.toLocaleString()}+`,
      sublabel: "potential victims",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="bg-muted/50 rounded-lg p-4 text-center"
        >
          <item.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">{item.format(item.value)}</p>
          <p className="text-sm text-muted-foreground">{item.label}</p>
          {item.sublabel && (
            <p className="text-xs text-muted-foreground">{item.sublabel}</p>
          )}
        </div>
      ))}
    </div>
  );
}
