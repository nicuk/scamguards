import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft, ArrowRight, Search, FileText } from "lucide-react";
import { BLOG_POSTS, getBlogBySlug, getAllBlogSlugs } from "@/lib/blog-data";
import { SCAM_TYPES } from "@/lib/scam-data";
import { getScamsForBlog } from "@/lib/internal-links";
import { SponsoredProjectsSection } from "@/components/home/sponsored-projects-section";
import { StepFlow } from "@/components/blog/step-flow";
import { ArticleFigures } from "@/components/blog/article-figures";
import { SITE_URL, generatePageGraphSchema, generateArticleSchema, generateBreadcrumbSchema } from "@/lib/seo-config";

/**
 * Inline formatting for authored article text: **bold** and [label](url).
 * Only site-relative and https URLs become links, so no other scheme (e.g.
 * javascript:) can ever render as one. External links open in a new tab.
 */
function renderInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
    .replace(/\[([^\]]+)\]\(((?:\/|https:\/\/)[^)\s]+)\)/g, (_match, label, href) => {
      const external = href.startsWith("https://");
      return `<a href="${href}" class="font-medium text-primary underline underline-offset-2 hover:no-underline"${
        external ? ' target="_blank" rel="noopener noreferrer"' : ""
      }>${label}</a>`;
    });
}

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

  const translation = post.translationSlug
    ? getBlogBySlug(post.translationSlug)
    : undefined;
  const url = (slug: string) => `${SITE_URL}/blog/${slug}`;
  const english = post.language === "ms" ? translation : post;
  const malay = post.language === "ms" ? post : translation;

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: {
      canonical: url(post.slug),
      // Only for a genuine translated pair, so each version points search
      // engines at its counterpart instead of competing with it
      ...(translation && english && malay
        ? {
            languages: {
              "en-MY": url(english.slug),
              "ms-MY": url(malay.slug),
              "x-default": url(english.slug),
            },
          }
        : {}),
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      locale: post.language === "ms" ? "ms_MY" : "en_MY",
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
  const relatedScams = getScamsForBlog(post.slug);
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
    ...(post.language ? { inLanguage: post.language === "ms" ? "ms-MY" : "en-MY" } : {}),
  });
  const translation = post.translationSlug
    ? getBlogBySlug(post.translationSlug)
    : undefined;
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

      <article
        className="container mx-auto px-4 py-12"
        lang={post.language === "ms" ? "ms-MY" : undefined}
      >
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
            {translation && (
              <Link
                href={`/blog/${translation.slug}`}
                hrefLang={translation.language === "ms" ? "ms-MY" : "en-MY"}
                lang={translation.language === "ms" ? "ms-MY" : "en-MY"}
                className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                {translation.language === "ms"
                  ? "Baca dalam Bahasa Melayu"
                  : "Read this guide in English"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </header>

          {/* First thing after the title: every reader sees it, including the
              majority who never scroll far into a long guide */}
          <SponsoredProjectsSection placement="inline" className="mb-10" />

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
                      dangerouslySetInnerHTML={{ __html: renderInline(paragraph) }}
                    />
                  ))}
                </div>
                {section.steps && (
                  <StepFlow steps={section.steps} label={section.stepsLabel} />
                )}
                {section.figures && <ArticleFigures figures={section.figures} />}
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

          {/* Scam type guides */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-xl font-bold mb-4">Scam Type Guides</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {(relatedScams.length > 0 ? relatedScams : SCAM_TYPES).map((s) => (
                <Link
                  key={s.slug}
                  href={`/scams/${s.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <span className="text-2xl">{s.heroEmoji}</span>
                  <span className="font-medium text-sm">{s.title} in Malaysia</span>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </Link>
              ))}
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
