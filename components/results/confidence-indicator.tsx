"use client";

import { cn } from "@/lib/utils";
import type { ResultStatus } from "@/lib/constants";
import { AlertTriangle, HelpCircle, CheckCircle } from "lucide-react";

interface ConfidenceIndicatorProps {
  status: ResultStatus;
  confidence: number;
  className?: string;
}

export function ConfidenceIndicator({
  status,
  confidence,
  className,
}: ConfidenceIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "suspicious":
        return {
          icon: AlertTriangle,
          label: "Suspicious",
          bgColor: "bg-destructive/10",
          textColor: "text-destructive",
          borderColor: "border-destructive/30",
          progressColor: "bg-destructive",
        };
      case "no_known_info":
        return {
          icon: HelpCircle,
          label: "No Known Information",
          bgColor: "bg-muted",
          textColor: "text-muted-foreground",
          borderColor: "border-muted-foreground/30",
          progressColor: "bg-muted-foreground",
        };
      case "clear":
        return {
          icon: CheckCircle,
          label: "Clear",
          bgColor: "bg-success/10",
          textColor: "text-success",
          borderColor: "border-success/30",
          progressColor: "bg-success",
        };
      default:
        return {
          icon: HelpCircle,
          label: "Unknown",
          bgColor: "bg-muted",
          textColor: "text-muted-foreground",
          borderColor: "border-muted-foreground/30",
          progressColor: "bg-muted-foreground",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-lg border p-6",
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center",
            config.bgColor
          )}
        >
          <Icon className={cn("h-8 w-8", config.textColor)} />
        </div>
        <div>
          <h2 className={cn("text-2xl font-bold", config.textColor)}>
            {config.label}
          </h2>
          <p className="text-sm text-muted-foreground">
            Confidence: {confidence}%
          </p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="w-full bg-background rounded-full h-3 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", config.progressColor)}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
}
