import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-data";
import { BM_BLOG_SLUGS } from "@/lib/internal-links";

// Plain links to every guide, so each one sits a single click from the
// homepage rather than only behind /blog.
export function GuidesSection() {
  const english = BLOG_POSTS.filter((p) => !BM_BLOG_SLUGS.has(p.slug));
  const malay = BLOG_POSTS.filter((p) => BM_BLOG_SLUGS.has(p.slug));

  return (
    <section className="py-20 bg-background border-t">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Scam Guides for Malaysians</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Step-by-step help to check a number, report a scammer, and act fast if
            you have already been scammed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <GuideList heading="English guides" posts={english} />
          <GuideList heading="Panduan Bahasa Melayu" posts={malay} />
        </div>

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            All guides
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function GuideList({
  heading,
  posts,
}: {
  heading: string;
  posts: typeof BLOG_POSTS;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4 flex items-center gap-2">
        <BookOpen className="h-4 w-4" />
        {heading}
      </h3>
      <ul className="divide-y border-y">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="flex items-center gap-3 py-3 text-sm font-medium hover:text-primary transition-colors"
            >
              <span className="flex-1">{p.title}</span>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
