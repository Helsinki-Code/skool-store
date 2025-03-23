import type { Metadata } from "next"
import { redirect } from "next/navigation"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import UserProducts from "@/components/account/user-products"
import { getSupabaseServerClient } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "My Products | Skool Growth Products",
  description: "Access your purchased digital products",
}

export default async function UserProductsPage() {
  // Check if user is authenticated
  const supabase = getSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/sign-in")
  }

  // Get user's purchased products
  const { data: userProducts } = await supabase
    .from("user_products")
    .select(`
      id,
      purchased_at,
      products (
        id,
        title,
        subtitle,
        slug,
        description,
        price,
        image_url,
        category_id,
        categories (
          name,
          slug
        )
      )
    `)
    .eq("user_id", session.user.id)

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <UserProducts userProducts={userProducts || []} />
      </main>
      <Footer />
    </div>
  )
}

