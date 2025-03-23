import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  console.log("⭐ Orders API: Received GET request")
  
  // Check if user is admin
  try {
    const admin = await isAdmin()
    console.log("⭐ Orders API: Admin check result:", admin)
    
    if (!admin) {
      console.log("⭐ Orders API: Unauthorized - Not an admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create Supabase client
    const supabase = getSupabaseServerClient()

    console.log("⭐ Orders API: Fetching orders")
    // Fetch orders from Supabase
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        id,
        user_id,
        status,
        total_amount,
        created_at,
        profiles (
          email
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("⭐ Orders API: Error fetching orders:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("⭐ Orders API: Found", orders?.length || 0, "orders")
    // Format the response
    const formattedOrders = orders.map((order) => {
      // Handle profiles data properly
      let userEmail = null;
      if (order.profiles && typeof order.profiles === 'object') {
        // Handle both cases: when profiles is an object or when it's an array with one object
        if (Array.isArray(order.profiles) && order.profiles.length > 0) {
          userEmail = order.profiles[0].email;
        } else {
          // @ts-ignore - database shape may vary
          userEmail = order.profiles.email;
        }
      }
      
      return {
        id: order.id,
        user_id: order.user_id,
        status: order.status,
        total: order.total_amount,
        created_at: order.created_at,
        user_email: userEmail,
      };
    });

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error("⭐ Orders API: Unexpected error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

