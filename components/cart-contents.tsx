"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { createCheckoutSession } from "@/actions/checkout"
import { ShoppingCart, Trash2, ChevronRight, CreditCard, Loader2, AlertCircle, LogIn } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function CartContents() {
  const router = useRouter()
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [couponCode, setCouponCode] = useState("")
  const [isApplying, setIsApplying] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const handleApplyCoupon = () => {
    setIsApplying(true)
    setTimeout(() => {
      setIsApplying(false)
      setCouponCode("")
      toast({
        title: "Coupon applied",
        description: "Your discount has been applied to the order.",
      })
    }, 1500)
  }

  const handleCheckout = async () => {
    if (!user) {
      router.push("/sign-in?redirect=/cart")
      return
    }

    try {
      setIsCheckingOut(true)
      setCheckoutError(null)

      const cartItems = cart.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }))

      const { checkoutUrl, error } = await createCheckoutSession(cartItems)

      if (error) {
        throw new Error(error)
      }

      if (!checkoutUrl) {
        throw new Error("No checkout URL returned from server")
      }

      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl
    } catch (error: any) {
      console.error("Checkout error:", error)
      setCheckoutError(error.message || "There was a problem processing your checkout. Please try again.")

      toast({
        title: "Checkout failed",
        description: error.message || "There was a problem processing your checkout",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 rounded-full bg-muted p-6">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
        <p className="mb-6 max-w-md text-muted-foreground">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Button onClick={() => router.push("/products")}>Browse Products</Button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Cart Items ({cart.length})</CardTitle>
            <CardDescription>Review your selected products</CardDescription>
          </CardHeader>

          <AnimatePresence initial={false}>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="px-6 pb-2 pt-0">
                  <div className="flex items-start gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                      <Image
                        src="/placeholder.svg?height=200&width=200"
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <Link href={`/products/${item.slug || item.id}`} className="font-medium hover:underline">
                          {item.title}
                        </Link>
                        <p className="text-lg font-bold">${(item.price / 100).toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description?.substring(0, 90)}...</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <label htmlFor={`quantity-${item.id}`} className="mr-2 text-sm">
                            Qty:
                          </label>
                          <select
                            id={`quantity-${item.id}`}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                            className="rounded-md border bg-transparent px-2 py-1 text-sm"
                          >
                            {[1, 2, 3, 4, 5].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 p-0 text-muted-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <Separator className="my-4" />
              </motion.div>
            ))}
          </AnimatePresence>

          <CardFooter className="flex justify-between py-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/products")}>
              Continue Shopping
            </Button>
            <Button variant="ghost" size="sm" onClick={clearCart}>
              Clear Cart
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Complete your purchase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {checkoutError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{checkoutError}</AlertDescription>
              </Alert>
            )}

            {!user && !authLoading && (
              <Alert className="border-red-200 bg-red-100 text-red-800 dark:border-red-800/30 dark:bg-red-900/30 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex flex-col gap-2">
                  <span>You need to sign in to checkout</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-800/50"
                    onClick={() => router.push("/sign-in?redirect=/cart")}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign in to continue
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${(totalPrice / 100).toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
              <Button variant="outline" onClick={handleApplyCoupon} disabled={!couponCode || isApplying}>
                {isApplying ? "Applying..." : "Apply"}
              </Button>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${(totalPrice / 100).toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={handleCheckout}
              disabled={isCheckingOut || (!user && !authLoading)}
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : !user && !authLoading ? (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign in to checkout
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Checkout
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

