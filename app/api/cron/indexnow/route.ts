import { NextResponse } from "next/server";
import sitemap from "@/app/sitemap";
import { BLOG_POSTS } from "@/lib/blog-data";
import { submitToIndexNow } from "@/lib/indexnow";
import { SITE_URL } from "@/lib/seo-config";
import { createAdminClient } from "@/lib/supabase/server";

// Daily IndexNow ping (scheduled in vercel.json). Submits only what the engines
// have not been told about yet: URLs new to the sitemap (a published post, a
// new /check page) and blog posts whose updatedAt changed. Resubmitting
// unchanged URLs every day is what IndexNow asks sites not to do.
//
// The sitemap is the source of truth, so anything that should be indexed is
// already listed there. indexnow_submissions remembers what was sent and at
// which version; a row is written only after the engine accepts the batch.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function versionOf(url: string): string {
  const post = BLOG_POSTS.find((p) => url === `${SITE_URL}/blog/${p.slug}`);
  return post ? post.updatedAt : "1";
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const current = (await sitemap()).map((entry) => ({
    url: entry.url,
    version: versionOf(entry.url),
  }));

  const supabase = createAdminClient();
  const { data: sent, error: readError } = await supabase
    .from("indexnow_submissions")
    .select("url, version");

  if (readError) {
    // Without the history every URL would look new; skip rather than resend all.
    console.error("[indexnow] could not read submission history:", readError.message);
    return NextResponse.json({ ok: false, reason: "history-unreadable" }, { status: 500 });
  }

  const sentVersion = new Map((sent ?? []).map((row) => [row.url, row.version]));
  const pending = current.filter((item) => sentVersion.get(item.url) !== item.version);

  if (pending.length === 0) {
    return NextResponse.json({ ok: true, submitted: 0 });
  }

  const result = await submitToIndexNow(pending.map((item) => item.url));
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, status: result.status, pending: pending.length },
      { status: 502 }
    );
  }

  const now = new Date().toISOString();
  const { error: writeError } = await supabase.from("indexnow_submissions").upsert(
    pending.map((item) => ({ url: item.url, version: item.version, submitted_at: now })),
    { onConflict: "url" }
  );
  if (writeError) {
    // Submitted but not recorded: tomorrow's run resends these, which is harmless.
    console.error("[indexnow] submitted but could not record:", writeError.message);
  }

  return NextResponse.json({
    ok: true,
    submitted: result.submitted,
    recorded: !writeError,
  });
}
