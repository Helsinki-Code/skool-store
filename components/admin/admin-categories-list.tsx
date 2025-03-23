"use client"

import CategoryList from "@/components/admin/category-list"
import type { Category } from "@/lib/db/categories"

interface AdminCategoriesListProps {
  categories: Category[]
}

export default function AdminCategoriesList({ categories }: AdminCategoriesListProps) {
  return (
    <div className="space-y-4">
      <CategoryList categories={categories} />
    </div>
  )
} 