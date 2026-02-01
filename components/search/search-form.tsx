"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DataPointInput, type DataPointEntry } from "./data-point-input";
import { validateDataPoint } from "@/lib/utils/validation";
import type { DataPointType } from "@/lib/constants";

export function SearchForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataPoints, setDataPoints] = useState<DataPointEntry[]>([
    { id: crypto.randomUUID(), type: "phone", value: "" },
  ]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
          Enter details you want to verify. You can check multiple items at once.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <DataPointInput
            dataPoints={dataPoints}
            onChange={setDataPoints}
            errors={fieldErrors}
          />

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

          <p className="text-xs text-muted-foreground text-center">
            Results show community-reported information and should not be
            treated as definitive proof of fraud. Always exercise caution.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
