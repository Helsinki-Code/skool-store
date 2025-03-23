import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/admin"

// GET a single category by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const supabase = createClient()

    const { data: category, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching category:", error)
      return NextResponse.json(
        { error: "Error fetching category" },
        { status: 500 }
      )
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// UPDATE a category by ID
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

      // Update the category
      const { data, error } = await supabase
        .from("categories")
        .update(body)
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("Error updating category:", error)
        return NextResponse.json(
          { error: "Error updating category" },
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
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// DELETE a category by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the ID from params
    const id = params.id
    
    // In development mode, bypass admin check
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV MODE] Bypassing authentication for category deletion, id: ${id}`)
      
      const supabase = createClient()
      
      // Check if category is in use by any products
      const { count, error: countError } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category_id", id)
      
      if (countError) {
        console.error("Error checking if category is in use:", countError)
        return NextResponse.json(
          { error: "Error checking if category is in use" },
          { status: 500 }
        )
      }
      
      // If category is in use, don't delete it
      if (count && count > 0) {
        return NextResponse.json(
          { error: "Cannot delete category that is in use by products" },
          { status: 400 }
        )
      }
      
      // Delete the category
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("Error deleting category:", error)
        return NextResponse.json(
          { error: "Error deleting category" },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { message: "Category deleted successfully" },
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
      
      // Check if category is in use by any products
      const { count, error: countError } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category_id", id)
      
      if (countError) {
        console.error("Error checking if category is in use:", countError)
        return NextResponse.json(
          { error: "Error checking if category is in use" },
          { status: 500 }
        )
      }
      
      // If category is in use, don't delete it
      if (count && count > 0) {
        return NextResponse.json(
          { error: "Cannot delete category that is in use by products" },
          { status: 400 }
        )
      }
      
      // Delete the category
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("Error deleting category:", error)
        return NextResponse.json(
          { error: "Error deleting category" },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { message: "Category deleted successfully" },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

