import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  FileText,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Eye,
  Lightbulb,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SCAM_TYPES, getScamBySlug, getAllScamSlugs } from "@/lib/scam-data";
import { SITE_URL, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo-config";

export function generateStaticParams() {
  return getAllScamSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const scam = getScamBySlug(params.slug);
  if (!scam) return {};

  return {
    title: scam.metaTitle,
    description: scam.metaDescription,
    keywords: scam.keywords,
    alternates: {
      canonical: `${SITE_URL}/scams/${scam.slug}`,
    },
    openGraph: {
      title: scam.metaTitle,
      description: scam.metaDescription,
      url: `${SITE_URL}/scams/${scam.slug}`,
      type: "article",
    },
  };
}

export default function ScamTypePage({
  params,
}: {
  params: { slug: string };
}) {
  const scam = getScamBySlug(params.slug);
  if (!scam) notFound();

  const faqSchema = generateFAQSchema(scam.faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Scam Types", url: `${SITE_URL}/scams` },
    { name: scam.title, url: `${SITE_URL}/scams/${scam.slug}` },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to protect yourself from ${scam.title} in Malaysia`,
    description: scam.metaDescription,
    step: scam.whatToDo.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/scams" className="hover:text-primary">Scam Types</Link>
            <span>/</span>
            <span className="text-foreground">{scam.title}</span>
          </nav>

          {/* Hero */}
          <div className="mb-12">
            <div className="text-5xl mb-4">{scam.heroEmoji}</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{scam.title} in Malaysia</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{scam.what}</p>
          </div>

          {/* Quick check CTA */}
          <Card className="mb-12 border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col sm:flex-row items-center gap-4 py-6">
              <div className="flex-1">
                <p className="font-semibold mb-1">Dealing with someone suspicious?</p>
                <p className="text-sm text-muted-foreground">
                  Check their phone number, email, or bank account instantly.
                </p>
              </div>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all whitespace-nowrap"
              >
                <Search className="h-4 w-4" />
                Check Now (Free)
              </Link>
            </CardContent>
          </Card>

          {/* How this scam works */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Eye className="h-6 w-6 text-muted-foreground" />
              How This Scam Works
            </h2>
            <ol className="space-y-4">
              {scam.howItWorks.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </span>
                  <p className="text-muted-foreground pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Red flags */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              Red Flags to Watch
            </h2>
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="py-6">
                <ul className="space-y-3">
                  {scam.redFlags.map((flag, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* What to do */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-success" />
              What to Do
            </h2>
            <Card className="border-success/20 bg-success/5">
              <CardContent className="py-6">
                <ul className="space-y-3">
                  {scam.whatToDo.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Real example */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-warning" />
              Real Example
            </h2>
            <Card>
              <CardContent className="py-6">
                <p className="text-muted-foreground leading-relaxed italic">
                  &quot;{scam.realExample}&quot;
                </p>
              </CardContent>
            </Card>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {scam.faqs.map((faq, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTAs */}
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            <Link
              href="/search"
              className="flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
            >
              <Search className="h-5 w-5" />
              Check Someone Now
            </Link>
            <Link
              href="/submit"
              className="flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-input bg-background font-semibold hover:bg-accent hover:text-accent-foreground transition-all"
            >
              <FileText className="h-5 w-5" />
              Report a Scammer
            </Link>
          </div>

          {/* Other scam types */}
          <section>
            <h2 className="text-xl font-bold mb-4">Other Scam Types</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {SCAM_TYPES.filter((s) => s.slug !== scam.slug).map((s) => (
                <Link
                  key={s.slug}
                  href={`/scams/${s.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <span className="text-2xl">{s.heroEmoji}</span>
                  <span className="font-medium text-sm">{s.title}</span>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
