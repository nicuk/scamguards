// Central SEO Configuration for ScamGuard Malaysia
// Update SITE_URL to your actual domain

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://scamguards.app";
export const SITE_NAME = "ScamGuard Malaysia";

export const SEO_CONFIG = {
  siteName: SITE_NAME,
  siteUrl: SITE_URL,
  defaultTitle: "ScamGuard Malaysia - AI Scam Checker | Check Scammers Free",
  defaultDescription:
    "Free AI-powered scam detection for Malaysia. Instantly check if phone numbers, emails, or bank accounts are scammers. Paste any detail, AI checks thousands of reports. Semak penipu dengan AI.",
  
  // Primary keywords for the site
  keywords: [
    // AI-focused keywords
    "ai scam checker",
    "ai scam detection malaysia",
    "ai check scammer",
    "scam checker ai free",
    
    // English primary
    "scam check malaysia",
    "check scammer malaysia",
    "is this a scammer",
    "report scammer malaysia",
    "malaysia scam database",
    "phone scam check",
    "scammer phone number malaysia",
    
    // Malay keywords
    "semak penipu malaysia",
    "ai semak penipu",
    "lapor penipu",
    "nombor telefon penipu",
    "semak nombor scammer",
    "ini penipu ke",
    
    // Specific scam types
    "tcg scammer malaysia",
    "one piece card scammer",
    "pokemon card scammer malaysia",
    "gold scammer malaysia",
    "shopee scammer",
    "carousell scammer malaysia",
    "telegram scammer malaysia",
    "macau scam malaysia",
    "love scam malaysia",
    "investment scam malaysia",
    
    // E-wallet & banking
    "touch n go scammer",
    "maybank scammer",
    "cimb scammer",
  ],

  // Open Graph defaults
  ogImage: `${SITE_URL}/og-image.png`,
  ogType: "website" as const,
  
  // Twitter defaults
  twitterCard: "summary_large_image" as const,
  twitterSite: "@scamguardmy", // Update if you have Twitter
  
  // Locale
  locale: "en_MY",
  alternateLocale: "ms_MY",
};

// Per-page SEO configurations
export const PAGE_SEO = {
  home: {
    title: "ScamGuard Malaysia - Free AI Scam Checker | Is This a Scammer?",
    description:
      "Free AI scam checker for Malaysia. Paste any phone number, email, or bank account - AI instantly checks if it's a scammer. No sign-up needed. Semak penipu dengan AI percuma.",
    keywords: [
      "ai scam checker malaysia",
      "is this a scammer",
      "check scammer malaysia", 
      "semak penipu ai",
      "free scam check",
      "ai scam detection",
    ],
  },
  search: {
    title: "AI Scam Checker - Paste Phone, Email, Bank Account | ScamGuard",
    description:
      "Paste any phone number, email, or bank account. Our AI instantly scans thousands of scam reports and tells you if it's suspicious. Free, no sign-up.",
    keywords: [
      "ai check scammer",
      "paste phone number scam check",
      "semak nombor penipu ai",
      "check email scammer",
      "bank account scammer check",
      "instant scam check",
    ],
  },
  submit: {
    title: "Report a Scammer - Submit Scam Report | ScamGuard Malaysia",
    description:
      "Report a scammer to help protect the Malaysian community. Submit phone numbers, emails, bank accounts of scammers. Your report helps prevent fraud.",
    keywords: [
      "report scammer malaysia",
      "lapor penipu",
      "submit scam report",
      "report fraud malaysia",
    ],
  },
  howItWorks: {
    title: "How ScamGuard Works - Scam Detection Explained | ScamGuard",
    description:
      "Learn how ScamGuard's community-driven scam detection works. AI-powered analysis, community reports, and privacy protection explained.",
    keywords: [
      "how scam check works",
      "scam detection malaysia",
      "community scam reporting",
    ],
  },
  disclaimer: {
    title: "Legal Disclaimer & Privacy Policy | ScamGuard Malaysia",
    description:
      "ScamGuard's legal disclaimer, privacy policy, and PDPA compliance information. Learn how we handle data and protect user privacy.",
    keywords: ["scamguard disclaimer", "privacy policy", "PDPA malaysia"],
  },
  dispute: {
    title: "Dispute a Report - Challenge False Scam Reports | ScamGuard",
    description:
      "Been falsely reported? Submit a dispute to challenge incorrect scam reports. Fair process to protect your reputation.",
    keywords: [
      "dispute scam report",
      "false scam report",
      "challenge scam accusation",
    ],
  },
  results: {
    title: "Scam Check Results | ScamGuard Malaysia",
    description:
      "View scam check results for reported phone numbers, emails, and accounts in Malaysia.",
    keywords: ["scam results", "scammer check results"],
  },
};

// JSON-LD Structured Data
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: SEO_CONFIG.defaultDescription,
    areaServed: {
      "@type": "Country",
      name: "Malaysia",
    },
    sameAs: [
      // Add social media URLs when available
      // "https://twitter.com/scamguardmy",
      // "https://facebook.com/scamguardmy",
    ],
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SEO_CONFIG.defaultDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: ["en-MY", "ms-MY"],
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
