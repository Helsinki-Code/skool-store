import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"
import { createProduct } from "@/lib/db/products"
import type { ProductInsert } from "@/lib/db/products"

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

    const productData: ProductInsert = await request.json()

    // Validate required fields
    if (!productData.title || !productData.slug || !productData.description || !productData.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if slug is unique
    const { data: existingProduct } = await supabase.from("products").select("id").eq("slug", productData.slug).single()

    if (existingProduct) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 400 })
    }

    const product = await createProduct(productData)

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 })
  }
}

