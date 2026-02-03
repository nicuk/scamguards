import { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { ScamTypesSection } from "@/components/home/scam-types-section";
import { TrustSection } from "@/components/home/trust-section";
import { CtaSection } from "@/components/home/cta-section";
import { PlatformStats } from "@/components/stats/platform-stats";
import { PAGE_SEO, SITE_URL, generateFAQSchema } from "@/lib/seo-config";

// Enhanced SEO metadata for homepage
export const metadata: Metadata = {
  title: PAGE_SEO.home.title,
  description: PAGE_SEO.home.description,
  keywords: PAGE_SEO.home.keywords,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
    url: SITE_URL,
    type: "website",
  },
  twitter: {
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
  },
};

// FAQ Schema for rich snippets
const homeFAQs = [
  {
    question: "How does the AI scam checker work?",
    answer:
      "Simply paste any phone number, email, or bank account into ScamGuards. Our AI instantly searches thousands of community scam reports and analyzes patterns to tell you if it's suspicious, safe, or unknown — with a confidence score.",
  },
  {
    question: "Is ScamGuards's AI scam checker free?",
    answer:
      "Yes, 100% free! No sign-up, no credit card, no limits. Just paste the suspicious details and get instant AI-powered results. Our mission is to protect all Malaysians from scams.",
  },
  {
    question: "How do I check if someone is a scammer in Malaysia?",
    answer:
      "Copy the phone number, email, bank account, or social media from the suspicious person. Paste it into ScamGuards's search box. Click 'Check Now' and our AI will instantly show you if there are any scam reports.",
  },
  {
    question: "How do I report a scammer?",
    answer:
      "Click 'Report Scam', paste or type the scammer's details (phone, email, bank account), select the scam type, and submit. You can also paste your whole story and our AI will extract the details automatically!",
  },
  {
    question: "What types of scams does ScamGuards detect?",
    answer:
      "ScamGuards's AI can detect all common scams in Malaysia: Macau scams, love scams, TCG/collectibles scams (Pokemon, One Piece cards), gold/silver scams, Shopee/Carousell scams, job scams, and more.",
  },
];

// JSON-LD for FAQ
function FAQJsonLd() {
  const faqSchema = generateFAQSchema(homeFAQs);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema),
      }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <FAQJsonLd />
      <div className="flex flex-col">
        {/* Hero Section */}
        <HeroSection />

        {/* Platform Stats */}
        <section className="py-12 bg-background border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <PlatformStats />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <HowItWorksSection />

        {/* Common Scam Types */}
        <ScamTypesSection />

        {/* Trust Section - Server rendered for SEO */}
        <TrustSection />

        {/* CTA Section */}
        <CtaSection />
      </div>
    </>
  );
}
