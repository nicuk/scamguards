import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const SLUG_PATTERN = /^[a-z0-9-]{1,64}$/;

export async function POST(request: NextRequest) {
  try {
    const { slug } = (await request.json()) as { slug?: string };

    if (!slug || typeof slug !== "string" || !SLUG_PATTERN.test(slug)) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("increment_sponsor_click", {
      p_slug: slug,
    });

    if (error) {
      // A missing table or RPC is not the visitor's problem — swallow it
      // rather than surfacing an error on an outbound click.
      console.error("Sponsor click RPC error:", error);
      return NextResponse.json({ clickCount: null });
    }

    // The RPC increments and returns the new count, so any active sponsor
    // yields >= 1. Zero means no row matched the slug.
    if (data === 0) {
      return NextResponse.json({ error: "Unknown sponsor" }, { status: 404 });
    }

    return NextResponse.json({ clickCount: data });
  } catch (error) {
    console.error("Sponsor click API error:", error);
    return NextResponse.json({ clickCount: null });
  }
}
