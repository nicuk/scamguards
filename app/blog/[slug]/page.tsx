import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft, Search, FileText } from "lucide-react";
import { BLOG_POSTS, getBlogBySlug, getAllBlogSlugs } from "@/lib/blog-data";
import { SITE_URL, generatePageGraphSchema, generateArticleSchema, generateBreadcrumbSchema } from "@/lib/seo-config";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getBlogBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogBySlug(params.slug);
  if (!post) notFound();

  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: post.title, url: postUrl },
  ]);
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.metaDescription,
    url: postUrl,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
  });
  const pageGraph = generatePageGraphSchema(
    postUrl,
    post.title,
    post.metaDescription,
    [breadcrumbSchema, articleSchema]
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageGraph) }}
      />

      <article className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary">Blog</Link>
            <span>/</span>
            <span className="text-foreground truncate">{post.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime}</span>
              <span>&middot;</span>
              <time dateTime={post.updatedAt}>
                Updated{" "}
                {new Date(post.updatedAt).toLocaleDateString("en-MY", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground">{post.excerpt}</p>
          </header>

          {/* Content */}
          <div className="space-y-10">
            {post.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-2xl font-bold mb-4">{section.heading}</h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {section.content.split("\n\n").map((paragraph, j) => (
                    <p
                      key={j}
                      className="text-muted-foreground leading-relaxed mb-4"
                      dangerouslySetInnerHTML={{
                        __html: paragraph
                          .replace(
                            /\*\*(.*?)\*\*/g,
                            '<strong class="text-foreground">$1</strong>'
                          ),
                      }}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-xl font-bold mb-4">Take Action</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href="/search"
                className="flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
              >
                <Search className="h-5 w-5" />
                Check Someone Now
              </Link>
              <Link
                href="/submit"
                className="flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-input bg-background font-semibold hover:bg-accent hover:text-accent-foreground transition-all"
              >
                <FileText className="h-5 w-5" />
                Report a Scammer
              </Link>
            </div>
          </div>

          {/* Other posts */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-xl font-bold mb-4">More Guides</h3>
            <div className="space-y-3">
              {BLOG_POSTS.filter((p) => p.slug !== post.slug).map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <h4 className="font-medium mb-1">{p.title}</h4>
                  <p className="text-sm text-muted-foreground">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
