import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a single supabase client for the browser
export function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Browser Supabase environment variables are missing")
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Create a server client (to be used in Server Components and Server Actions)
export function getSupabaseServerClient() {
  // Use NEXT_PUBLIC variables for server-side as well since that's what we have
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Server Supabase environment variables are missing")
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })
}

