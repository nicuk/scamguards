"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type SponsorEnquiryDialogProps = {
  open: boolean;
  onClose: () => void;
  minBid: number;
  /** Highest live bid, used to suggest an opening offer. */
  topBid: number;
};

export function SponsorEnquiryDialog({
  open,
  onClose,
  minBid: initialMinBid,
  topBid: initialTopBid,
}: SponsorEnquiryDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [bids, setBids] = useState({
    minBid: initialMinBid,
    topBid: initialTopBid,
  });
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const { minBid, topBid } = bids;
  /** What it costs to take the #1 slot outright. */
  const topSlotBid = Math.max(minBid, Math.floor(topBid) + 1);

  // The page HTML is ISR-cached, so re-read the live floor on open. Without
  // this the form can advertise a minimum the API would reject.
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    fetch("/api/sponsors", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { minBid?: number; topBid?: number } | null) => {
        if (cancelled || !data) return;
        if (
          typeof data.minBid === "number" &&
          typeof data.topBid === "number"
        ) {
          setBids({ minBid: data.minBid, topBid: data.topBid });
        }
      })
      .catch(() => {
        // Keep the server-rendered figures if the refresh fails
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  // Close on Escape and lock background scroll while open
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 60);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  // Reset back to a blank form the next time it opens
  useEffect(() => {
    if (!open) {
      setDone(false);
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/sponsors/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          website: form.get("website"),
          bidAmount: form.get("bidAmount"),
          message: form.get("message"),
        }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sponsor-enquiry-title"
    >
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border bg-background p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {done ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-success" />
            <h3
              id="sponsor-enquiry-title"
              className="text-lg font-semibold mb-2"
            >
              Enquiry received
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              We&apos;ll be in touch by email shortly with the next steps.
            </p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <>
            <h3
              id="sponsor-enquiry-title"
              className="text-lg font-semibold pr-8"
            >
              Sponsor a slot
            </h3>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">
              Three slots, ranked by bid. All three are taken right now, so $
              {minBid} is the lowest bid that claims one — ${topSlotBid} takes
              the top slot outright.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="sponsor-name">Your name</Label>
                <Input
                  ref={firstFieldRef}
                  id="sponsor-name"
                  name="name"
                  required
                  maxLength={120}
                  placeholder="Jane Tan"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="sponsor-email">Email</Label>
                <Input
                  id="sponsor-email"
                  name="email"
                  type="email"
                  required
                  maxLength={200}
                  placeholder="you@company.com"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="sponsor-website">Website to feature</Label>
                <Input
                  id="sponsor-website"
                  name="website"
                  type="url"
                  maxLength={300}
                  placeholder="https://yoursite.com"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="sponsor-bid">Your bid (USD)</Label>
                <Input
                  // Remount when the live floor arrives so the uncontrolled
                  // default follows it
                  key={minBid}
                  id="sponsor-bid"
                  name="bidAmount"
                  type="number"
                  required
                  min={minBid}
                  step={1}
                  defaultValue={minBid}
                  className="mt-1.5"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  ${minBid} minimum · bid ${topSlotBid} or more to take the top
                  slot.
                </p>
              </div>

              <div>
                <Label htmlFor="sponsor-message">Anything else? (optional)</Label>
                <Textarea
                  id="sponsor-message"
                  name="message"
                  maxLength={2000}
                  rows={3}
                  placeholder="Tell us about your product"
                  className="mt-1.5"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send enquiry"
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
