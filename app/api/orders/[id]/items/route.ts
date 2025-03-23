import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"
import { isAdmin } from "@/lib/admin"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderId = params.id
    const supabase = getSupabaseServerClient()

    // Fetch order items with product details
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        id,
        order_id,
        product_id,
        quantity,
        price,
        products (
          name
        )
      `)
      .eq("order_id", orderId)

    if (itemsError) {
      console.error("Error fetching order items:", itemsError)
      return NextResponse.json({ error: "Failed to fetch order items" }, { status: 500 })
    }

    // Format the response
    const formattedItems = orderItems.map((item) => ({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      product_name: item.products?.name || null,
    }))

    return NextResponse.json(formattedItems)
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

