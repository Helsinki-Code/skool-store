import { getSupabaseBrowserClient } from "@/lib/supabase"
import { getSupabaseServerClient } from "@/lib/supabase"
import type { Database } from "@/lib/supabase/database.types"

export type UserProduct = Database["public"]["Tables"]["user_products"]["Row"]
export type UserProductInsert = Database["public"]["Tables"]["user_products"]["Insert"]

// Server-side functions
export async function getUserProducts(userId: string) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("user_products")
    .select(`
      *,
      products (*),
      orders (*)
    `)
    .eq("user_id", userId)
    .order("purchased_at", { ascending: false })

  if (error) {
    console.error(`Error fetching user products for user ${userId}:`, error)
    throw error
  }

  return data || []
}

export async function checkUserOwnsProduct(userId: string, productId: string) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("user_products")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is the error code for "no rows returned"
    console.error(`Error checking if user ${userId} owns product ${productId}:`, error)
    throw error
  }

  return !!data
}

export async function addUserProduct(userProduct: UserProductInsert) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("user_products")
    .upsert(userProduct) // Use upsert to avoid duplicates
    .select()
    .single()

  if (error) {
    console.error("Error adding user product:", error)
    throw error
  }

  return data
}

// Client-side functions
export function useUserProducts() {
  const supabase = getSupabaseBrowserClient()

  const getUserProducts = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("user_products")
      .select(`
        *,
        products (*),
        orders (*)
      `)
      .eq("user_id", session.user.id)
      .order("purchased_at", { ascending: false })

    if (error) {
      console.error("Error fetching user products:", error)
      throw error
    }

    return data || []
  }

  const checkProductAccess = async (productId: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return false
    }

    const { data, error } = await supabase
      .from("user_products")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("product_id", productId)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      console.error(`Error checking access to product ${productId}:`, error)
      throw error
    }

    return !!data
  }

  return {
    getUserProducts,
    checkProductAccess,
  }
}

