import { Metadata } from "next";
import { SearchForm } from "@/components/search/search-form";
import { Shield } from "lucide-react";
import { PAGE_SEO, SITE_URL, generateBreadcrumbSchema } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: PAGE_SEO.search.title,
  description: PAGE_SEO.search.description,
  keywords: PAGE_SEO.search.keywords,
  alternates: {
    canonical: `${SITE_URL}/search`,
  },
  openGraph: {
    title: PAGE_SEO.search.title,
    description: PAGE_SEO.search.description,
    url: `${SITE_URL}/search`,
    type: "website",
  },
  twitter: {
    title: PAGE_SEO.search.title,
    description: PAGE_SEO.search.description,
  },
};

function BreadcrumbJsonLd() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Check Scammer", url: `${SITE_URL}/search` },
  ]);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

export default function SearchPage() {
  return (
    <>
      <BreadcrumbJsonLd />
      <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Is This Person a Scammer?</h1>
          <p className="text-muted-foreground">
            Got a suspicious number, email, or bank account? See if anyone has already reported it.
          </p>
        </div>

        {/* Search Form */}
        <SearchForm />
      </div>
    </div>
    </>
  );
}
