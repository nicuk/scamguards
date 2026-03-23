export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://scamguards.app";
export const SITE_NAME = "ScamGuards Malaysia";

export const SEO_CONFIG = {
  siteName: SITE_NAME,
  siteUrl: SITE_URL,
  defaultTitle: "ScamGuards Malaysia - AI Scam Checker | Check Scammers Free",
  defaultDescription:
    "Free AI-powered scam detection for Malaysia. Instantly check if phone numbers, emails, or bank accounts are scammers. Paste any detail, AI checks thousands of reports. Semak penipu dengan AI.",

  keywords: [
    "ai scam checker",
    "ai scam detection malaysia",
    "ai check scammer",
    "how to check malaysian scammer with ai",
    "how to check if someone is a scammer malaysia",
    "scam checker ai free",
    "how to report scammer malaysia",
    "report scammer malaysia",
    "scam database malaysia",
    "malaysia scam database",
    "malaysian scammer database",
    "scam check malaysia",
    "check scammer malaysia",
    "is this a scammer",
    "phone scam check",
    "scammer phone number malaysia",
    "semak penipu malaysia",
    "ai semak penipu",
    "lapor penipu",
    "nombor telefon penipu",
    "semak nombor scammer",
    "ini penipu ke",
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
    "touch n go scammer",
    "maybank scammer",
    "cimb scammer",
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
    title: "ScamGuards Malaysia - Free AI Scam Checker | Is This a Scammer?",
    description:
      "Free AI scam checker for Malaysia. Paste any phone number, email, or bank account - AI instantly checks if it's a scammer. No sign-up needed. Semak penipu dengan AI percuma.",
    keywords: [
      "ai scam checker malaysia",
      "is this a scammer",
      "check scammer malaysia",
      "how to report scammer malaysia",
      "semak penipu ai",
      "free scam check",
      "ai scam detection",
      "scam database malaysia",
    ],
  },
  search: {
    title: "AI Scam Checker Malaysia - Check Phone, Email, Bank Account Free | ScamGuards",
    description:
      "How to check if someone is a scammer in Malaysia — paste any phone number, email, or bank account. Our AI instantly scans a crowdsourced Malaysian scammer database and returns a risk score. Free, no sign-up.",
    keywords: [
      "how to check malaysian scammer with ai",
      "how to check if someone is a scammer malaysia",
      "malaysia scammer check",
      "malaysia scam database",
      "malaysian scammer database",
      "check scammer bank account malaysia",
      "scammer numbers malaysia check",
      "whatsapp scammer malaysia",
      "ai check scammer",
      "paste phone number scam check",
      "semak nombor penipu ai",
      "check email scammer",
      "bank account scammer check",
      "instant scam check",
    ],
  },
  submit: {
    title: "Report a Scammer in Malaysia - Free Scam Reporting | ScamGuards",
    description:
      "Report a scammer in Malaysia for free. Submit phone numbers, emails, bank accounts. Paste your whole scam story — AI extracts the details. Protect others from the same fraud.",
    keywords: [
      "report scammer malaysia",
      "report scammer phone number malaysia",
      "report scammer bank account malaysia",
      "how to report scammer",
      "how to report scammer in malaysia",
      "report online scammer malaysia",
      "cara report scammer",
      "cara report akaun bank scammer",
      "lapor penipu malaysia",
      "submit scam report",
      "report fraud malaysia",
      "report online scam malaysia",
    ],
  },
  howItWorks: {
    title: "How to Check & Report Scammers in Malaysia | ScamGuards",
    description:
      "Learn how to check if someone is a scammer and how to report scammers in Malaysia. AI-powered detection, community reports, and privacy protection.",
    keywords: [
      "how to check scammer malaysia",
      "how to report scammer malaysia",
      "scam detection malaysia",
      "community scam reporting",
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
