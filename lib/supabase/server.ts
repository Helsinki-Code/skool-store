import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Fallback client that works in both environments
const createFallbackClient = () => {
  return createClientComponentClient<Database>()
}

// Create a client for Server Components (app directory)
export async function getSupabaseServerClient() {
  try {
    // Dynamic import to prevent build errors
    const { cookies } = await import("next/headers")
    const cookieStore = cookies()
    return createServerComponentClient<Database>({ cookies: () => cookieStore })
  } catch (error) {
    console.error("Error creating Supabase server client:", error)
    // Fall back to client component client
    return createFallbackClient()
  }
}

// For compatibility with both app and pages router
export const createClient = () => {
  try {
    // Try server component approach
    const getClientPromise = getSupabaseServerClient()
    return getClientPromise
  } catch (error) {
    console.error("Error in createClient:", error)
    // Fall back to client component client
    return createFallbackClient()
  }
}

