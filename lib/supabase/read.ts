import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-free anon client for public reads in server components. Reading
 * cookies via `cookies()` would opt the page out of static rendering, which is
 * the wrong trade for data every visitor sees identically (sponsor slots, site
 * activity counts).
 */
export function createReadClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_STORAGE_SUPABASE_URL ||
    process.env.STORAGE_SUPABASE_URL!;

  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_STORAGE_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_STORAGE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.STORAGE_SUPABASE_PUBLISHABLE_KEY!;

  return createSupabaseClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
