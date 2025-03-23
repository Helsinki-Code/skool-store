import type { Metadata } from "next"
import { redirect } from "next/navigation"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import AccountDashboard from "@/components/account/account-dashboard"
import { getSupabaseServerClient } from "@/lib/supabase"
import { getProfileById } from "@/lib/db/profiles"
import { getUserProducts } from "@/lib/db/user-products"
import { getOrdersByUserId } from "@/lib/db/orders"

export const metadata: Metadata = {
  title: "Account Dashboard | Skool Growth Products",
  description: "Manage your account and view your purchased products",
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
  const profile = await getProfileById(session.user.id)

  // Get user's purchased products count
  const userProducts = await getUserProducts(session.user.id)
  const purchasesCount = userProducts.length

  // Get user's recent orders
  const orders = await getOrdersByUserId(session.user.id)
  const recentOrders = orders.slice(0, 3)

  return {
    user: session.user,
    profile,
    purchasesCount,
    recentOrders,
  }
}

export default async function AccountPage() {
  const userData = await getUserData()

  if (!userData) {
    redirect("/sign-in?redirect=/account")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <AccountDashboard userData={userData} />
      </main>
      <Footer />
    </div>
  )
}

