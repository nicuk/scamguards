"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Gavel } from "lucide-react";
import type { Sponsor } from "@/lib/sponsors";
import { SponsorEnquiryDialog } from "./sponsor-enquiry-dialog";

type SponsorSlotsProps = {
  sponsors: Sponsor[];
  minBid: number;
};

export function SponsorSlots({ sponsors, minBid }: SponsorSlotsProps) {
  const [live, setLive] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [clicks, setClicks] = useState<Record<string, number>>(() =>
    Object.fromEntries(sponsors.map((s) => [s.slug, s.clickCount]))
  );
  const boardRef = useRef<HTMLDivElement>(null);

  const topBid = sponsors.length
    ? Math.max(...sponsors.map((s) => s.bidAmount))
    : minBid;

  useEffect(() => {
    const node = boardRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setLive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const trackClick = useCallback((slug: string) => {
    setClicks((prev) => ({ ...prev, [slug]: (prev[slug] ?? 0) + 1 }));

    fetch("/api/sponsors/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {
      // A dropped click should never surface to the visitor
    });
  }, []);

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <span
            className="live-dot relative h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
            aria-hidden="true"
          />
          <span>
            <span className="font-medium text-foreground">Sponsored</span> — three
            slots, highest bid ranks first
          </span>
        </p>

        <button
          type="button"
          onClick={() => setEnquiryOpen(true)}
          className="group inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:min-h-[36px]"
        >
          <Gavel className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-12" />
          Bid from ${minBid}
        </button>
      </div>

      <div
        ref={boardRef}
        className={`board-settle ${live ? "is-live" : ""}
          grid grid-cols-1 divide-y overflow-hidden rounded-xl border
          bg-background md:grid-cols-3 md:divide-x md:divide-y-0`}
      >
        {sponsors.map((sponsor, index) => (
          <SponsorCell
            key={sponsor.slug}
            sponsor={sponsor}
            rank={index + 1}
            clickCount={clicks[sponsor.slug] ?? 0}
            live={live}
            onTrack={trackClick}
          />
        ))}
      </div>

      <SponsorEnquiryDialog
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        minBid={minBid}
        topBid={topBid}
      />
    </>
  );
}

type SponsorCellProps = {
  sponsor: Sponsor;
  rank: number;
  clickCount: number;
  live: boolean;
  onTrack: (slug: string) => void;
};

function SponsorCell({
  sponsor,
  rank,
  clickCount,
  live,
  onTrack,
}: SponsorCellProps) {
  const cellRef = useRef<HTMLAnchorElement>(null);
  const frameRef = useRef<number | null>(null);
  const isTopBid = rank === 1;

  // Pointer tracking drives CSS custom properties directly rather than React
  // state — re-rendering on every mousemove would be far too expensive.
  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;

    const node = cellRef.current;
    if (!node) return;

    const { clientX, clientY } = event;

    if (frameRef.current !== null) return;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const relX = (clientX - rect.left) / rect.width;
      const relY = (clientY - rect.top) / rect.height;

      node.style.setProperty("--px", (relX - 0.5).toFixed(3));
      node.style.setProperty("--py", (relY - 0.5).toFixed(3));
      node.style.setProperty("--sx", `${(relX * 100).toFixed(1)}%`);
      node.style.setProperty("--sy", `${(relY * 100).toFixed(1)}%`);
      node.classList.add("is-tracking");
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    const node = cellRef.current;
    if (!node) return;

    // Drop is-tracking first so the longer easing carries it home
    node.classList.remove("is-tracking");
    node.style.setProperty("--px", "0");
    node.style.setProperty("--py", "0");
  }, []);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    []
  );

  return (
    <a
      ref={cellRef}
      href={sponsor.url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={() => onTrack(sponsor.slug)}
      onAuxClick={(e) => {
        if (e.button === 1) onTrack(sponsor.slug);
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ ["--accent" as string]: sponsor.accentColor }}
      className={`sponsor-cell group relative flex flex-col gap-3 p-4
        transition-colors duration-200 focus-visible:outline-none sm:p-5
        ${isTopBid ? "bg-primary/[0.035]" : ""}`}
    >
      <span className="sponsor-glow" aria-hidden="true" />

      <div className="sponsor-magnet relative flex items-center gap-3" style={{ ["--pull" as string]: "9px" }}>
        <span className="sponsor-logo-tile flex h-11 w-11 shrink-0 items-center justify-center rounded-lg">
          <Image
            src={sponsor.logoPath}
            alt=""
            width={80}
            height={80}
            className="h-8 w-8 object-contain transition-transform duration-300 ease-out group-hover:scale-110"
          />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block whitespace-nowrap text-[15px] font-semibold leading-tight">
            {sponsor.name}
          </span>
          <span className="block truncate text-xs text-foreground/68">
            {sponsor.domain}
          </span>
        </span>

        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
      </div>

      <p className="sponsor-magnet relative line-clamp-2 text-[13px] leading-relaxed text-foreground/75">
        {sponsor.description}
      </p>

      {/* The price is the point of a bid board, so it carries the weight */}
      <div
        className="sponsor-magnet relative mt-auto flex items-baseline justify-between gap-3 pt-1"
        style={{ ["--pull" as string]: "4px" }}
      >
        <span className="flex items-baseline gap-2">
          <span
            className={`bid-flip ${live ? "is-live" : ""} text-[26px] font-semibold leading-none tracking-tight tabular-nums`}
            style={{ animationDelay: `${(rank - 1) * 90 + 120}ms` }}
          >
            ${sponsor.bidAmount}
          </span>
          {isTopBid && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
              Top bid
            </span>
          )}
        </span>

        <span className="text-xs tabular-nums text-foreground/68">
          {clickCount.toLocaleString()}{" "}
          {clickCount === 1 ? "click" : "clicks"}
        </span>
      </div>
    </a>
  );
}
