"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase"
import { stripe } from "@/lib/stripe"

/**
 * Get all published products
 */
export async function getProducts() {
  const supabase = getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("products")
    .select("id, title, slug, description, price, image_url, category_id, is_featured")
    .eq("is_published", true)
    .order("title")
  
  if (error) {
    console.error("Error fetching products:", error)
    return []
  }
  
  return data
}

/**
 * Get featured products for homepage
 */
export async function getFeaturedProducts() {
  const supabase = getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("products")
    .select("id, title, slug, description, price, image_url, category_id")
    .eq("is_published", true)
    .eq("is_featured", true)
    .limit(6)
  
  if (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
  
  return data
}

/**
 * Get a product by slug
 */
export async function getProductBySlug(slug: string) {
  const supabase = getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()
  
  if (error) {
    console.error("Error fetching product:", error)
    return null
  }
  
  return data
}

/**
 * Get products by category slug
 */
export async function getProductsByCategory(categorySlug: string) {
  const supabase = getSupabaseServerClient()
  
  // First get the category ID
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single()
  
  if (categoryError || !category) {
    console.error("Error fetching category:", categoryError)
    return []
  }
  
  // Then get products in that category
  const { data, error } = await supabase
    .from("products")
    .select("id, title, slug, description, price, image_url")
    .eq("category_id", category.id)
    .eq("is_published", true)
    .order("title")
  
  if (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
  
  return data
}

/**
 * Create a Stripe checkout session for a single product
 */
export async function createProductCheckoutSession(productId: string) {
  const supabase = getSupabaseServerClient()
  
  // Get product details
  const { data: product, error } = await supabase
    .from("products")
    .select("id, title, slug, price, description")
    .eq("id", productId)
    .single()
  
  if (error || !product) {
    console.error("Error fetching product for checkout:", error)
    throw new Error("Product not found")
  }
  
  // Get user session to include user info
  const { data: { session } } = await supabase.auth.getSession()
  
  try {
    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
              description: product.description,
            },
            unit_amount: Math.round(product.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
      metadata: {
        product_id: product.id,
        user_id: session?.user?.id || "anonymous",
      },
    })
    
    return { url: stripeSession.url }
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error)
    throw new Error("Failed to create checkout session")
  }
}

/**
 * Process a successful Stripe checkout session and create an order
 */
export async function processSuccessfulCheckout(sessionId: string) {
  const supabase = getSupabaseServerClient()
  
  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (!session || session.payment_status !== "paid") {
      throw new Error("Payment not completed")
    }
    
    const { product_id: productId, user_id: userId } = session.metadata || {}
    
    if (!productId) {
      throw new Error("Product ID missing from session metadata")
    }
    
    // Create an order record
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        email: session.customer_details?.email || "anonymous@example.com",
        total_amount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
        status: "completed",
        payment_intent_id: session.payment_intent as string,
        checkout_session_id: session.id,
      })
      .select()
      .single()
    
    if (orderError) {
      console.error("Error creating order:", orderError)
      throw new Error("Failed to create order record")
    }
    
    // Get product details
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("price")
      .eq("id", productId)
      .single()
    
    if (productError) {
      console.error("Error fetching product for order item:", productError)
      throw new Error("Failed to fetch product details")
    }
    
    // Create an order item
    const { error: orderItemError } = await supabase
      .from("order_items")
      .insert({
        order_id: order.id,
        product_id: productId,
        quantity: 1,
        price: product.price,
      })
    
    if (orderItemError) {
      console.error("Error creating order item:", orderItemError)
      throw new Error("Failed to create order item")
    }
    
    // If user is logged in, add to their purchased products
    if (userId && userId !== "anonymous") {
      const { error: userProductError } = await supabase
        .from("user_products")
        .insert({
          user_id: userId,
          product_id: productId,
          order_id: order.id,
        })
      
      if (userProductError) {
        console.error("Error creating user product record:", userProductError)
        // Don't throw here, it's not critical
      }
    }
    
    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("Error processing successful checkout:", error)
    throw new Error("Failed to process checkout")
  }
} 