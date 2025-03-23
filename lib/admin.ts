import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isDevelopment } from "@/lib/utils"

// Admin email addresses
const ADMIN_EMAILS = ["vtu8022@gmail.com"]

// Check if the user has an admin record in the profiles table
async function checkAdminInProfiles(userId: string) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Error checking admin in profiles:", error)
      return false
    }

    return data?.is_admin === true
  } catch (error) {
    console.error("Exception in checkAdminInProfiles:", error)
    return false
  }
}

// Check if a user's email is in the admin list
function isAdminEmail(email: string | null | undefined) {
  if (!email) return false
  const isAdmin = ADMIN_EMAILS.includes(email)
  console.log(`Email ${email} admin status: ${isAdmin}`)
  return isAdmin
}

/**
 * Checks if the current user is an admin
 * Returns an object with authentication and authorization status
 */
export async function isAdmin() {
  try {
    // In development mode, bypass admin check
    if (isDevelopment()) {
      console.log("Bypassing admin check in development mode")
      return { isAuthenticated: true, isAuthorized: true }
    }

    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error("Auth error or no user:", userError)
      return { isAuthenticated: false, isAuthorized: false }
    }
    
    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()
    
    if (profileError) {
      console.error("Error fetching admin status:", profileError)
      return { isAuthenticated: true, isAuthorized: false }
    }
    
    return { 
      isAuthenticated: true, 
      isAuthorized: profile?.is_admin === true 
    }
  } catch (error) {
    console.error("Error in isAdmin check:", error)
    return { isAuthenticated: false, isAuthorized: false }
  }
}

/**
 * Middleware to require admin access for a route
 * Redirects to signin page if user is not authenticated or not an admin
 */
export async function requireAdmin() {
  const { isAuthenticated, isAuthorized } = await isAdmin()
  
  if (!isAuthenticated) {
    return redirect("/signin")
  }
  
  if (!isAuthorized) {
    return redirect("/unauthorized")
  }
}

