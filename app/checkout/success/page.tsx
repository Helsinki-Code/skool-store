import { Metadata } from "next"
import { redirect } from "next/navigation"
import { processSuccessfulCheckout } from "@/actions/product-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Order Confirmation | Skool Store",
  description: "Thank you for your purchase",
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string; error?: string }
}) {
  const sessionId = searchParams.session_id
  const error = searchParams.error

  // If there's no session ID, redirect to home
  if (!sessionId && !error) {
    redirect("/")
  }

  // If we have a session ID, process the checkout
  let orderResult = null
  if (sessionId) {
    try {
      orderResult = await processSuccessfulCheckout(sessionId)
    } catch (err) {
      console.error("Error processing checkout:", err)
      // We'll handle this in the UI below
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="container flex items-center justify-center px-4 py-12 md:px-6 md:py-24">
          <Card className="mx-auto max-w-md text-center">
            <CardHeader>
              {orderResult?.success || !error ? (
                <>
                  <div className="flex justify-center pb-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Thank You for Your Purchase!</CardTitle>
                  <CardDescription>
                    Your order has been successfully processed and you will receive an email confirmation shortly.
                  </CardDescription>
                </>
              ) : (
                <>
                  <CardTitle className="text-2xl font-bold">There Was an Issue With Your Order</CardTitle>
                  <CardDescription>
                    We encountered a problem processing your order: {error || "Unknown error"}
                  </CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent className="pb-6">
              {orderResult?.success ? (
                <p>
                  We have sent you an email with your purchase details and instructions on how to access your product.
                </p>
              ) : error ? (
                <p>Please try again or contact our support team if the problem persists.</p>
              ) : (
                <p>We're still processing your order. Please do not refresh this page.</p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              {orderResult?.success ? (
                <>
                  <Button asChild className="w-full">
                    <Link href="/account/products">View My Products</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/">Continue Shopping</Link>
                  </Button>
                </>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/">Return to Home</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

