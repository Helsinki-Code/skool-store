import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import AccountSettings from "@/components/account/account-settings"

export const metadata: Metadata = {
  title: "Account Settings | Skool Growth Products",
  description: "Manage your account settings and preferences",
}

async function getUserData() {
  const supabase = getSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return null
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return {
    user: session.user,
    profile,
  }
}

export default async function SettingsPage() {
  const userData = await getUserData()

  if (!userData) {
    redirect("/sign-in?redirect=/account/settings")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <AccountSettings userData={userData} />
      </main>
      <Footer />
    </div>
  )
}

