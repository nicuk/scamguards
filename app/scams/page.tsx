import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SCAM_TYPES } from "@/lib/scam-data";
import { SITE_URL, generateBreadcrumbSchema } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "Common Scams in Malaysia - Know the Types | ScamGuards",
  description:
    "Learn about the most common scams targeting Malaysians: Macau scams, love scams, TCG card scams, investment fraud, e-commerce scams, and gold scams. Protect yourself.",
  keywords: [
    "scams in malaysia",
    "types of scams",
    "common scams malaysia",
    "jenis penipuan malaysia",
  ],
  alternates: {
    canonical: `${SITE_URL}/scams`,
  },
  openGraph: {
    title: "Common Scams in Malaysia | ScamGuards",
    description:
      "Learn about the most common scams targeting Malaysians and how to protect yourself.",
    url: `${SITE_URL}/scams`,
    type: "website",
  },
};

function ScamsJsonLd() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Scam Types", url: `${SITE_URL}/scams` },
  ]);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

export default function ScamsIndexPage() {
  return (
    <>
    <ScamsJsonLd />
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Common Scams in Malaysia
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Know the scam before it knows you. Learn how each type works, the
            red flags, and what to do if you encounter one.
          </p>
        </div>

        <div className="space-y-4">
          {SCAM_TYPES.map((scam) => (
            <Link key={scam.slug} href={`/scams/${scam.slug}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-4 py-5">
                  <span className="text-4xl">{scam.heroEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-lg">{scam.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {scam.metaDescription}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
