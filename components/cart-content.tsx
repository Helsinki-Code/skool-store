"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart, Trash2, ArrowRight, Package } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function CartContent() {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice, checkout } = useCart()
  const { toast } = useToast()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some products to your cart before checking out",
        variant: "destructive",
      })
      return
    }

    setIsCheckingOut(true)

    try {
      await checkout()
      // Redirect is handled by the checkout function
    } catch (error: any) {
      // Error is already handled in the checkout function
      // Just reset the loading state
      setIsCheckingOut(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 rounded-full bg-muted p-6">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-2xl font-semibold">Your cart is empty</h3>
        <p className="mb-6 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Your Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 overflow-hidden rounded-md bg-muted">
                  {item.image_url ? (
                    <div
                      className="h-full w-full"
                      style={{
                        backgroundImage: `url(${item.image_url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">${(item.price / 100).toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-r-none"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <div className="flex h-8 w-8 items-center justify-center border border-x-0 border-input">
                    {item.quantity}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-l-none"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col space-y-4 p-6">
        <div className="flex w-full items-center justify-between">
          <span className="text-lg font-medium">Subtotal</span>
          <span className="text-lg font-bold">${(totalPrice / 100).toFixed(2)}</span>
        </div>
        <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
          {isCheckingOut ? (
            <>Processing...</>
          ) : (
            <>
              Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

