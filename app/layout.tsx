import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LanguageProvider } from "@/lib/language-context";
import {
  SEO_CONFIG,
  SITE_URL,
  SITE_NAME,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/seo-config";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: SEO_CONFIG.defaultTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: SEO_CONFIG.defaultDescription,
  keywords: SEO_CONFIG.keywords,

  // Canonical & base URL
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    languages: {
      "en-MY": "/",
      "ms-MY": "/",
    },
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_MY",
    alternateLocale: "ms_MY",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    // Images are auto-generated via opengraph-image.tsx
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@scamguardmy",
    creator: "@scamguardmy",
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    // Images are auto-generated via twitter-image.tsx
  },

  // Icons are auto-generated via icon.tsx and apple-icon.tsx

  // Manifest
  manifest: "/manifest.json",

  // Verification (add your IDs when you have them)
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
    // yandex: "",
    // bing: "",
  },

  // App info
  applicationName: SITE_NAME,
  creator: "ScamGuard Malaysia",
  publisher: "ScamGuard Malaysia",
  category: "Security",

  // Other
  formatDetection: {
    telephone: false, // Prevent phone number detection styling
  },
};

// JSON-LD Structured Data Component
function JsonLd() {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <JsonLd />
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Geo targeting for Malaysia */}
        <meta name="geo.region" content="MY" />
        <meta name="geo.placename" content="Malaysia" />
        {/* Language alternatives */}
        <link rel="alternate" hrefLang="en-MY" href={SITE_URL} />
        <link rel="alternate" hrefLang="ms-MY" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
