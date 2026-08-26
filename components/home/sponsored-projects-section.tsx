import { getMinimumBid, getSponsors } from "@/lib/sponsors";
import { SponsorSlots } from "./sponsor-slots";

export async function SponsoredProjectsSection() {
  const sponsors = await getSponsors();

  if (sponsors.length === 0) return null;

  const minBid = getMinimumBid(sponsors);

  return (
    <section
      className="py-8 sm:py-10 bg-muted/30 border-y"
      id="sponsored-projects"
      aria-label="Sponsored projects"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <SponsorSlots sponsors={sponsors} minBid={minBid} />
        </div>
      </div>
    </section>
  );
}
