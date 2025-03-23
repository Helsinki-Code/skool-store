import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import UserPurchases from "@/components/account/user-purchases"

export const metadata: Metadata = {
  title: "My Purchases | Skool Growth Products",
  description: "View and download your purchased products",
}

async function getUserPurchases() {
  const supabase = getSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return null
  }

  const { data: purchases } = await supabase
    .from("user_products")
    .select(`
      *,
      products (*),
      orders (*)
    `)
    .eq("user_id", session.user.id)
    .order("purchased_at", { ascending: false })

  return {
    purchases,
    user: session.user,
  }
}

export default async function PurchasesPage() {
  const data = await getUserPurchases()

  if (!data) {
    redirect("/sign-in?redirect=/account/purchases")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <UserPurchases data={data} />
      </main>
      <Footer />
    </div>
  )
}

