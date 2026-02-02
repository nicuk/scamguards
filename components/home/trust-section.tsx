import { CheckCircle, Users } from "lucide-react";

export function TrustSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Community-Powered Protection
              </h2>
              <p className="text-muted-foreground mb-6">
                ScamGuard relies on reports from the community. When someone
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
        </div>
      </div>
    </section>
  );
}
