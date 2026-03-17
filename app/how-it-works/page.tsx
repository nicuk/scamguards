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
  ShieldAlert,
  ShieldCheck,
  ClipboardPaste,
  Sparkles,
  Brain,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
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
    answer: "No. ScamGuards is a community awareness tool, not a substitute for official reporting. If you've been scammed, always report to the police and your bank.",
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

  const checkHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to check if someone is a scammer in Malaysia",
    description: "Use ScamGuards to instantly check if a phone number, email, or bank account has been reported as a scam.",
    step: [
      { "@type": "HowToStep", position: 1, name: "Copy details", text: "Copy the phone number, bank account, or email of the person you want to check." },
      { "@type": "HowToStep", position: 2, name: "Paste into ScamGuards", text: "Go to scamguards.app/search and paste the details into the search box." },
      { "@type": "HowToStep", position: 3, name: "Get instant results", text: "Our AI searches thousands of community reports and shows you a risk level with confidence score." },
    ],
    totalTime: "PT10S",
  };

  const reportHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to report a scammer in Malaysia",
    description: "Report a scammer on ScamGuards to protect other Malaysians from the same fraud.",
    step: [
      { "@type": "HowToStep", position: 1, name: "Go to Report page", text: "Visit scamguards.app/submit and describe what happened." },
      { "@type": "HowToStep", position: 2, name: "Paste scammer details", text: "Paste the scammer's phone number, bank account, email, or your chat conversation. AI extracts the key details." },
      { "@type": "HowToStep", position: 3, name: "Submit", text: "Submit your report. The next person who checks that number or account will see the warning." },
    ],
    totalTime: "PT2M",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(checkHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reportHowTo) }}
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
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">How ScamGuards Works</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Whether you&apos;ve been scammed or you&apos;re about to deal with someone new — ScamGuards helps you in 3 steps.
            </p>
          </div>

          {/* PATH A: Already a Victim */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10">
                <ShieldAlert className="h-5 w-5 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold">Already a Victim?</h2>
            </div>
            <p className="text-muted-foreground mb-8 ml-[52px]">
              Make sure there isn&apos;t another. Report the scammer so the next person is warned.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="relative">
                <div className="absolute -top-3 left-5 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5 text-red-500" />
                    Tell Your Story
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Paste the scammer&apos;s phone number, bank account, email — or just paste the whole conversation. Our AI extracts the key details.
                  </p>
                </CardContent>
              </Card>

              <Card className="relative border-2 border-red-500/20 bg-red-500/5">
                <div className="absolute -top-3 left-5 bg-gradient-to-r from-red-500 to-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Brain className="h-5 w-5 text-red-500" />
                    AI Processes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Our AI identifies phone numbers, bank accounts, and patterns from your report and adds it to the database.
                  </p>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-3 left-5 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-5 w-5 text-red-500" />
                    Protect Others
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    The next person who checks that number or account will see the warning. You just saved someone.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <FileText className="h-4 w-4" />
                Report a Scammer
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* PATH B: About to Deal */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10">
                <ShieldCheck className="h-5 w-5 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold">About to Buy or Transfer?</h2>
            </div>
            <p className="text-muted-foreground mb-8 ml-[52px]">
              Check here first. 10 seconds could save you thousands.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="relative">
                <div className="absolute -top-3 left-5 bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ClipboardPaste className="h-5 w-5 text-blue-500" />
                    Copy &amp; Paste
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Grab the seller&apos;s phone number, bank account, or email from the chat. Paste it into ScamGuards.
                  </p>
                </CardContent>
              </Card>

              <Card className="relative border-2 border-blue-500/20 bg-blue-500/5">
                <div className="absolute -top-3 left-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                    AI Scans Instantly
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Our AI searches thousands of community reports and analyzes patterns — results in seconds.
                  </p>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-3 left-5 bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    Decide Safely
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    See a clear risk level with a confidence score before you pay. Suspicious, unknown, or clear.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <Search className="h-4 w-4" />
                Check Now (Free)
                <ArrowRight className="h-4 w-4" />
              </Link>
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
                  ScamGuards is committed to protecting user privacy while
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
                  a: "No. ScamGuards is a community awareness tool, not a substitute for official reporting. If you've been scammed, always report to the police and your bank.",
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
