import { Metadata } from "next";
import {
  Shield,
  Search,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Lock,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PAGE_SEO, SITE_URL, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: PAGE_SEO.howItWorks.title,
  description: PAGE_SEO.howItWorks.description,
  keywords: PAGE_SEO.howItWorks.keywords,
  alternates: {
    canonical: `${SITE_URL}/how-it-works`,
  },
  openGraph: {
    title: PAGE_SEO.howItWorks.title,
    description: PAGE_SEO.howItWorks.description,
    url: `${SITE_URL}/how-it-works`,
    type: "website",
  },
};

const pageFAQs = [
  {
    question: "Is this a replacement for police reports?",
    answer: "No. ScamGuard is a community awareness tool, not a substitute for official reporting. If you've been scammed, always report to the police and your bank.",
  },
  {
    question: "What if I'm incorrectly reported?",
    answer: "You can submit a dispute through our dispute form. We take false reports seriously and will review all disputes.",
  },
  {
    question: "How accurate are the results?",
    answer: "Results are based on community reports and AI analysis. They provide an indication of risk but should not be treated as definitive proof of fraud or safety.",
  },
  {
    question: "Can I report anonymously?",
    answer: "Yes. We do not require any personal information to submit a report. However, reports with evidence are weighted more heavily in our analysis.",
  },
];

function PageJsonLd() {
  const faqSchema = generateFAQSchema(pageFAQs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "How It Works", url: `${SITE_URL}/how-it-works` },
  ]);
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
    </>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <PageJsonLd />
      <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">How ScamGuard Works</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ScamGuard is a community-driven platform that helps Malaysians
            identify potential scams by sharing and searching reported
            information.
          </p>
        </div>

        {/* Process Steps */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">The Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enter phone numbers, emails, bank accounts, or other details
                  you want to verify. Our system searches community-submitted
                  reports for matches.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>2. Analyze</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our AI analyzes the search results, considering factors like
                  the number of reports, verification status, and patterns to
                  generate a risk assessment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>3. Decide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You receive a clear assessment with confidence level, matched
                  information, and factors that contributed to the analysis.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Do / Don't Do */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-success/30 bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-5 w-5" />
                  What We Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                    <span>Collect community reports about suspicious activity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                    <span>Provide risk assessments based on reported data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                    <span>Allow disputes for incorrectly reported information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                    <span>Use neutral, non-accusatory language</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                    <span>Mask sensitive information for privacy</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  What We Don&apos;t Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-destructive mt-1 flex-shrink-0" />
                    <span>Verify or confirm that someone is a scammer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-destructive mt-1 flex-shrink-0" />
                    <span>Make accusations or legal determinations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-destructive mt-1 flex-shrink-0" />
                    <span>Guarantee that &quot;clear&quot; results are safe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-destructive mt-1 flex-shrink-0" />
                    <span>Replace official law enforcement or bank verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-destructive mt-1 flex-shrink-0" />
                    <span>Store or share personal identifying information</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Result Types */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Understanding Results
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-destructive/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                  <div>
                    <CardTitle className="text-destructive">Suspicious</CardTitle>
                    <CardDescription>Exercise caution</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The information you searched has appeared in one or more
                  community reports. This does not confirm fraud, but suggests
                  extra caution is warranted.
                </p>
              </CardContent>
            </Card>

            <Card className="border-muted">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <CardTitle>No Known Info</CardTitle>
                    <CardDescription>No reports found</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We found no matching reports in our database. This does not
                  mean it&apos;s safe — the information may simply not have been
                  reported yet.
                </p>
              </CardContent>
            </Card>

            <Card className="border-success/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-success" />
                  <div>
                    <CardTitle className="text-success">Clear</CardTitle>
                    <CardDescription>No suspicious patterns</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No suspicious patterns were detected based on available data.
                  Always verify through official channels for important
                  transactions.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Privacy & Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                ScamGuard is committed to protecting user privacy while
                providing a useful service to the community.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                  <span>
                    Sensitive data is masked in search results (e.g., phone
                    numbers show as 012-***-4567)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                  <span>
                    We do not require user accounts or collect personal
                    information
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                  <span>
                    Disputes can be submitted to challenge incorrect reports
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                  <span>
                    We comply with Malaysia&apos;s Personal Data Protection Act
                    (PDPA) 2010
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is this a replacement for police reports?",
                a: "No. ScamGuard is a community awareness tool, not a substitute for official reporting. If you've been scammed, always report to the police and your bank.",
              },
              {
                q: "What if I'm incorrectly reported?",
                a: "You can submit a dispute through our dispute form. We take false reports seriously and will review all disputes.",
              },
              {
                q: "How accurate are the results?",
                a: "Results are based on community reports and AI analysis. They provide an indication of risk but should not be treated as definitive proof of fraud or safety.",
              },
              {
                q: "Can I report anonymously?",
                a: "Yes. We do not require any personal information to submit a report. However, reports with evidence are weighted more heavily in our analysis.",
              },
            ].map((faq, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
