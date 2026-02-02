import { Metadata } from "next";
import { PAGE_SEO, SITE_URL } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: PAGE_SEO.submit.title,
  description: PAGE_SEO.submit.description,
  keywords: PAGE_SEO.submit.keywords,
  alternates: {
    canonical: `${SITE_URL}/submit`,
  },
  openGraph: {
    title: PAGE_SEO.submit.title,
    description: PAGE_SEO.submit.description,
    url: `${SITE_URL}/submit`,
    type: "website",
  },
  twitter: {
    title: PAGE_SEO.submit.title,
    description: PAGE_SEO.submit.description,
  },
};

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
