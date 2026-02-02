"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Sparkles, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DataPointInput, type DataPointEntry } from "./data-point-input";
import { SmartPaste } from "./smart-paste";
import { validateDataPoint } from "@/lib/utils/validation";
import type { DataPointType } from "@/lib/constants";

type InputMode = "smart" | "manual";

export function SearchForm() {
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>("smart");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataPoints, setDataPoints] = useState<DataPointEntry[]>([
    { id: crypto.randomUUID(), type: "phone", value: "" },
  ]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
      setError("Please enter at least one value to search");
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
          Check for Reports
        </CardTitle>
        <CardDescription>
          Paste a scam message for AI extraction, or enter details manually.
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
            Smart Paste
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

        {/* Smart Paste Mode */}
        {mode === "smart" && (
          <div className="space-y-6">
            <SmartPaste onExtracted={handleExtracted} />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  or enter manually below
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Manual Entry / Edit Mode */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {(mode === "manual" || dataPoints.some(dp => dp.value)) && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {mode === "smart" ? "Or enter manually:" : "Information to Check"}
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
            Results show community-reported information and should not be
            treated as definitive proof of fraud. Always exercise caution.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
