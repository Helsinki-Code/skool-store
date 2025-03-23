import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getSupabaseServerClient } from "@/lib/supabase"
import { stripe } from "@/lib/stripe"

// This is the Stripe webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature") as string

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error("Stripe webhook secret is missing")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    // Verify the webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: `Webhook signature verification failed` }, { status: 400 })
    }

    // Handle the event
    const supabase = getSupabaseServerClient()

    switch (event.type) {
      case "checkout.session.completed":
        {
          const session = event.data.object as Stripe.Checkout.Session
          const { product_id: productId, user_id: userId } = session.metadata || {}

          if (!productId) {
            console.error("Missing product ID in session metadata")
            return NextResponse.json({ error: "Missing product ID" }, { status: 400 })
          }

          // Create an order record if it doesn't exist yet
          const { data: existingOrder } = await supabase
            .from("orders")
            .select("id")
            .eq("checkout_session_id", session.id)
            .single()

          if (!existingOrder) {
            // Create a new order
            const { data: order, error: orderError } = await supabase
              .from("orders")
              .insert({
                user_id: userId || null,
                email: session.customer_details?.email || "anonymous@example.com",
                total_amount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
                status: "completed",
                payment_intent_id: session.payment_intent as string,
                checkout_session_id: session.id,
              })
              .select()
              .single()

            if (orderError) {
              console.error("Error creating order from webhook:", orderError)
              return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
            }

            // Get product details
            const { data: product, error: productError } = await supabase
              .from("products")
              .select("price")
              .eq("id", productId)
              .single()

            if (productError) {
              console.error("Error fetching product:", productError)
              return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
            }

            // Create an order item
            const { error: orderItemError } = await supabase.from("order_items").insert({
              order_id: order.id,
              product_id: productId,
              quantity: 1,
              price: product.price,
            })

            if (orderItemError) {
              console.error("Error creating order item:", orderItemError)
              return NextResponse.json({ error: "Failed to create order item" }, { status: 500 })
            }

            // If user is logged in, add to their purchased products
            if (userId) {
              const { error: userProductError } = await supabase.from("user_products").insert({
                user_id: userId,
                product_id: productId,
                order_id: order.id,
              })

              if (userProductError) {
                console.error("Error creating user product record:", userProductError)
                // Don't return error as this isn't critical
              }
            }
          }
        }
        break

      case "payment_intent.succeeded":
        // You can add additional payment handling here if needed
        break

      default:
        // Unexpected event type
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

