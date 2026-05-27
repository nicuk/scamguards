import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  FileText,
  Search,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL, SITE_NAME } from "@/lib/seo-config";
import {
  buildCheckPath,
  canonicalizeIdentifier,
  checkTypeLabel,
  checkTypeToDataType,
  formatIdentifierDisplay,
  isCheckType,
  isValidCanonicalIdentifier,
  type CheckType,
} from "@/lib/utils/check-url";

export const revalidate = 3600;

interface CheckPageParams {
  type: string;
  id: string;
}

interface ReportRow {
  id: string;
  scam_type: string | null;
  description: string | null;
  platform: string | null;
  created_at: string;
  is_verified: boolean;
  is_disputed: boolean;
  status: string;
}

async function loadAggregate(type: CheckType, canonical: string) {
  const supabase = await createClient();
  const dbType = checkTypeToDataType(type);

  const { data, error } = await supabase
    .from("data_points")
    .select("id, type, value, normalized_value, reports(*)")
    .eq("type", dbType)
    .eq("normalized_value", canonical);

  if (error) {
    console.error("Check page query error:", error);
    return null;
  }

  const reports: ReportRow[] = [];
  const seen = new Set<string>();
  for (const row of (data || []) as Array<{ reports: ReportRow | ReportRow[] | null }>) {
    const r = row.reports;
    const list = Array.isArray(r) ? r : r ? [r] : [];
    for (const report of list) {
      if (!report || report.status !== "active") continue;
      if (seen.has(report.id)) continue;
      seen.add(report.id);
      reports.push(report);
    }
  }

  if (reports.length === 0) return null;

  reports.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const totalReports = reports.length;
  const verifiedCount = reports.filter((r) => r.is_verified).length;
  const disputedCount = reports.filter((r) => r.is_disputed).length;

  const heatLevel =
    totalReports >= 10
      ? "CRITICAL"
      : totalReports >= 5
      ? "HIGH"
      : totalReports >= 3
      ? "MEDIUM"
      : "LOW";

  const scamTypes = Array.from(
    new Set(reports.map((r) => r.scam_type).filter(Boolean) as string[])
  );

  const earliest = reports[reports.length - 1].created_at;
  const latest = reports[0].created_at;

  return {
    totalReports,
    verifiedCount,
    disputedCount,
    heatLevel,
    scamTypes,
    earliest,
    latest,
    reports,
  };
}

