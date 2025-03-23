import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import CategorySection from "@/components/category-section"
import TrendingProducts from "@/components/trending-products"
import BlogSection from "@/components/blog-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <HeroSection />
        <CategorySection />
        <TrendingProducts />
        <BlogSection />
      </main>
      <Footer />
    </div>
  )
}

