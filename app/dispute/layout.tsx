import { Metadata } from "next";
import { PAGE_SEO, SITE_URL } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: PAGE_SEO.dispute.title,
  description: PAGE_SEO.dispute.description,
  keywords: PAGE_SEO.dispute.keywords,
  alternates: {
    canonical: `${SITE_URL}/dispute`,
  },
  openGraph: {
    title: PAGE_SEO.dispute.title,
    description: PAGE_SEO.dispute.description,
    url: `${SITE_URL}/dispute`,
    type: "website",
  },
  twitter: {
    title: PAGE_SEO.dispute.title,
    description: PAGE_SEO.dispute.description,
  },
};

export default function DisputeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
