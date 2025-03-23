import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import ProductList from "@/components/product-list"

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-6">All Products</h1>
        <ProductList />
      </main>
      <Footer />
    </div>
  )
}

