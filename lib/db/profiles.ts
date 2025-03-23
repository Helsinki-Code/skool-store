import { getSupabaseBrowserClient } from "@/lib/supabase"
import { getSupabaseServerClient } from "@/lib/supabase"
import type { Database } from "@/lib/supabase/database.types"

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]

// Server-side functions
export async function getProfileById(id: string) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching profile with id ${id}:`, error)
    throw error
  }

  return data
}

export async function updateProfile(id: string, updates: ProfileUpdate) {
  const supabase = getSupabaseServerClient()

  // Add updated_at timestamp
  const updatesWithTimestamp = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("profiles").update(updatesWithTimestamp).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating profile ${id}:`, error)
    throw error
  }

  return data
}

// Client-side functions
export function useProfile() {
  const supabase = getSupabaseBrowserClient()

  const getCurrentProfile = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

    if (error) {
      console.error("Error fetching current profile:", error)
      throw error
    }

    return data
  }

  const updateProfile = async (updates: ProfileUpdate) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      throw new Error("User not authenticated")
    }

    // Add updated_at timestamp
    const updatesWithTimestamp = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updatesWithTimestamp)
      .eq("id", session.user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating profile:", error)
      throw error
    }

    return data
  }

  return {
    getCurrentProfile,
    updateProfile,
  }
}

