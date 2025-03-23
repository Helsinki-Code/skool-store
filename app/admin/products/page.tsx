import type { Metadata } from "next"
import AdminProductList from "@/components/admin/product-list"
import { getProducts } from "@/lib/db/products"

export const metadata: Metadata = {
  title: "Admin - Products | Skool Growth Products",
  description: "Manage your store products",
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <>
      <h1 className="mb-2 font-space-grotesk text-3xl font-bold tracking-tight">Manage Products</h1>
      <p className="mb-8 text-muted-foreground">Create, edit, and delete products in your store</p>

      <AdminProductList products={products} />
    </>
  )
}

