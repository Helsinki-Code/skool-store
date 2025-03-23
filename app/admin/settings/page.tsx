import { getSupabaseServerClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/admin"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AdminSettings } from "@/components/admin/admin-settings"

export default async function SettingsPage() {
  try {
    // Check if user is admin
    await requireAdmin()
    
    // Get current store settings from database
    const supabase = getSupabaseServerClient()
    const { data: storeSettings, error } = await supabase
      .from("store_settings")
      .select("*")
      .eq("id", "default")
      .single()
    
    if (error && error.code !== "PGRST116") {
      console.error("Error fetching store settings:", error)
    }
    
    // If no settings exist, use defaults
    const settings = storeSettings || {
      id: "default",
      store_name: "Skool Store",
      store_description: "The ultimate online store for educational products",
      contact_email: "contact@skoolstore.com",
      support_phone: "+1 (555) 123-4567",
      business_address: "123 Education Way, Learning City, ED 12345",
      currency: "USD",
      tax_rate: 8.5,
      shipping_fee: 5.99,
      free_shipping_threshold: 50,
      enable_user_reviews: true,
      enable_wishlist: true,
      maintenance_mode: false,
      social_media: {
        facebook: "https://facebook.com/skoolstore",
        twitter: "https://twitter.com/skoolstore",
        instagram: "https://instagram.com/skoolstore"
      }
    }
    
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Store Settings"
          text="Manage your store configuration and preferences."
        />
        <AdminSettings initialSettings={settings} />
      </DashboardShell>
    )
  } catch (error) {
    console.error("Error in settings page:", error)
    return redirect("/admin?error=settings-error")
  }
} 