function parseAndValidate(params: CheckPageParams):
  | { ok: true; type: CheckType; canonical: string; rawId: string }
  | { ok: false } {
  const { type, id } = params;
  if (!isCheckType(type)) return { ok: false };
  const canonical = canonicalizeIdentifier(type, id);
  if (!isValidCanonicalIdentifier(type, canonical)) return { ok: false };
  return { ok: true, type, canonical, rawId: id };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<CheckPageParams>;
}): Promise<Metadata> {
  const resolved = await params;
  const parsed = parseAndValidate(resolved);
  if (!parsed.ok) {
    return {
      title: `Not Found | ${SITE_NAME}`,
      robots: { index: false, follow: false },
    };
  }

  const { type, canonical } = parsed;
  const display = formatIdentifierDisplay(type, canonical);
  const label = checkTypeLabel(type);
  const url = `${SITE_URL}${buildCheckPath(type, canonical)}`;

  const title = `Is ${display} a Scammer? — ${label} Reports | ${SITE_NAME}`;
  const description = `Check if ${display} has been reported as a scammer in Malaysia. Community-sourced reports, AI risk assessment, and official reporting channels (NSRC 997, PDRM).`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: SITE_NAME,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CheckPage({
  params,
}: {
  params: Promise<CheckPageParams>;
}) {
  const resolved = await params;
  const parsed = parseAndValidate(resolved);
  if (!parsed.ok) notFound();

  const { type, canonical, rawId } = parsed;

  // 308 redirect any non-canonical URL variant to the canonical form.
  // Next.js auto-decodes the dynamic segment, so we compare canonical to the
  // decoded rawId (not its encoded form) to avoid redirect loops on emails.
  let decodedRawId = rawId;
  try {
    decodedRawId = decodeURIComponent(rawId);
  } catch {
    /* keep rawId as-is */
  }
  if (decodedRawId !== canonical) {
    permanentRedirect(buildCheckPath(type, canonical));
  }

  const aggregate = await loadAggregate(type, canonical);
  if (!aggregate) notFound();

  const display = formatIdentifierDisplay(type, canonical);
  const label = checkTypeLabel(type);
  const pageUrl = `${SITE_URL}${buildCheckPath(type, canonical)}`;

  const heatColors: Record<string, string> = {
    CRITICAL: "bg-red-500/10 text-red-700 border-red-500/30",
    HIGH: "bg-orange-500/10 text-orange-700 border-orange-500/30",
    MEDIUM: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30",
    LOW: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Check a Scammer",
            item: `${SITE_URL}/search`,
          },
          { "@type": "ListItem", position: 3, name: display, item: pageUrl },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}/#webpage`,
        url: pageUrl,
        name: `Is ${display} a Scammer?`,
        description: `Community scam reports for ${display}.`,
        inLanguage: "en-MY",
        about: { "@type": "Thing", name: `${label}: ${display}` },
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/search" className="hover:text-primary">
          Check a Scammer
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{display}</span>
      </nav>

      <header className="mb-8">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wide ${heatColors[aggregate.heatLevel]}`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          {aggregate.heatLevel} risk
        </div>
        <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
          Is {display} a Scammer?
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {aggregate.totalReports === 1
            ? `This ${label.toLowerCase()} has been reported once in the ScamGuards Malaysia community database.`
            : `This ${label.toLowerCase()} has been reported ${aggregate.totalReports} times in the ScamGuards Malaysia community database.`}
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat label="Total Reports" value={aggregate.totalReports} />
        <Stat label="Verified" value={aggregate.verifiedCount} />
        <Stat label="Disputed" value={aggregate.disputedCount} />
        <Stat
          label="First Reported"
          value={new Date(aggregate.earliest).toLocaleDateString("en-MY", {
            year: "numeric",
            month: "short",
          })}
        />
      </section>

      {aggregate.scamTypes.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Reported Scam Types</h2>
          <div className="flex flex-wrap gap-2">
            {aggregate.scamTypes.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-sm"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Recent Reports</h2>
        <div className="space-y-3">
          {aggregate.reports.slice(0, 5).map((r) => (
            <article
              key={r.id}
              className="p-4 rounded-lg border bg-card text-card-foreground"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {r.scam_type || "Scam report"}
                </span>
                <time className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString("en-MY")}
                </time>
              </div>
              {r.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {r.description}
                </p>
              )}
              {r.is_verified && (
                <div className="mt-2 inline-flex items-center gap-1 text-xs text-green-700">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-muted/30 p-5 mb-8">
        <h2 className="text-lg font-semibold mb-2">
          Have you been contacted by this {label.toLowerCase()}?
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Add your report to help warn others. Takes 2 minutes, no sign-up.
          For urgent help, call the National Scam Response Centre at{" "}
          <strong>997</strong>.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
          >
            <FileText className="h-4 w-4 flex-shrink-0" />
            <span>Report this scammer</span>
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-md border bg-background hover:bg-accent text-sm font-medium"
          >
            <Search className="h-4 w-4 flex-shrink-0" />
            <span>Check another</span>
          </Link>
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        Disagree with a report?{" "}
        <Link href="/dispute" className="underline hover:text-primary">
          Submit a dispute
        </Link>
        . ScamGuards reports are community-sourced and not legal proof of
        fraud.
      </p>

      <div className="mt-8">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 flex-shrink-0" />
          <span>Back to search</span>
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
