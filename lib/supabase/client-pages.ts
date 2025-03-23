import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Client-side Supabase client (safe for Pages directory)
export const createPagesClient = () => {
  return createClientComponentClient<Database>()
}

// Alias for compatibility
export const createClient = createPagesClient 