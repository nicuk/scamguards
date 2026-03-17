import { CheckCircle, Users, TrendingUp, AlertTriangle } from "lucide-react";

export function TrustSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* National scam stats — GEO: real data makes content citable by AI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <div className="text-center p-4 rounded-lg bg-destructive/5 border border-destructive/10">
              <p className="text-2xl md:text-3xl font-bold text-destructive">RM2.77B</p>
              <p className="text-xs text-muted-foreground mt-1">Lost to scams in 2025</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-destructive/5 border border-destructive/10">
              <p className="text-2xl md:text-3xl font-bold text-destructive">67,735</p>
              <p className="text-xs text-muted-foreground mt-1">Cases reported in 2024</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-warning/5 border border-warning/10">
              <p className="text-2xl md:text-3xl font-bold text-warning">+76%</p>
              <p className="text-xs text-muted-foreground mt-1">Increase from 2024 to 2025</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50 border">
              <p className="text-2xl md:text-3xl font-bold">RM5.62B</p>
              <p className="text-xs text-muted-foreground mt-1">Total lost 2023-2025</p>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground -mt-12 mb-16">
            Source:{" "}
            <a
              href="https://www.malaymail.com/news/malaysia/2026/01/22/home-ministry-malaysias-online-fraud-surge-drains-rm277b-in-2025-the-highest-in-three-years/206298"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              Home Ministry / PDRM
            </a>
            ,{" "}
            <a
              href="https://www.scoop.my/news/276554/malaysia-suffers-rm2-7bil-losses-from-online-scams-in-11-months-reveals-ccid/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              CCID
            </a>
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-center">
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
        </div>
      </div>
    </section>
  );
}
