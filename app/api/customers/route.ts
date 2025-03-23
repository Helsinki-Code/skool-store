import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    console.log("Customers API called")
    
    // Check if user is admin
    const adminCheck = await isAdmin()
    if (!adminCheck) {
      console.error("Unauthorized access attempt to customers API")
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Get user profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")

    if (profilesError) {
      console.error("Error fetching user profiles:", profilesError)
      throw new Error("Failed to fetch user profiles")
    }

    // Get orders for each user
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("user_id, created_at")

    if (ordersError) {
      console.error("Error fetching orders:", ordersError)
      throw new Error("Failed to fetch orders")
    }
    
    // Calculate order totals using order_items
    const { data: orderItems, error: orderItemsError } = await supabase
      .from("order_items")
      .select("order_id, quantity, price")
    
    if (orderItemsError) {
      console.error("Error fetching order items:", orderItemsError)
      throw new Error("Failed to fetch order items")
    }
    
    // Get the order to user mapping
    const orderUserMap = new Map()
    orders.forEach(order => {
      orderUserMap.set(order.id, order.user_id)
    })
    
    // Calculate total spent for each order
    const orderTotals = new Map()
    orderItems.forEach(item => {
      const total = (item.quantity || 0) * (item.price || 0)
      if (!orderTotals.has(item.order_id)) {
        orderTotals.set(item.order_id, 0)
      }
      orderTotals.set(item.order_id, orderTotals.get(item.order_id) + total)
    })
    
    // Group orders by user
    const userOrders = new Map()
    orders.forEach(order => {
      if (!userOrders.has(order.user_id)) {
        userOrders.set(order.user_id, [])
      }
      userOrders.get(order.user_id).push({
        id: order.id,
        created_at: order.created_at,
        total: orderTotals.get(order.id) || 0
      })
    })
    
    // Calculate total orders and spent for each user
    const userOrderStats = {}
    for (const [userId, userOrdersList] of userOrders.entries()) {
      const totalOrders = userOrdersList.length
      const totalSpent = userOrdersList.reduce((sum, order) => sum + (order.total || 0), 0)
      userOrderStats[userId] = { orders: totalOrders, spent: totalSpent }
    }

    // Get the auth information for each user
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.warn("Warning: Could not get auth user details:", authError)
    }

    // Combine data
    const customers = profiles.map(profile => {
      const orderStats = userOrderStats[profile.id] || { orders: 0, spent: 0 }
      // Get last sign-in time if this is the current user
      const isCurrentUser = authData?.user?.id === profile.id
      const lastSignIn = isCurrentUser ? new Date().toISOString() : null
      
      return {
        id: profile.id,
        email: profile.email || "Unknown",
        full_name: profile.full_name || "Unknown User",
        created_at: profile.created_at,
        last_sign_in_at: lastSignIn,
        total_orders: orderStats.orders,
        total_spent: orderStats.spent
      }
    })

    return NextResponse.json({ customers })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json(
      { error: "Failed to fetch customers", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 