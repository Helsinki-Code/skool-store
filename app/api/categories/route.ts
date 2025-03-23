import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"
import { createCategory } from "@/lib/db/categories"
import type { CategoryInsert } from "@/lib/db/categories"

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real app, you would check if the user has admin privileges
    // For now, we'll just check if they're authenticated

    const categoryData: CategoryInsert = await request.json()

    // Validate required fields
    if (!categoryData.name || !categoryData.slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
    }

    // Check if slug is unique
    const { data: existingCategory } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categoryData.slug)
      .single()

    if (existingCategory) {
      return NextResponse.json({ error: "A category with this slug already exists" }, { status: 400 })
    }

    const category = await createCategory(categoryData)

    return NextResponse.json(category)
  } catch (error: any) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 })
  }
}

