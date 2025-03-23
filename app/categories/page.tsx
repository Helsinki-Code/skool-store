import type { Metadata } from "next"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import AllCategories from "@/components/all-categories"

export const metadata: Metadata = {
  title: "Product Categories | Skool Growth Products",
  description: "Browse our product categories for Skool community creators",
}

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <AllCategories />
      </main>
      <Footer />
    </div>
  )
}

