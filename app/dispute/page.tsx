"use client";

import { useState } from "react";
import { AlertCircle, Loader2, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DisputePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [disputedInfo, setDisputedInfo] = useState("");
  const [reason, setReason] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!disputedInfo.trim()) {
      setError("Please specify what information you are disputing");
      return;
    }
    if (!reason.trim()) {
      setError("Please provide a reason for your dispute");
      return;
    }
    if (!contactEmail.trim() || !contactEmail.includes("@")) {
      setError("Please provide a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/dispute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disputedInfo,
          reason,
          contactEmail,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit dispute");
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit dispute"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Dispute Submitted</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for bringing this to our attention. We will review your
            dispute and may contact you at the email address provided if we need
            additional information.
          </p>
          <Button asChild>
            <a href="/">Return Home</a>
          </Button>
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
            <AlertCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Dispute a Report</h1>
          <p className="text-muted-foreground">
            If you believe you have been incorrectly reported, submit a dispute here
          </p>
        </div>

        {/* Info */}
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>How Disputes Work</AlertTitle>
          <AlertDescription>
            We take disputes seriously. After submission, we will review the
            reported information and may mark the associated report as
            &quot;disputed&quot; while under review. This status will be visible in
            search results.
          </AlertDescription>
        </Alert>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Dispute Details</CardTitle>
            <CardDescription>
              Please provide as much detail as possible to help us review your
              dispute.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Disputed Information */}
              <div className="space-y-2">
                <Label htmlFor="disputedInfo">
                  Information Being Disputed{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="disputedInfo"
                  value={disputedInfo}
                  onChange={(e) => setDisputedInfo(e.target.value)}
                  placeholder="e.g., Phone number 012-345 6789"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the specific data point (phone, email, etc.) that you
                  believe was incorrectly reported.
                </p>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">
                  Reason for Dispute <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please explain why you believe this report is incorrect..."
                  rows={5}
                />
              </div>

              {/* Contact Email */}
              <div className="space-y-2">
                <Label htmlFor="contactEmail">
                  Contact Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
                <p className="text-xs text-muted-foreground">
                  We may contact you if we need additional information to
                  process your dispute.
                </p>
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
                    <Send className="h-4 w-4 mr-2" />
                    Submit Dispute
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By submitting, you confirm that the information provided is
                accurate and that you have a legitimate reason for this dispute.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
