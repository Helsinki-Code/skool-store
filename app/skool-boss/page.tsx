import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AdminDashboardContent } from "@/components/admin/admin-dashboard-content"
import { getSupabaseServerClient } from "@/lib/supabase"

// Function to check if we're in development mode
const isDevelopment = () => process.env.NODE_ENV === "development"

// Special Admin Dashboard Page at /skool-boss
export default async function SkoolBossPage() {
  try {
    // In development mode, skip authentication checks
    if (isDevelopment()) {
      console.log("DEVELOPMENT MODE: Bypassing auth check for skool-boss page")
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Skool Boss Dashboard"
            text="Manage your store settings, products, orders, and customers."
          />
          <AdminDashboardContent />
        </DashboardShell>
      )
    }

    // In production, check if user is authenticated and is admin
    const supabase = getSupabaseServerClient()
    const { data } = await supabase.auth.getSession()
    
    if (!data.session) {
      console.log("No session found, redirecting to sign-in")
      return redirect("/skool-boss/sign-in")
    }

    // Check if user email is vtu8022@gmail.com (hardcoded admin)
    if (data.session.user.email !== "vtu8022@gmail.com") {
      console.log("User is not an authorized admin")
      return redirect("/skool-boss/sign-in?error=unauthorized")
    }
    
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Skool Boss Dashboard"
          text="Manage your store settings, products, orders, and customers."
        />
        <AdminDashboardContent />
      </DashboardShell>
    )
  } catch (error) {
    console.error("Error in skool-boss dashboard page:", error)
    
    // In development mode, show the dashboard even if there's an error
    if (isDevelopment()) {
      console.log("DEVELOPMENT MODE: Showing dashboard despite error")
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Skool Boss Dashboard"
            text="Manage your store settings, products, orders, and customers."
          />
          <AdminDashboardContent />
        </DashboardShell>
      )
    }
    
    return redirect("/skool-boss/sign-in?error=dashboard-error")
  }
} 