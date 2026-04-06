import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getSupabaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_STORAGE_SUPABASE_URL ||
    process.env.STORAGE_SUPABASE_URL!
  );
}

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_STORAGE_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_STORAGE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.STORAGE_SUPABASE_PUBLISHABLE_KEY!;

  return createServerClient(getSupabaseUrl(), supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setAll(cookiesToSet: any[]) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cookiesToSet.forEach(({ name, value, options }: any) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}

/**
 * Server-only admin client that bypasses RLS.
 * Only use in API routes, never expose to the browser.
 */
export function createAdminClient() {
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.STORAGE_SUPABASE_SERVICE_ROLE_KEY!;

  return createSupabaseClient(getSupabaseUrl(), serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
