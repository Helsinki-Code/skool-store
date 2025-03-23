import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

// Create a client for Server Components (app directory)
export async function getSupabaseServerClient() {
  try {
    const cookieStore = cookies()
    return createServerComponentClient<Database>({ cookies: () => cookieStore })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    // Return a minimal client that won't break the build
    return null
  }
}

// For compatibility with both app and pages router
export const createClient = () => {
  try {
    const cookieStore = cookies()
    return createServerComponentClient<Database>({ cookies: () => cookieStore })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    // Return a minimal client that won't break the build
    return null
  }
}

