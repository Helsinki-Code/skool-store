"use client"

import AdminProductList from "@/components/admin/product-list"
import type { Product } from "@/lib/db/products"
import type { Category } from "@/lib/db/categories"

interface AdminProductsListProps {
  products: Product[]
  categories: Category[]
}

export default function AdminProductsList({ products, categories }: AdminProductsListProps) {
  return (
    <div className="space-y-4">
      <AdminProductList products={products} />
    </div>
  )
} 