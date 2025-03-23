import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get("stripe-signature") as string

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhook secret is not set" }, { status: 500 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`)
    return NextResponse.json({ error: `Webhook signature verification failed` }, { status: 400 })
  }

  const supabase = createClient()

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object
      const userId = session.metadata?.userId

      if (userId) {
        // Update order status
        const { data: orders, error: orderError } = await supabase
          .from("orders")
          .update({
            status: "completed",
            payment_intent_id: session.payment_intent,
          })
          .eq("checkout_session_id", session.id)
          .select()

        if (orderError) {
          console.error("Error updating order:", orderError)
          break
        }

        if (orders && orders.length > 0) {
          const orderId = orders[0].id

          // Get order items
          const { data: orderItems, error: itemsError } = await supabase
            .from("order_items")
            .select("product_id, quantity")
            .eq("order_id", orderId)

          if (itemsError) {
            console.error("Error fetching order items:", itemsError)
            break
          }

          // Add products to user's purchased products
          if (orderItems && orderItems.length > 0) {
            const userProducts = orderItems.map((item) => ({
              user_id: userId,
              product_id: item.product_id,
              order_id: orderId,
            }))

            const { error: purchaseError } = await supabase.from("user_products").insert(userProducts)

            if (purchaseError) {
              console.error("Error recording purchased products:", purchaseError)
            }
          }
        }
      }
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

