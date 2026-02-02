"use client";

import { useState } from "react";
import { Sparkles, Loader2, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { DATA_POINT_TYPES, DataPointType, SCAM_TYPES, ScamType } from "@/lib/constants";

interface ExtractedPoint {
  type: DataPointType;
  value: string;
  confidence: number;
}

interface AnalysisResult {
  dataPoints: ExtractedPoint[];
  scamType: ScamType | null;
  scamTypeConfidence: number;
  platform: string | null;
  amountLost: number | null;
  currency: string;
  summary: string;
  keyDetails: string[];
}

interface SmartReportPasteProps {
  onAnalyzed: (result: {
    dataPoints: { type: DataPointType; value: string }[];
    scamType: ScamType | null;
    platform: string | null;
    amountLost: number | null;
    description: string;
  }) => void;
}

export function SmartReportPaste({ onAnalyzed }: SmartReportPasteProps) {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Please paste your scam experience");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirm = () => {
    if (!result) return;

    onAnalyzed({
      dataPoints: result.dataPoints.map((dp) => ({
        type: dp.type,
        value: dp.value,
      })),
      scamType: result.scamType,
      platform: result.platform,
      amountLost: result.amountLost,
      description: result.summary || text.slice(0, 1000),
    });

    setText("");
    setResult(null);
    setShowResults(false);
  };

  const removeDataPoint = (index: number) => {
    if (!result) return;
    setResult({
      ...result,
      dataPoints: result.dataPoints.filter((_, i) => i !== index),
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "bg-green-100 text-green-800";
    if (confidence >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-orange-100 text-orange-800";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="font-medium">Smart Report</span>
        <Badge variant="secondary" className="text-xs">AI-Powered</Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        Paste your scam experience - the full story, chat messages, or email. 
        AI will extract phone numbers, bank accounts, and suggest the scam type automatically.
      </p>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tell us what happened...

Example:
'I saw a One Piece card listing on Carousell from user @cardmaster. He asked me to pay RM800 to Maybank account 1234567890. After I transferred, he blocked me on WhatsApp 012-345 6789. Never received the cards.'"
        rows={8}
        className="font-mono text-sm"
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="button"
        onClick={handleAnalyze}
        disabled={isAnalyzing || !text.trim()}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing your report...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Analyze & Extract Details
          </>
        )}
      </Button>

      {/* Analysis Results */}
      {showResults && result && (
        <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <span className="font-medium">Analysis Complete</span>
          </div>

          {/* Summary */}
          {result.summary && (
            <div className="p-3 bg-background rounded-md border">
              <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                <MessageSquare className="h-4 w-4" />
                AI Summary
              </div>
              <p className="text-sm text-muted-foreground">{result.summary}</p>
            </div>
          )}

          {/* Detected Scam Type & Platform */}
          <div className="flex flex-wrap gap-2">
            {result.scamType && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Scam Type:</span>
                <Badge variant="outline" className="capitalize">
                  {SCAM_TYPES[result.scamType]}
                </Badge>
                <span className={`text-xs px-1.5 py-0.5 rounded ${getConfidenceColor(result.scamTypeConfidence)}`}>
                  {result.scamTypeConfidence}%
                </span>
              </div>
            )}
            {result.platform && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Platform:</span>
                <Badge variant="secondary">{result.platform}</Badge>
              </div>
            )}
            {result.amountLost && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Amount Lost:</span>
                <Badge variant="destructive">
                  {result.currency} {result.amountLost.toLocaleString()}
                </Badge>
              </div>
            )}
          </div>

          {/* Key Details */}
          {result.keyDetails.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Key Details:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {result.keyDetails.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Data Points */}
          {result.dataPoints.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">
                Extracted Data Points ({result.dataPoints.length}):
              </p>
              <div className="space-y-2">
                {result.dataPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-background rounded-md border"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="capitalize text-xs">
                        {DATA_POINT_TYPES[point.type]}
                      </Badge>
                      <span className="font-mono text-sm">{point.value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${getConfidenceColor(point.confidence)}`}
                      >
                        {point.confidence}%
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDataPoint(index)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button type="button" onClick={handleConfirm} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Use This Information
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowResults(false)}
            >
              Edit Manually
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
