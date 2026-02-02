import { Metadata } from "next";
import { PAGE_SEO, SITE_URL } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: PAGE_SEO.results.title,
  description: PAGE_SEO.results.description,
  keywords: PAGE_SEO.results.keywords,
  // Don't index result pages - they contain dynamic user-specific content
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
