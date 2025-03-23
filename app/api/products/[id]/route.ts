import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/admin"
import type { ProductUpdate } from "@/lib/db/products"

// GET a single product by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const supabase = createClient()

    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching product:", error)
      return NextResponse.json(
        { error: "Error fetching product" },
        { status: 500 }
      )
    }

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// UPDATE a product by ID
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const { isAuthenticated, isAuthorized } = await isAdmin()

    // In development mode, bypass admin check
    if (process.env.NODE_ENV === "development" || (isAuthenticated && isAuthorized)) {
      const id = params.id
      const body = await request.json()
      const supabase = createClient()

      // Update the product
      const { data, error } = await supabase
        .from("products")
        .update(body)
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("Error updating product:", error)
        return NextResponse.json(
          { error: "Error updating product" },
          { status: 500 }
        )
      }

      return NextResponse.json(data)
    }

    return new NextResponse(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    )
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// DELETE a product by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the ID from params
    const id = params.id
    
    // In development mode, bypass admin check
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV MODE] Bypassing authentication for product deletion, id: ${id}`)
      
      const supabase = createClient()
      
      // Delete the product
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("Error deleting product:", error)
        return NextResponse.json(
          { error: "Error deleting product" },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { message: "Product deleted successfully" },
        { status: 200 }
      )
    } else {
      // Check if user is admin in production
      const { isAuthenticated, isAuthorized } = await isAdmin()

      if (!isAuthenticated || !isAuthorized) {
        return new NextResponse(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401 }
        )
      }

      const supabase = createClient()
      
      // Delete the product
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("Error deleting product:", error)
        return NextResponse.json(
          { error: "Error deleting product" },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { message: "Product deleted successfully" },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

