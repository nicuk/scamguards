export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://scamguards.app";
export const SITE_NAME = "ScamGuards Malaysia";

export const SEO_CONFIG = {
  siteName: SITE_NAME,
  siteUrl: SITE_URL,
  defaultTitle: "Scam Malaysia? Check Scammer Phone Numbers & Bank Accounts Free | ScamGuards",
  defaultDescription:
    "Semak nombor telefon scammer & check bank account before you transfer. Paste any phone number, email, or akaun bank — instantly see if it's been reported. Free, no sign-up. AI-powered scam detection for Malaysia.",

  keywords: [
    // 1K-10K volume (Google Ads data) — primary targets
    "scam malaysia",
    "semak nombor telefon scammer",
    "semak no telefon scammer",
    "check scammer phone number malaysia",
    "check scammer online malaysia",
    "semak scammer online",
    "semak akaun bank scammer",
    "semak mule",

    // 100-1K volume — strong secondary
    "report scammer malaysia",
    "how to report scammer malaysia",
    "cara report scammer",
    "cara report akaun bank scammer",
    "check scammer bank account malaysia",
    "lapor scammer malaysia",
    "love scam malaysia",
    "semak nombor akaun penipu",

    // Intent-match + BM conversational
    "how to check if someone is a scammer malaysia",
    "semak penipu malaysia",
    "ini penipu ke",
    "nombor telefon penipu",
    "lapor penipu",
    "scam database malaysia",

    // AI branding (low volume but brand moat)
    "ai scam checker",
    "ai scam checker malaysia",

    // Long-tail scam types (blog/content support)
    "carousell scammer malaysia",
    "telegram scammer malaysia",
    "macau scam malaysia",
    "investment scam malaysia",
    "gold scammer malaysia",
    "tcg scammer malaysia",
    "one piece card scammer",
  ],

  ogImage: `${SITE_URL}/og-image.png`,
  ogType: "website" as const,
  twitterCard: "summary_large_image" as const,
  twitterSite: "@scamguardmy",
  locale: "en_MY",
  alternateLocale: "ms_MY",
};

export const PAGE_SEO = {
  home: {
    title: "Scam Malaysia? Check Scammer Phone Numbers & Bank Accounts Free | ScamGuards",
    description:
      "Semak nombor telefon scammer & check bank account sebelum transfer. Paste any phone number, email, or akaun bank — instantly see if reported as scam. Free, no sign-up. AI-powered.",
    keywords: [
      "scam malaysia",
      "check scammer phone number malaysia",
      "semak nombor telefon scammer",
      "semak akaun bank scammer",
      "check scammer online malaysia",
      "report scammer malaysia",
      "scam database malaysia",
      "semak scammer online",
    ],
  },
  search: {
    title: "Semak Nombor Telefon Scammer & Check Bank Account Malaysia | ScamGuards",
    description:
      "Check scammer phone number Malaysia — paste any nombor telefon, email, or akaun bank to see if it's been reported. AI scans thousands of reports instantly. Free, no sign-up. Semak scammer online.",
    keywords: [
      "semak nombor telefon scammer",
      "semak no telefon scammer",
      "check scammer phone number malaysia",
      "semak akaun bank scammer",
      "check scammer bank account malaysia",
      "semak scammer online",
      "check scammer online malaysia",
      "how to check if someone is a scammer malaysia",
      "semak nombor akaun penipu",
      "scam database malaysia",
    ],
  },
  submit: {
    title: "Report Scammer Malaysia - Lapor Scammer Phone Number & Bank Account | ScamGuards",
    description:
      "Report scammer Malaysia — just paste the phone number, bank account, or your whole chat conversation. AI automatically extracts all details. No manual forms. Cara report scammer percuma.",
    keywords: [
      "report scammer malaysia",
      "lapor scammer malaysia",
      "how to report scammer malaysia",
      "cara report scammer",
      "cara report akaun bank scammer",
      "report scammer phone number malaysia",
      "report scammer bank account malaysia",
      "report online scam malaysia",
      "cara buat laporan polis scam",
      "lapor penipu malaysia",
    ],
  },
  howItWorks: {
    title: "How to Check & Report Scammers in Malaysia (SemakMule, NSRC 997, ScamGuards)",
    description:
      "Step-by-step: how to check scammer phone numbers via Semak Mule, report to NSRC 997, and use ScamGuards' AI to verify suspicious contacts. Cara semak dan lapor scammer Malaysia.",
    keywords: [
      "how to check scammer malaysia",
      "how to report scammer malaysia",
      "semak mule",
      "NSRC 997",
      "cara report scam online malaysia",
      "nombor hotline scam malaysia",
      "scam detection malaysia",
    ],
  },
  disclaimer: {
    title: "Legal Disclaimer & Privacy Policy | ScamGuards Malaysia",
    description:
      "ScamGuards's legal disclaimer, privacy policy, and PDPA compliance information. Learn how we handle data and protect user privacy.",
    keywords: ["scamguard disclaimer", "privacy policy", "PDPA malaysia"],
  },
  dispute: {
    title: "Dispute a Report - Challenge False Scam Reports | ScamGuards",
    description:
      "Been falsely reported? Submit a dispute to challenge incorrect scam reports. Fair process to protect your reputation.",
    keywords: [
      "dispute scam report",
      "false scam report",
      "challenge scam accusation",
    ],
  },
  results: {
    title: "Scam Check Results | ScamGuards Malaysia",
    description:
      "View scam check results for reported phone numbers, emails, and accounts in Malaysia.",
    keywords: ["scam results", "scammer check results"],
  },
};

