"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfidenceIndicator } from "./confidence-indicator";
import type { AnalysisResult } from "@/lib/ai/analyze";
import { DATA_POINT_TYPES } from "@/lib/constants";
import {
  ThumbsUp,
  ThumbsDown,
  Minus,
  Info,
  AlertCircle,
  CheckCircle2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  AlertTriangle,
} from "lucide-react";

interface ResultCardProps {
  result: AnalysisResult;
  reportCount?: number;
  dateRange?: { earliest: string; latest: string };
  verifiedCount?: number;
  disputedCount?: number;
  uniqueReporters?: number;
}

export function ResultCard({ 
  result, 
  reportCount, 
  dateRange,
  verifiedCount = 0,
  disputedCount = 0,
  uniqueReporters = 0,
}: ResultCardProps) {
  const getImpactIcon = (impact: "positive" | "negative" | "neutral") => {
    switch (impact) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-success" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Status */}
      <ConfidenceIndicator
        status={result.status}
        confidence={result.confidence}
      />

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            What We Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{result.summary}</p>

          {/* Report Stats */}
          {reportCount !== undefined && reportCount > 0 && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                <span className="font-medium">What people reported</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Found in <strong>{reportCount}</strong> community {reportCount === 1 ? "report" : "reports"}
                {uniqueReporters >= 2 && (
                  <> from <strong>{uniqueReporters} different people</strong></>
                )}
                {dateRange && (
                  <>
                    {" "}
                    between{" "}
                    <strong>
                      {new Date(dateRange.earliest).toLocaleDateString()}
                    </strong>{" "}
                    and{" "}
                    <strong>
                      {new Date(dateRange.latest).toLocaleDateString()}
                    </strong>
                  </>
                )}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {uniqueReporters >= 2 && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Confirmed by {uniqueReporters} people
                  </Badge>
                )}
                {reportCount === 1 && uniqueReporters <= 1 && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Single report — not yet confirmed by others
                  </Badge>
                )}
                {verifiedCount > 0 && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    {verifiedCount} backed up with proof
                  </Badge>
                )}
                {disputedCount > 0 && (
                  <Badge variant="warning" className="flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" />
                    {disputedCount} challenged
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Matched Fields */}
      {result.matched_fields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What Matched</CardTitle>
            <CardDescription>
              These contact details matched reports we already have
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.matched_fields.map((field) => (
                <Badge key={field} variant="secondary">
                  {DATA_POINT_TYPES[field as keyof typeof DATA_POINT_TYPES] ||
                    field}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Factors */}
      {result.factors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5" />
              Why We Think This
            </CardTitle>
            <CardDescription>
              Things that affected the result
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.factors.map((factor, index) => (
                <li key={index} className="flex items-start gap-3">
                  {getImpactIcon(factor.impact)}
                  <span className="text-sm">{factor.factor}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="p-4 border border-muted rounded-lg bg-muted/30">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Keep in mind</p>
            <p>
              This is based on what people have reported — it's not proof by itself.
              Be careful, and check with your bank or the police if you're unsure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
