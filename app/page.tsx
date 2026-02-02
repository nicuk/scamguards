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
    question: "How do I check if someone is a scammer in Malaysia?",
    answer:
      "Use ScamGuard's free search tool to check phone numbers, emails, bank accounts, or social media profiles. Enter the suspicious details and our AI-powered system will show you if there are any community reports associated with that information.",
  },
  {
    question: "Is ScamGuard free to use?",
    answer:
      "Yes, ScamGuard is completely free. You can search unlimited times and submit reports at no cost. Our mission is to protect the Malaysian community from scams.",
  },
  {
    question: "How do I report a scammer?",
    answer:
      "Click 'Report Scam' on our website, select the scam type, enter the scammer's details (phone, email, bank account, etc.), describe what happened, and submit. Your report helps protect others from becoming victims.",
  },
  {
    question: "What types of scams does ScamGuard cover?",
    answer:
      "ScamGuard covers all common scams in Malaysia including Macau scams, love scams, TCG/collectibles scams, gold/silver investment scams, e-commerce fraud, job scams, and more.",
  },
  {
    question: "Can I dispute a false report against me?",
    answer:
      "Yes, if you've been falsely reported, you can submit a dispute through our website. We have a fair review process to protect people from incorrect accusations.",
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
