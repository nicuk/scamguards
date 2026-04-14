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
  generateRootGraphSchema,
} from "@/lib/seo-config";
import { GoogleAnalytics } from "@/components/analytics";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: {
    default: SEO_CONFIG.defaultTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: SEO_CONFIG.defaultDescription,
  keywords: SEO_CONFIG.keywords,

  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },

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

  openGraph: {
    type: "website",
    locale: "en_MY",
    alternateLocale: "ms_MY",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
  },

  twitter: {
    card: "summary_large_image",
    site: "@scamguardmy",
    creator: "@scamguardmy",
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
  },

  manifest: "/manifest.json",

  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : {},
  },

  applicationName: SITE_NAME,
  creator: "ScamGuards Malaysia",
  publisher: "ScamGuards Malaysia",
  category: "Security",

  formatDetection: {
    telephone: false,
  },
};

function JsonLd() {
  const graphSchema = generateRootGraphSchema();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphSchema) }}
    />
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta name="geo.region" content="MY" />
        <meta name="geo.placename" content="Malaysia" />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        <link rel="alternate" type="text/plain" href={`${SITE_URL}/llms.txt`} title="LLM site info" />
        <link rel="alternate" type="application/rss+xml" title="ScamGuards Malaysia" href={`${SITE_URL}/feed.xml`} />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <Analytics />
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
