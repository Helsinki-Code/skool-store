import { getSupabaseBrowserClient } from "@/lib/supabase"
import { getSupabaseServerClient } from "@/lib/supabase"
import type { Database } from "@/lib/supabase/database.types"

export type Product = Database["public"]["Tables"]["products"]["Row"]
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"]

// Server-side functions
export async function getProducts() {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getProducts:", error)
    return []
  }
}

export async function getProductBySlug(slug: string) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.from("products").select("*, categories(*)").eq("slug", slug).single()

  if (error) {
    console.error(`Error fetching product with slug ${slug}:`, error)
    throw error
  }

  return data
}

export async function getProductById(id: string) {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching product:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getProductById:", error)
    return null
  }
}

export async function getFeaturedProducts() {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching featured products:", error)
    throw error
  }

  return data || []
}

export async function getProductsByCategory(categoryId: string) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error)
    throw error
  }

  return data || []
}

export async function createProduct(product: ProductInsert) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.from("products").insert(product).select().single()

  if (error) {
    console.error("Error creating product:", error)
    throw error
  }

  return data
}

export async function updateProduct(id: string, updates: ProductUpdate) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating product ${id}:`, error)
    throw error
  }

  return data
}

export async function deleteProduct(id: string) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting product ${id}:`, error)
    throw error
  }

  return true
}

// Client-side functions
export function useProducts() {
  const supabase = getSupabaseBrowserClient()

  const getAll = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      throw error
    }

    return data || []
  }

  const getBySlug = async (slug: string) => {
    const { data, error } = await supabase.from("products").select("*, categories(*)").eq("slug", slug).single()

    if (error) {
      console.error(`Error fetching product with slug ${slug}:`, error)
      throw error
    }

    return data
  }

  const getById = async (id: string) => {
    const { data, error } = await supabase.from("products").select("*, categories(*)").eq("id", id).single()

    if (error) {
      console.error(`Error fetching product with id ${id}:`, error)
      throw error
    }

    return data
  }

  return {
    getAll,
    getBySlug,
    getById,
  }
}

