import type { Metadata } from "next"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import BlogHeader from "@/components/blog-header"
import BlogGrid from "@/components/blog-grid"

export const metadata: Metadata = {
  title: "Blog | Skool Growth Products",
  description: "Expert insights, strategies, and advice for Skool community builders",
}

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <BlogHeader />
        <BlogGrid />
      </main>
      <Footer />
    </div>
  )
}

