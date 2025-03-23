import { getSupabaseBrowserClient } from "@/lib/supabase"
import { getSupabaseServerClient } from "@/lib/supabase"
import type { Database } from "@/lib/supabase/database.types"

export type Order = Database["public"]["Tables"]["orders"]["Row"]
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"]
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"]

export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"]
export type OrderItemInsert = Database["public"]["Tables"]["order_items"]["Insert"]

// Server-side functions
export async function getOrdersByUserId(userId: string) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching orders for user ${userId}:`, error)
    throw error
  }

  return data || []
}

export async function getOrderById(id: string) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching order with id ${id}:`, error)
    throw error
  }

  return data
}

export async function createOrder(order: OrderInsert) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.from("orders").insert(order).select().single()

  if (error) {
    console.error("Error creating order:", error)
    throw error
  }

  return data
}

export async function createOrderItems(items: OrderItemInsert[]) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.from("order_items").insert(items).select()

  if (error) {
    console.error("Error creating order items:", error)
    throw error
  }

  return data
}

export async function updateOrderStatus(id: string, status: string, paymentIntentId?: string) {
  const supabase = getSupabaseServerClient()
  const updates: OrderUpdate = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (paymentIntentId) {
    updates.payment_intent_id = paymentIntentId
  }

  const { data, error } = await supabase.from("orders").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating order ${id}:`, error)
    throw error
  }

  return data
}

export async function getOrdersByStatus(status: string) {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false })

    if (error) {
      console.error(`Error fetching orders with status ${status}:`, error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getOrdersByStatus:", error)
    return []
  }
}

export async function getAllOrders() {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching all orders:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllOrders:", error)
    return []
  }
}

// Client-side functions
export function useOrders() {
  const supabase = getSupabaseBrowserClient()

  const getUserOrders = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching user orders:", error)
      throw error
    }

    return data || []
  }

  const getOrderById = async (id: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq("id", id)
      .eq("user_id", session.user.id) // Security: ensure user can only access their own orders
      .single()

    if (error) {
      console.error(`Error fetching order with id ${id}:`, error)
      throw error
    }

    return data
  }

  return {
    getUserOrders,
    getOrderById,
  }
}

