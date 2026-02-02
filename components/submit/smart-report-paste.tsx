"use client";

import { useState } from "react";
import { Sparkles, Loader2, CheckCircle, AlertCircle, MessageSquare, Users, User, ChevronDown, ChevronUp } from "lucide-react";
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

interface ScammerEntry {
  id: string;
  primaryIdentifier: string;
  dataPoints: ExtractedPoint[];
  scamType: ScamType | null;
  scamTypeConfidence: number;
  platform: string | null;
  amountLost: number | null;
  currency: string;
  summary: string;
  selected: boolean;
}

interface AnalysisResult {
  isMultiple: boolean;
  scammers: ScammerEntry[];
  // Legacy single-scammer fields
  dataPoints?: ExtractedPoint[];
  scamType?: ScamType | null;
  scamTypeConfidence?: number;
  platform?: string | null;
  amountLost?: number | null;
  currency?: string;
  summary?: string;
  keyDetails?: string[];
}

interface SmartReportPasteProps {
  onAnalyzed: (result: {
    dataPoints: { type: DataPointType; value: string }[];
    scamType: ScamType | null;
    platform: string | null;
    amountLost: number | null;
    description: string;
  }) => void;
  onBatchAnalyzed?: (scammers: ScammerEntry[]) => void;
}

export function SmartReportPaste({ onAnalyzed, onBatchAnalyzed }: SmartReportPasteProps) {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [expandedScammer, setExpandedScammer] = useState<string | null>(null);

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
        body: JSON.stringify({ text, detectMultiple: true }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);
      setShowResults(true);
      
      // Auto-expand first scammer if multiple detected
      if (data.isMultiple && data.scammers?.length > 0) {
        setExpandedScammer(data.scammers[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleScammerSelection = (id: string) => {
    if (!result) return;
    setResult({
      ...result,
      scammers: result.scammers.map(s =>
        s.id === id ? { ...s, selected: !s.selected } : s
      ),
    });
  };

  const removeDataPoint = (scammerId: string, pointIndex: number) => {
    if (!result) return;
    setResult({
      ...result,
      scammers: result.scammers.map(s =>
        s.id === scammerId
          ? { ...s, dataPoints: s.dataPoints.filter((_, i) => i !== pointIndex) }
          : s
      ),
    });
  };

  // Handle single scammer confirmation (legacy flow)
  const handleSingleConfirm = () => {
    if (!result || !result.scammers?.[0]) return;
    const scammer = result.scammers[0];

    onAnalyzed({
      dataPoints: scammer.dataPoints.map(dp => ({ type: dp.type, value: dp.value })),
      scamType: scammer.scamType,
      platform: scammer.platform,
      amountLost: scammer.amountLost,
      description: scammer.summary || text.slice(0, 1000),
    });

    resetForm();
  };

  // Handle batch confirmation (multiple scammers)
  const handleBatchConfirm = () => {
    if (!result) return;
    const selectedScammers = result.scammers.filter(s => s.selected);
    
    if (selectedScammers.length === 0) {
      setError("Please select at least one scammer to report");
      return;
    }

    if (onBatchAnalyzed) {
      onBatchAnalyzed(selectedScammers);
    } else {
      // Fallback: submit first selected scammer
      const first = selectedScammers[0];
      onAnalyzed({
        dataPoints: first.dataPoints.map(dp => ({ type: dp.type, value: dp.value })),
        scamType: first.scamType,
        platform: first.platform,
        amountLost: first.amountLost,
        description: first.summary || text.slice(0, 1000),
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setText("");
    setResult(null);
    setShowResults(false);
    setExpandedScammer(null);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "bg-green-100 text-green-800";
    if (confidence >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-orange-100 text-orange-800";
  };

  const selectedCount = result?.scammers?.filter(s => s.selected).length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="font-medium">Smart Report</span>
        <Badge variant="secondary" className="text-xs">AI-Powered</Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        Paste your scam experience - the full story, chat messages, or a list of scammers.
        AI will extract details and detect multiple scammers automatically.
      </p>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tell us what happened...

Single scammer example:
'I saw a One Piece card listing on Carousell from user @cardmaster. He asked me to pay RM800 to Maybank account 1234567890. After I transferred, he blocked me.'

Or paste a list of scammers:
'Melvin Chan - Telegram @melvin12 - Fake TCG listings
Nicky Chau - Facebook - Never delivers Pokemon cards
Yee Rong - Carousell - Labubu scam'"
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Analysis Complete</span>
            </div>
            {result.isMultiple && (
              <Badge className="bg-blue-100 text-blue-800">
                <Users className="h-3 w-3 mr-1" />
                {result.scammers.length} Scammers Detected
              </Badge>
            )}
          </div>

          {/* Multiple Scammers View */}
          {result.isMultiple ? (
            <div className="space-y-3">
              <Alert className="bg-blue-50 border-blue-200">
                <Users className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  We detected <strong>{result.scammers.length} different scammers</strong> in your submission.
                  Please review each one and select which to report.
                </AlertDescription>
              </Alert>

              {/* Scammer Cards */}
              {result.scammers.map((scammer) => (
                <div
                  key={scammer.id}
                  className={`border rounded-lg overflow-hidden transition-all ${
                    scammer.selected ? "border-primary bg-primary/5" : "border-muted bg-background"
                  }`}
                >
                  {/* Scammer Header */}
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => setExpandedScammer(expandedScammer === scammer.id ? null : scammer.id)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={scammer.selected}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleScammerSelection(scammer.id);
                        }}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{scammer.primaryIdentifier}</span>
                      <Badge variant="outline" className="text-xs">
                        {scammer.dataPoints.length} data points
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {scammer.scamType && (
                        <Badge variant="secondary" className="text-xs">
                          {SCAM_TYPES[scammer.scamType]?.split(" ")[0] || scammer.scamType}
                        </Badge>
                      )}
                      {expandedScammer === scammer.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedScammer === scammer.id && (
                    <div className="p-3 border-t bg-background space-y-3">
                      {/* Summary */}
                      {scammer.summary && (
                        <p className="text-sm text-muted-foreground">{scammer.summary}</p>
                      )}

                      {/* Platform & Scam Type */}
                      <div className="flex flex-wrap gap-2">
                        {scammer.platform && (
                          <Badge variant="outline">Platform: {scammer.platform}</Badge>
                        )}
                        {scammer.scamType && (
                          <Badge variant="outline">
                            {SCAM_TYPES[scammer.scamType]}
                            <span className={`ml-1 text-xs px-1 rounded ${getConfidenceColor(scammer.scamTypeConfidence)}`}>
                              {scammer.scamTypeConfidence}%
                            </span>
                          </Badge>
                        )}
                        {scammer.amountLost && (
                          <Badge variant="destructive">
                            Lost: {scammer.currency} {scammer.amountLost.toLocaleString()}
                          </Badge>
                        )}
                      </div>

                      {/* Data Points */}
                      <div className="space-y-1">
                        {scammer.dataPoints.map((point, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {DATA_POINT_TYPES[point.type]}
                              </Badge>
                              <span className="font-mono">{point.value}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`text-xs px-1.5 py-0.5 rounded ${getConfidenceColor(point.confidence)}`}>
                                {point.confidence}%
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeDataPoint(scammer.id, index);
                                }}
                                className="text-muted-foreground hover:text-destructive ml-1"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Batch Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  onClick={handleBatchConfirm}
                  className="flex-1"
                  disabled={selectedCount === 0}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit {selectedCount} Report{selectedCount !== 1 ? "s" : ""}
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
          ) : (
            /* Single Scammer View (Legacy) */
            <div className="space-y-4">
              {result.scammers?.[0] && (
                <>
                  {/* Summary */}
                  {result.scammers[0].summary && (
                    <div className="p-3 bg-background rounded-md border">
                      <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                        <MessageSquare className="h-4 w-4" />
                        AI Summary
                      </div>
                      <p className="text-sm text-muted-foreground">{result.scammers[0].summary}</p>
                    </div>
                  )}

                  {/* Detected Scam Type & Platform */}
                  <div className="flex flex-wrap gap-2">
                    {result.scammers[0].scamType && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Scam Type:</span>
                        <Badge variant="outline">
                          {SCAM_TYPES[result.scammers[0].scamType]}
                        </Badge>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${getConfidenceColor(result.scammers[0].scamTypeConfidence)}`}>
                          {result.scammers[0].scamTypeConfidence}%
                        </span>
                      </div>
                    )}
                    {result.scammers[0].platform && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Platform:</span>
                        <Badge variant="secondary">{result.scammers[0].platform}</Badge>
                      </div>
                    )}
                    {result.scammers[0].amountLost && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Amount Lost:</span>
                        <Badge variant="destructive">
                          {result.scammers[0].currency} {result.scammers[0].amountLost.toLocaleString()}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Data Points */}
                  {result.scammers[0].dataPoints.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Extracted Data Points ({result.scammers[0].dataPoints.length}):
                      </p>
                      <div className="space-y-2">
                        {result.scammers[0].dataPoints.map((point, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-background rounded-md border"
                          >
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary" className="text-xs">
                                {DATA_POINT_TYPES[point.type]}
                              </Badge>
                              <span className="font-mono text-sm">{point.value}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded ${getConfidenceColor(point.confidence)}`}>
                                {point.confidence}%
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDataPoint(result.scammers[0].id, index)}
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
                </>
              )}

              {/* Single Actions */}
              <div className="flex gap-2 pt-2">
                <Button type="button" onClick={handleSingleConfirm} className="flex-1">
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
      )}
    </div>
  );
}
