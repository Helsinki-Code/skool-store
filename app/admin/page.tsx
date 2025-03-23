import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AdminDashboardContent } from "@/components/admin/admin-dashboard-content"
import { requireAdmin } from "@/lib/admin"

// Admin Dashboard Page
export default async function AdminDashboardPage() {
  try {
    // This will redirect if the user is not an admin
    console.log("Checking admin status in dashboard page...")
    await requireAdmin()
    console.log("Admin check passed!")
    
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Admin Dashboard"
          text="Manage your store settings, products, orders, and customers."
        />
        <AdminDashboardContent />
      </DashboardShell>
    )
  } catch (error) {
    console.error("Error in admin dashboard page:", error)
    // Redirect to sign-in on any error
    redirect("/sign-in?error=admin-dashboard-error")
  }
}

