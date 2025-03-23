import type { Metadata } from "next"
import CategoryList from "@/components/admin/category-list"
import { getCategories } from "@/lib/db/categories"

export const metadata: Metadata = {
  title: "Admin - Categories | Skool Growth Products",
  description: "Manage your store categories",
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <>
      <h1 className="mb-2 font-space-grotesk text-3xl font-bold tracking-tight">Manage Categories</h1>
      <p className="mb-8 text-muted-foreground">Create, edit, and delete product categories</p>

      <CategoryList categories={categories} />
    </>
  )
}

