import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import OrderHistory from "@/components/account/order-history"

export const metadata: Metadata = {
  title: "Order History | Skool Growth Products",
  description: "View your order history and receipts",
}

async function getUserOrders() {
  const supabase = getSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return null
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  return {
    orders: orders || [],
    user: session.user,
  }
}

export default async function OrdersPage() {
  const data = await getUserOrders()

  if (!data) {
    redirect("/sign-in?redirect=/account/orders")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <OrderHistory data={data} />
      </main>
      <Footer />
    </div>
  )
}

