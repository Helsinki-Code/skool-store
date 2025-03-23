import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    const { products, successUrl, cancelUrl } = await request.json()

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "Invalid products data" }, { status: 400 })
    }

    // Initialize Stripe
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return NextResponse.json({ error: "Stripe secret key is missing" }, { status: 500 })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia",
    })

    // Validate and sanitize product data
    const lineItems = products.map((product) => {
      // Ensure title is a string and not empty
      const title = typeof product.title === "string" && product.title.trim() !== "" ? product.title : "Product"

      // Ensure price is a positive number
      const price =
        typeof product.price === "number" && product.price > 0
          ? Math.round(product.price * 100) // Convert dollars to cents
          : 100 // Default to $1.00

      // Ensure quantity is a positive integer
      const quantity = typeof product.quantity === "number" && product.quantity > 0 ? Math.round(product.quantity) : 1

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: title,
          },
          unit_amount: price, // Price in cents
        },
        quantity,
      }
    })

    // Validate URLs
    const validSuccessUrl = successUrl || `${request.nextUrl.origin}/checkout/success`
    const validCancelUrl = cancelUrl || `${request.nextUrl.origin}/cart`

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: validSuccessUrl,
      cancel_url: validCancelUrl,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

