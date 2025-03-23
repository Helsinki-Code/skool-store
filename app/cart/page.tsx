import { Providers } from "@/components/providers"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import CartContent from "@/components/cart-content"

export default function CartPage() {
  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <main className="container flex-grow py-8">
          <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
          <CartContent />
        </main>
        <Footer />
      </div>
    </Providers>
  )
}

