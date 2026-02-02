"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Loader2,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  List,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  DataPointInput,
  type DataPointEntry,
} from "@/components/search/data-point-input";
import { EvidenceUpload } from "@/components/submit/evidence-upload";
import { SmartReportPaste } from "@/components/submit/smart-report-paste";
import { SCAM_TYPES, PLATFORMS, ScamType, DataPointType } from "@/lib/constants";

type InputMode = "smart" | "manual";

interface ScammerEntry {
  id: string;
  primaryIdentifier: string;
  dataPoints: { type: DataPointType; value: string; confidence: number }[];
  scamType: ScamType | null;
  scamTypeConfidence: number;
  platform: string | null;
  amountLost: number | null;
  currency: string;
  summary: string;
  selected: boolean;
}

export default function SubmitPage() {
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>("smart");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batchSubmitCount, setBatchSubmitCount] = useState(0);
  const [duplicateInfo, setDuplicateInfo] = useState<{
    hasExistingReports: boolean;
    totalPreviousReports: number;
    confidenceScore: number;
    heatLevel: string;
    message: string;
  } | null>(null);

  const [scamType, setScamType] = useState("");
  const [platform, setPlatform] = useState("");
  const [description, setDescription] = useState("");
  const [amountLost, setAmountLost] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [dataPoints, setDataPoints] = useState<DataPointEntry[]>([
    { id: crypto.randomUUID(), type: "phone", value: "" },
  ]);
  const [confirmed, setConfirmed] = useState(false);

  const scamTypeOptions = Object.entries(SCAM_TYPES).map(([value, label]) => ({
    value,
    label,
  }));

  const platformOptions = PLATFORMS.map((p) => ({ value: p, label: p }));

  // Handle AI-analyzed report data (single scammer)
  const handleAnalyzedReport = (result: {
    dataPoints: { type: DataPointType; value: string }[];
    scamType: ScamType | null;
    platform: string | null;
    amountLost: number | null;
    description: string;
  }) => {
    // Set data points
    if (result.dataPoints.length > 0) {
      setDataPoints(
        result.dataPoints.map((dp) => ({
          id: crypto.randomUUID(),
          type: dp.type,
          value: dp.value,
        }))
      );
    }

    // Set scam type
    if (result.scamType) {
      setScamType(result.scamType);
    }

    // Set platform
    if (result.platform) {
      setPlatform(result.platform);
    }

    // Set amount lost
    if (result.amountLost) {
      setAmountLost(result.amountLost.toString());
    }

    // Set description
    if (result.description) {
      setDescription(result.description);
    }

    // Switch to manual mode to show/edit the filled form
    setMode("manual");
    setError(null);
  };

  // Handle batch submission (multiple scammers)
  const handleBatchSubmit = async (scammers: ScammerEntry[]) => {
    setIsLoading(true);
    setError(null);
    let successCount = 0;
    const errors: string[] = [];

    for (const scammer of scammers) {
      try {
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scamType: scammer.scamType || "other",
            platform: scammer.platform || null,
            description: scammer.summary || `Scam report for ${scammer.primaryIdentifier}`,
            amountLost: scammer.amountLost,
            dataPoints: scammer.dataPoints.map((dp) => ({
              type: dp.type,
              value: dp.value,
            })),
          }),
        });

        if (response.ok) {
          successCount++;
        } else {
          const data = await response.json();
          errors.push(`${scammer.primaryIdentifier}: ${data.error || "Failed"}`);
        }
      } catch (err) {
        errors.push(`${scammer.primaryIdentifier}: Network error`);
      }
    }

    setIsLoading(false);

    if (successCount > 0) {
      setBatchSubmitCount(successCount);
      setIsSubmitted(true);
    }

    if (errors.length > 0 && successCount < scammers.length) {
      setError(`${successCount} submitted, ${errors.length} failed: ${errors.slice(0, 2).join(", ")}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!scamType) {
      setError("Please select a scam type");
      return;
    }

    const validPoints = dataPoints.filter((dp) => dp.value.trim());
    if (validPoints.length === 0) {
      setError("Please provide at least one data point");
      return;
    }

    if (!confirmed) {
      setError("Please confirm that the information is accurate");
      return;
    }

    setIsLoading(true);

    try {
      // Use FormData if there's a file, otherwise use JSON
      if (evidenceFile) {
        const formData = new FormData();
        formData.append("scamType", scamType);
        formData.append("platform", platform || "");
        formData.append("description", description || "");
        formData.append("amountLost", amountLost || "");
        formData.append("dataPoints", JSON.stringify(validPoints.map((dp) => ({
          type: dp.type,
          value: dp.value,
        }))));
        formData.append("evidence", evidenceFile);

        const response = await fetch("/api/submit", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to submit report");
        }

        const result = await response.json();
        setIsVerified(result.isVerified || false);
        if (result.duplicateInfo) {
          setDuplicateInfo(result.duplicateInfo);
        }
      } else {
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scamType,
            platform: platform || null,
            description: description || null,
            amountLost: amountLost ? parseFloat(amountLost) : null,
            dataPoints: validPoints.map((dp) => ({
              type: dp.type,
              value: dp.value,
            })),
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to submit report");
        }

        const result = await response.json();
        if (result.duplicateInfo) {
          setDuplicateInfo(result.duplicateInfo);
        }
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit report"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">
            {batchSubmitCount > 1 
              ? `${batchSubmitCount} Reports Submitted` 
              : "Report Submitted"}
          </h1>
          {batchSubmitCount > 1 && (
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Users className="h-4 w-4" />
              Batch submission complete
            </div>
          )}
          {isVerified && (
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <ShieldCheck className="h-4 w-4" />
              Verified Report (Evidence Included)
            </div>
          )}
          
          {/* Duplicate Detection Info */}
          {duplicateInfo && duplicateInfo.hasExistingReports && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${
                  duplicateInfo.heatLevel === "CRITICAL" ? "bg-red-500" :
                  duplicateInfo.heatLevel === "HIGH" ? "bg-orange-500" :
                  duplicateInfo.heatLevel === "MEDIUM" ? "bg-yellow-500" : "bg-gray-500"
                }`}>
                  {duplicateInfo.heatLevel} PRIORITY
                </Badge>
                <span className="text-sm font-medium">
                  Confidence: {duplicateInfo.confidenceScore}%
                </span>
              </div>
              <p className="text-sm text-amber-800">
                🔥 {duplicateInfo.message}
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Multiple reports strengthen the case against this scammer.
              </p>
            </div>
          )}
          
          <p className="text-muted-foreground mb-8">
            Thank you for helping protect the community. Your report{batchSubmitCount > 1 ? "s have" : " has"} been
            recorded and will help others identify potential scams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="/search" className="inline-flex items-center gap-2">
                <span>Check Another</span>
                <ArrowRight className="h-4 w-4 flex-shrink-0" />
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsSubmitted(false);
                setIsVerified(false);
                setBatchSubmitCount(0);
                setScamType("");
                setPlatform("");
                setDescription("");
                setAmountLost("");
                setEvidenceFile(null);
                setDataPoints([
                  { id: crypto.randomUUID(), type: "phone", value: "" },
                ]);
                setConfirmed(false);
              }}
            >
              Submit Another Report
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Report a Scam</h1>
          <p className="text-muted-foreground">
            Help protect others by sharing details about suspicious activity
          </p>
        </div>

        {/* Warning */}
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Only submit reports about genuine scam attempts. False reports may
            harm innocent people and could have legal consequences.
          </AlertDescription>
        </Alert>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Scam Details</CardTitle>
            <CardDescription>
              Paste your story and let AI extract the details, or fill in manually.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
              <button
                type="button"
                onClick={() => setMode("smart")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === "smart"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Smart Report
              </button>
              <button
                type="button"
                onClick={() => setMode("manual")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === "manual"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="h-4 w-4" />
                Manual Entry
              </button>
            </div>

            {/* Smart Report Mode */}
            {mode === "smart" && (
              <div className="space-y-6">
                <SmartReportPaste 
                  onAnalyzed={handleAnalyzedReport}
                  onBatchAnalyzed={handleBatchSubmit}
                />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      or fill in manually below
                    </span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Only show form fields in manual mode or when data exists */}
              {(mode === "manual" || dataPoints.some(dp => dp.value)) && (
                <>
                  {/* Scam Type */}
                  <div className="space-y-2">
                    <Label htmlFor="scamType">
                      Scam Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      id="scamType"
                      value={scamType}
                      onChange={(e) => setScamType(e.target.value)}
                      options={scamTypeOptions}
                      placeholder="Select scam type"
                    />
                  </div>

                  {/* Platform */}
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform (Optional)</Label>
                    <Select
                      id="platform"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      options={platformOptions}
                      placeholder="Where did this happen?"
                    />
                  </div>

                  {/* Data Points */}
                  <div className="space-y-2">
                    <DataPointInput
                      dataPoints={dataPoints}
                      onChange={setDataPoints}
                    />
                    <p className="text-xs text-muted-foreground">
                      Add phone numbers, emails, bank accounts, or other identifiers
                      related to this scam.
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what happened (e.g., how the scammer contacted you, what they asked for)"
                      rows={4}
                    />
                  </div>

                  {/* Amount Lost */}
                  <div className="space-y-2">
                    <Label htmlFor="amountLost">Amount Lost (Optional)</Label>
                    <div className="flex gap-2">
                      <span className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 text-sm text-muted-foreground">
                        RM
                      </span>
                      <Input
                        id="amountLost"
                        type="number"
                        value={amountLost}
                        onChange={(e) => setAmountLost(e.target.value)}
                        placeholder="0.00"
                        className="rounded-l-none"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      If you lost money, enter the amount. This helps track the impact of scams.
                    </p>
                  </div>

                  {/* Evidence Upload */}
                  <EvidenceUpload
                    selectedFile={evidenceFile}
                    onFileSelect={setEvidenceFile}
                    isUploading={isLoading}
                  />

                  {/* Confirmation */}
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <input
                      type="checkbox"
                      id="confirmed"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="confirmed" className="text-sm">
                      I confirm that this information is accurate to the best of my
                      knowledge and I understand that false reports may harm
                      innocent people.
                    </label>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Submit Report
                      </>
                    )}
                  </Button>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
