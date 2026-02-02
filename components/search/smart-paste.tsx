"use client";

import { useState } from "react";
import { Sparkles, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { DATA_POINT_TYPES, DataPointType } from "@/lib/constants";

interface ExtractedPoint {
  type: DataPointType;
  value: string;
  confidence: number;
}

interface SmartPasteProps {
  onExtracted: (dataPoints: { type: DataPointType; value: string }[]) => void;
  onScamTypeDetected?: (scamType: string) => void;
}

export function SmartPaste({ onExtracted, onScamTypeDetected }: SmartPasteProps) {
  const [text, setText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedPoints, setExtractedPoints] = useState<ExtractedPoint[]>([]);
  const [suggestedScamType, setSuggestedScamType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleExtract = async () => {
    if (!text.trim()) {
      setError("Please paste some text to analyze");
      return;
    }

    setIsExtracting(true);
    setError(null);
    setExtractedPoints([]);
    setSuggestedScamType(null);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Extraction failed");
      }

      setExtractedPoints(data.dataPoints || []);
      setSuggestedScamType(data.suggestedScamType || null);
      setShowResults(true);

      if (data.suggestedScamType && onScamTypeDetected) {
        onScamTypeDetected(data.suggestedScamType);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract data");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleConfirm = () => {
    const points = extractedPoints.map((ep) => ({
      type: ep.type,
      value: ep.value,
    }));
    onExtracted(points);
    setText("");
    setExtractedPoints([]);
    setShowResults(false);
  };

  const removePoint = (index: number) => {
    setExtractedPoints((prev) => prev.filter((_, i) => i !== index));
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
        <span className="font-medium">Smart Paste</span>
        <Badge variant="secondary" className="text-xs">AI-Powered</Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        Paste a scam message, WhatsApp conversation, or any text. AI will automatically
        extract phone numbers, emails, bank accounts, and other details.
      </p>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste the scam message here...

Example:
'Hello, I am selling One Piece cards. Please transfer RM500 to my Maybank account 1234567890. Contact me at 012-345 6789 or email me at seller@email.com'"
        rows={6}
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
        onClick={handleExtract}
        disabled={isExtracting || !text.trim()}
        className="w-full"
      >
        {isExtracting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing with AI...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Extract Data Points
          </>
        )}
      </Button>

      {/* Results */}
      {showResults && (
        <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <span className="font-medium">
              Found {extractedPoints.length} data point(s)
            </span>
          </div>

          {suggestedScamType && (
            <div className="text-sm">
              <span className="text-muted-foreground">Detected scam type: </span>
              <Badge variant="outline">{suggestedScamType.replace(/_/g, " ")}</Badge>
            </div>
          )}

          {extractedPoints.length > 0 ? (
            <>
              <div className="space-y-2">
                {extractedPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-background rounded-md border"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="capitalize">
                        {DATA_POINT_TYPES[point.type]}
                      </Badge>
                      <span className="font-mono text-sm">{point.value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${getConfidenceColor(
                          point.confidence
                        )}`}
                      >
                        {point.confidence}%
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePoint(index)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button type="button" onClick={handleConfirm} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Use These Data Points
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowResults(false)}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No data points found. Try pasting more detailed text or enter manually below.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
