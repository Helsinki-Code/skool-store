import { getSupabaseBrowserClient } from "@/lib/supabase"
import { getSupabaseServerClient } from "@/lib/supabase"
import type { Database } from "@/lib/supabase/database.types"

export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"]
export type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"]

// Server-side functions
export async function getCategories() {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching categories:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getCategories:", error)
    return []
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single()

    if (error) {
      console.error(`Error fetching category with slug ${slug}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Error in getCategoryBySlug:`, error)
    return null
  }
}

export async function getCategoryById(id: string) {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("categories").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching category with id ${id}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Error in getCategoryById:`, error)
    return null
  }
}

export async function createCategory(category: CategoryInsert) {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("categories").insert(category).select().single()

    if (error) {
      console.error("Error creating category:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in createCategory:", error)
    return null
  }
}

export async function updateCategory(id: string, updates: CategoryUpdate) {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single()

    if (error) {
      console.error(`Error updating category ${id}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Error in updateCategory:`, error)
    return null
  }
}

export async function deleteCategory(id: string) {
  try {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting category ${id}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error in deleteCategory:`, error)
    return false
  }
}

// Client-side functions
export function useCategories() {
  const supabase = getSupabaseBrowserClient()

  const getAll = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

      if (error) {
        console.error("Error fetching categories:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getAll (useCategories):", error)
      return []
    }
  }

  const getBySlug = async (slug: string) => {
    try {
      const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single()

      if (error) {
        console.error(`Error fetching category with slug ${slug}:`, error)
        return null
      }

      return data
    } catch (error) {
      console.error(`Error in getBySlug (useCategories):`, error)
      return null
    }
  }

  return {
    getAll,
    getBySlug,
  }
}

