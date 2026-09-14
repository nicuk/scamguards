import { ResultsView } from "@/components/results/results-view";
import { SponsoredProjectsSection } from "@/components/home/sponsored-projects-section";

// The results UI reads search params on the client. This thin server shell
// exists so the server-rendered sponsor panel can be handed to it as a slot.
export default function ResultsPage() {
  return (
    <ResultsView
      sponsorSlot={<SponsoredProjectsSection placement="inline" />}
    />
  );
}
