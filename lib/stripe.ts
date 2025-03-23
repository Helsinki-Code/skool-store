import Stripe from "stripe"

// Use STRIPE_SECRET_KEY for server-side operations (not the NEXT_PUBLIC_ version)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  console.warn("Stripe secret key is missing. Stripe functionality will not work.")
}

// Create a placeholder Stripe instance for development
// This will be replaced with a real instance when the secret key is available
export const stripe = new Stripe(stripeSecretKey || "sk_test_placeholder", {
  apiVersion: "2025-02-24.acacia",
})

// Helper function to validate and format checkout parameters
export function validateCheckoutParams(params: any) {
  const { products, successUrl, cancelUrl } = params

  // Validate products
  if (!products || !Array.isArray(products) || products.length === 0) {
    throw new Error("Invalid products data")
  }

  // Format products for Stripe
  const formattedProducts = products.map((product) => {
    // Ensure title is a string and not empty
    const title = typeof product.title === "string" && product.title.trim() !== "" ? product.title : "Product"

    // Ensure price is a positive number and convert to cents for Stripe
    const price =
      typeof product.price === "number" && product.price > 0
        ? Math.round(product.price * 100) // Convert to cents and ensure it's an integer
        : 100 // Default to $1.00

    // Ensure quantity is a positive integer
    const quantity = typeof product.quantity === "number" && product.quantity > 0 ? Math.round(product.quantity) : 1

    return {
      title,
      price,
      quantity,
    }
  })

  return {
    products: formattedProducts,
    successUrl: successUrl || "/checkout/success",
    cancelUrl: cancelUrl || "/cart",
  }
}

