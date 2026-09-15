import { getCachedSponsors, getMinimumBid } from "@/lib/sponsors";
import { formatCompact, getCachedAudienceStats } from "@/lib/site-stats";
import { SponsorSlots } from "./sponsor-slots";

type SponsoredProjectsSectionProps = {
  /**
   * "band" spans the page inside its own section, for landing layouts.
   * "inline" drops into an existing content column (articles, search, results)
   * and inherits that column's width.
   */
  placement?: "band" | "inline";
  className?: string;
};

export async function SponsoredProjectsSection({
  placement = "band",
  className = "",
}: SponsoredProjectsSectionProps) {
  const [sponsors, stats] = await Promise.all([
    getCachedSponsors(),
    getCachedAudienceStats(),
  ]);

  if (sponsors.length === 0) return null;

  const minBid = getMinimumBid(sponsors);

  const reach = {
    visitors: stats.visitors,
    days: stats.days,
    // Formatted on the server so the browser's locale can never change the text
    impressions:
      stats.impressions30d !== null ? formatCompact(stats.impressions30d) : null,
  };

  if (placement === "inline") {
    return (
      <aside aria-label="Sponsored projects" className={className}>
        <SponsorSlots sponsors={sponsors} minBid={minBid} reach={reach} />
      </aside>
    );
  }

  return (
    <section
      id="sponsored-projects"
      aria-label="Sponsored projects"
      className={`py-8 sm:py-10 ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <SponsorSlots sponsors={sponsors} minBid={minBid} reach={reach} />
        </div>
      </div>
    </section>
  );
}
