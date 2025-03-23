import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ProductForm from "@/components/admin/product-form"
import { getProductById } from "@/lib/db/products"
import { getCategories } from "@/lib/db/categories"

export const metadata: Metadata = {
  title: "Edit Product | Admin Dashboard",
  description: "Edit product details",
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  try {
    const [product, categories] = await Promise.all([getProductById(params.id), getCategories()])

    return (
      <>
        <h1 className="mb-2 font-space-grotesk text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="mb-8 text-muted-foreground">Update the details of your product</p>

        <ProductForm product={product} categories={categories} />
      </>
    )
  } catch (error) {
    notFound()
  }
}

