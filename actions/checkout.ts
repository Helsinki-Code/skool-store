"use server"

import { stripe } from "@/lib/stripe"
import { getSupabaseServerClient } from "@/lib/supabase"
import { createOrder, createOrderItems } from "@/lib/db/orders"

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
}

export async function createCheckoutSession(cartItems: CartItem[]) {
  try {
    // Get the current user
    const supabase = getSupabaseServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      // If no user is logged in, return an error
      return { error: "User not authenticated", checkoutUrl: null }
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

    // Create a new order in the database
    const order = await createOrder({
      user_id: session.user.id,
      status: "pending",
      total_amount: totalAmount,
    })

    // Insert order items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }))

    await createOrderItems(orderItems)

    // Create Stripe checkout session
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
        },
        unit_amount: item.price, // Price is already in cents
      },
      quantity: item.quantity,
    }))

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cart`,
      metadata: {
        order_id: order.id,
        user_id: session.user.id,
      },
      customer_email: session.user.email, // Pre-fill customer email
    })

    // Update order with checkout session ID
    await supabase
      .from("orders")
      .update({
        checkout_session_id: checkoutSession.id,
      })
      .eq("id", order.id)

    return { checkoutUrl: checkoutSession.url }
  } catch (error: any) {
    console.error("Checkout error:", error)
    return { error: error.message || "Failed to create checkout session", checkoutUrl: null }
  }
}

