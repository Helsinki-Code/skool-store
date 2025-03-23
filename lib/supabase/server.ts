import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

// Create an async version of the client that properly awaits cookies
export async function getSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

// Legacy function - use getSupabaseServerClient() for new code
export const createClient = () => {
  const cookieStore = cookies()
  console.warn('Warning: Using createClient() without awaiting cookies. Consider using getSupabaseServerClient() instead.')
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

