import type { Metadata } from "next"
import ProductForm from "@/components/admin/product-form"
import { getCategories } from "@/lib/db/categories"

export const metadata: Metadata = {
  title: "Create Product | Admin Dashboard",
  description: "Create a new product",
}

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <>
      <h1 className="mb-2 font-space-grotesk text-3xl font-bold tracking-tight">Create New Product</h1>
      <p className="mb-8 text-muted-foreground">Add a new product to your store</p>

      <ProductForm categories={categories} />
    </>
  )
}