// --- @graph-based JSON-LD generators ---

const ORG_ID = `${SITE_URL}/#org`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const WEBAPP_ID = `${SITE_URL}/#webapp`;

export function generateRootGraphSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/icon.svg`,
        },
        description: SEO_CONFIG.defaultDescription,
        areaServed: { "@type": "Country", name: "Malaysia" },
        sameAs: [
          "https://www.facebook.com/profile.php?id=61587108193943",
          "https://github.com/nicuk/scamguards",
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        url: SITE_URL,
        description: SEO_CONFIG.defaultDescription,
        publisher: { "@id": ORG_ID },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
        inLanguage: ["en-MY", "ms-MY"],
      },
      {
        "@type": "WebApplication",
        "@id": WEBAPP_ID,
        name: SITE_NAME,
        url: SITE_URL,
        applicationCategory: "SecurityApplication",
        applicationSubCategory: "Scam Detection",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        description: SEO_CONFIG.defaultDescription,
        inLanguage: ["en-MY", "ms-MY"],
        isAccessibleForFree: true,
        publisher: { "@id": ORG_ID },
        offers: {
          "@type": "Offer",
          price: 0,
          priceCurrency: "MYR",
          availability: "https://schema.org/InStock",
        },
        featureList: [
          "AI-powered scam phone number checker",
          "Bank account scam database lookup",
          "Email and WhatsApp scammer verification",
          "Community-sourced scam reports",
          "Bilingual support (English & Bahasa Malaysia)",
        ],
        audience: { "@type": "Audience", geographicArea: { "@type": "Country", name: "Malaysia" } },
      },
    ],
  };
}

export function generatePageGraphSchema(
  pageUrl: string,
  pageName: string,
  pageDescription: string,
  extras: Record<string, unknown>[] = []
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}/#webpage`,
        url: pageUrl,
        name: pageName,
        description: pageDescription,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
        inLanguage: "en-MY",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "#faq", "#how-it-works", ".tldr"],
        },
      },
      ...extras,
    ],
  };
}

export function generateArticleSchema(post: {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  updatedAt: string;
}) {
  return {
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@id": ORG_ID },
    publisher: {
      "@id": ORG_ID,
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${post.url}/#webpage` },
    isPartOf: { "@id": WEBSITE_ID },
    image: {
      "@type": "ImageObject",
      url: `${post.url}/opengraph-image`,
      width: 1200,
      height: 630,
    },
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
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
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateItemListSchema(
  items: { name: string; url: string; position: number }[]
) {
  return {
    "@type": "ItemList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}
