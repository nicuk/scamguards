"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, FileText, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResultCard } from "@/components/results/result-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { AnalysisResult } from "@/lib/ai/analyze";

interface SearchResult {
  analysis: AnalysisResult;
  reportCount: number;
  dateRange?: { earliest: string; latest: string };
  verifiedCount?: number;
  disputedCount?: number;
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Build the search inputs from URL params
        const count = parseInt(searchParams.get("count") || "0");
        if (count === 0) {
          setError("No search parameters provided");
          setIsLoading(false);
          return;
        }

        const inputs: { type: string; value: string }[] = [];
        for (let i = 0; i < count; i++) {
          const type = searchParams.get(`type_${i}`);
          const value = searchParams.get(`value_${i}`);
          if (type && value) {
            inputs.push({ type, value });
          }
        }

        if (inputs.length === 0) {
          setError("No valid search parameters");
          setIsLoading(false);
          return;
        }

        // Call the search API
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inputs }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }

        const data = await response.json();
        setResult(data);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to fetch results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Analyzing information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link href="/search" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 flex-shrink-0" />
              <span>Try Again</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">No results to display</p>
        <Button asChild className="mt-4">
          <Link href="/search">Start a Search</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ResultCard
        result={result.analysis}
        reportCount={result.reportCount}
        dateRange={result.dateRange}
        verifiedCount={result.verifiedCount}
        disputedCount={result.disputedCount}
      />

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <Link
          href="/search"
          className="flex items-center justify-center gap-2 h-11 px-6 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors"
        >
          <Search className="h-4 w-4 flex-shrink-0" />
          <span>Search Again</span>
        </Link>
        <Link
          href="/submit"
          className="flex items-center justify-center gap-2 h-11 px-6 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors"
        >
          <FileText className="h-4 w-4 flex-shrink-0" />
          <span>Report a Scam</span>
        </Link>
      </div>

      {/* Dispute Link */}
      {result.analysis.status === "suspicious" && (
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Think this is incorrect?{" "}
            <Link href="/dispute" className="text-primary hover:underline">
              Submit a dispute
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground">
          Analysis based on community-submitted reports
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        }
      >
        <ResultsContent />
      </Suspense>
    </div>
  );
}
