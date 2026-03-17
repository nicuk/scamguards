import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BLOG_POSTS } from "@/lib/blog-data";
import { SITE_URL, generateBreadcrumbSchema } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "Scam Prevention Blog - Guides & Tips | ScamGuards Malaysia",
  description:
    "Practical guides to protect yourself from scams in Malaysia. Learn how to spot fake sellers, what to do if scammed, and rules to stay safe online.",
  keywords: [
    "scam prevention malaysia",
    "how to avoid scams",
    "scam tips malaysia",
    "cara elak penipuan",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Scam Prevention Blog | ScamGuards Malaysia",
    description:
      "Practical guides to protect yourself from scams in Malaysia.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

function BlogJsonLd() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
  ]);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

export default function BlogIndexPage() {
  return (
    <>
    <BlogJsonLd />
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Scam Prevention Guides
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Practical, no-nonsense guides to help Malaysians stay safe from
            fraud.
          </p>
        </div>

        <div className="space-y-6">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="py-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readingTime}</span>
                    <span className="mx-1">&middot;</span>
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("en-MY", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <h2 className="font-semibold text-xl mb-2">{post.title}</h2>
                  <p className="text-muted-foreground mb-3">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-primary font-medium text-sm">
                    Read more <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
