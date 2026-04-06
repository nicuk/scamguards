import { CheckCircle, Users, ExternalLink, ShieldCheck } from "lucide-react";

const DATA_SOURCES = [
  { name: "PDRM SemakMule", url: "https://semakmule.rmp.gov.my/", tag: "Official" },
  { name: "BNM Financial Consumer Alert", url: "https://www.bnm.gov.my/financial-consumer-alert-list", tag: "Official" },
  { name: "CCID / BERNAMA", url: "https://www.bernama.com/", tag: "News" },
  { name: "PenipuMY", url: "https://penipu.my/hall-of-shame", tag: "Community" },
  { name: "Lowyat Forum", url: "https://forum.lowyat.net/", tag: "Community" },
  { name: "Facebook Scam Groups", url: "#", tag: "Community" },
];

export function TrustSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Community-Powered Protection
              </h2>
              <p className="text-muted-foreground mb-6">
                ScamGuards relies on reports from the community. When someone
                encounters a scam, they can share the details to help protect
                others.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
                  <span>Neutral, fact-based assessments — not accusations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
                  <span>Dispute mechanism for those incorrectly reported</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
                  <span>Privacy-focused — sensitive data is masked</span>
                </li>
              </ul>
            </div>
            <div className="bg-muted/50 rounded-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <Users className="h-12 w-12 text-primary" />
                <div>
                  <p className="text-3xl font-bold">Community</p>
                  <p className="text-muted-foreground">Driven Platform</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Together, we can create a safer environment for all Malaysians
                by sharing information about suspicious activities.
              </p>
            </div>
          </div>

          {/* Data Sources */}
          <div className="border-t pt-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3">
                <ShieldCheck className="h-4 w-4" />
                Where Our Data Comes From
              </div>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                Our database is compiled from public reports and official databases.
                Always verify details via official channels.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {DATA_SOURCES.map((src) => (
                <a
                  key={src.name}
                  href={src.url}
                  target={src.url !== "#" ? "_blank" : undefined}
                  rel={src.url !== "#" ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border/50 bg-card hover:border-primary/30 hover:shadow-sm transition-all text-sm group"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate group-hover:text-primary transition-colors">{src.name}</p>
                    <p className="text-xs text-muted-foreground">{src.tag}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
