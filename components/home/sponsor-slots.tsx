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
  const panelRef = useRef<HTMLDivElement>(null);

  const topBid = sponsors.length
    ? Math.max(...sponsors.map((s) => s.bidAmount))
    : minBid;

  useEffect(() => {
    const node = panelRef.current;
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
      <div
        ref={panelRef}
        className={`sponsor-panel board-settle ${live ? "is-live" : ""}`}
      >
        <div className="sponsor-panel-head">
          <div className="min-w-0">
            <p className="sponsor-panel-title">
              These sponsors help keep ScamGuards free
            </p>
            <p className="mt-0.5 flex items-center gap-2 text-xs text-[var(--sp-ink-3)]">
              <span
                className="live-dot relative h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--sp-live)]"
                aria-hidden="true"
              />
              <span>
                <span className="font-semibold text-[var(--sp-ink-2)]">Sponsored</span>
                {" "}· three slots, highest bid ranks first
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEnquiryOpen(true)}
            className="sponsor-bid-button group"
          >
            <Gavel className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-12" />
            Bid from ${minBid}
          </button>
        </div>

        <div className="sponsor-board">
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
      className={`sponsor-cell group ${isTopBid ? "is-top-bid" : ""}`}
    >
      <span className="sponsor-glow" aria-hidden="true" />

      <div
        className="sponsor-magnet sponsor-cell-head relative flex items-center gap-3"
        style={{ ["--pull" as string]: "9px" }}
      >
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
          <span className="block whitespace-nowrap text-[15px] font-semibold leading-tight text-[var(--sp-ink)]">
            {sponsor.name}
          </span>
          <span className="block truncate text-xs text-[var(--sp-ink-3)]">
            {sponsor.domain}
          </span>
        </span>

        <ArrowUpRight className="sponsor-arrow h-4 w-4 shrink-0" />
      </div>

      <p className="sponsor-magnet sponsor-cell-desc relative line-clamp-2 text-[13px] leading-relaxed text-[var(--sp-ink-2)]">
        {sponsor.description}
      </p>

      {/* The price is the point of a bid board, so it carries the weight */}
      <div
        className="sponsor-magnet sponsor-cell-price relative mt-auto flex items-baseline justify-between gap-3 pt-1"
        style={{ ["--pull" as string]: "4px" }}
      >
        <span className="flex items-baseline gap-2">
          <span
            className={`bid-flip sponsor-bid-figure ${live ? "is-live" : ""} font-semibold leading-none tracking-tight tabular-nums text-[var(--sp-ink)]`}
            style={{ animationDelay: `${(rank - 1) * 90 + 120}ms` }}
          >
            ${sponsor.bidAmount}
          </span>
          {isTopBid && <span className="sponsor-top-pill">Top bid</span>}
        </span>

        <span className="text-xs tabular-nums text-[var(--sp-ink-3)]">
          {clickCount.toLocaleString()} {clickCount === 1 ? "click" : "clicks"}
        </span>
      </div>
    </a>
  );
}
