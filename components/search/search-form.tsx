"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2, Sparkles, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DataPointInput, type DataPointEntry } from "./data-point-input";
import { SmartPaste } from "./smart-paste";
import { validateDataPoint, detectInputType } from "@/lib/utils/validation";
import type { DataPointType } from "@/lib/constants";

type InputMode = "smart" | "manual";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<InputMode>("smart");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataPoints, setDataPoints] = useState<DataPointEntry[]>([
    { id: crypto.randomUUID(), type: "phone", value: "" },
  ]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const autoSubmitted = useRef(false);

  // Handle ?q= param from hero search — auto-detect type and submit
  useEffect(() => {
    const raw = searchParams.get("q");
    const q = raw?.trim();
    if (!q || autoSubmitted.current) return;
    autoSubmitted.current = true;

    const detectedType = detectInputType(q) as DataPointType;
    setDataPoints([{ id: crypto.randomUUID(), type: detectedType, value: q }]);
    setMode("manual");

    const params = new URLSearchParams();
    params.append("type_0", detectedType);
    params.append("value_0", q);
    params.append("count", "1");
    router.push(`/results?${params.toString()}`);
  }, [searchParams, router]);

  // Handle extracted data from Smart Paste
  const handleExtracted = (extracted: { type: DataPointType; value: string }[]) => {
    if (extracted.length === 0) return;
    
    const newPoints: DataPointEntry[] = extracted.map((ep) => ({
      id: crypto.randomUUID(),
      type: ep.type,
      value: ep.value,
    }));
    
    setDataPoints(newPoints);
    setMode("manual"); // Switch to manual mode to show/edit extracted data
    setError(null);
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validate all fields
    const errors: Record<string, string> = {};
    const validPoints: DataPointEntry[] = [];

    for (const dp of dataPoints) {
      if (!dp.value.trim()) continue; // Skip empty fields
      
      const validation = validateDataPoint(dp.type, dp.value);
      if (!validation.valid) {
        errors[dp.id] = validation.error || "Invalid value";
      } else {
        validPoints.push(dp);
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (validPoints.length === 0) {
      setError("Please type in at least one detail to search.");
      return;
    }

    setIsLoading(true);

    try {
      // Encode search params
      const searchParams = new URLSearchParams();
      validPoints.forEach((dp, i) => {
        searchParams.append(`type_${i}`, dp.type);
        searchParams.append(`value_${i}`, dp.value);
      });
      searchParams.append("count", validPoints.length.toString());

      router.push(`/results?${searchParams.toString()}`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDataPoints([{ id: crypto.randomUUID(), type: "phone", value: "" }]);
    setFieldErrors({});
    setError(null);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Enter the Details
        </CardTitle>
        <CardDescription>
          Type in a phone number, email, or bank account and we'll check if it's been reported as a scammer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* How it works explanation */}
        <div className="mb-6 p-4 rounded-lg bg-muted/60 border text-sm space-y-2">
          <p className="font-medium">What you'll see after checking:</p>
          <ul className="text-muted-foreground space-y-1">
            <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">→</span><span>A risk score showing how likely this contact is a scammer.</span></li>
            <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">→</span><span>How many times this number, email, or account has been reported.</span></li>
            <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">→</span><span>The types of scams linked to it and any other accounts connected to the same scammer.</span></li>
          </ul>
        </div>

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
            Paste a Message
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
            Type It In
          </button>
        </div>

        {/* Smart Paste Mode - always mounted to preserve state */}
        <div className={mode === "smart" ? "space-y-6" : "hidden"}>
          <SmartPaste onExtracted={handleExtracted} />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                or type it in below
              </span>
            </div>
          </div>
        </div>

        {/* Manual Entry / Edit Mode */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {(mode === "manual" || dataPoints.some(dp => dp.value)) && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {mode === "smart" ? "Or type it in below:" : "Details to check:"}
                </label>
                <DataPointInput
                  dataPoints={dataPoints}
                  onChange={setDataPoints}
                  errors={fieldErrors}
                />
              </div>
            </>
          )}

          {mode === "manual" && (
            <>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Results are based on community reports. Always use your own judgement too.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
