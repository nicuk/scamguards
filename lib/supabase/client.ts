import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Support both standard names and Vercel's STORAGE_ prefix
  const supabaseUrl = 
    process.env.NEXT_PUBLIC_SUPABASE_URL || 
    process.env.NEXT_PUBLIC_STORAGE_SUPABASE_URL!;
  
  const supabaseAnonKey = 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
    process.env.NEXT_PUBLIC_STORAGE_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_STORAGE_SUPABASE_PUBLISHABLE_KEY!;

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
}
