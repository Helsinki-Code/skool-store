"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { CheckCircle, Package, Download, ArrowRight } from "lucide-react"

interface CheckoutSuccessProps {
  orderDetails: any
}

export default function CheckoutSuccess({ orderDetails }: CheckoutSuccessProps) {
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear the cart after successful checkout
    clearCart()
  }, [clearCart])

  const order = orderDetails.order
  const orderItems = order.order_items
  const totalAmount = (order.total_amount / 100).toFixed(2)
  const orderDate = new Date(order.created_at).toLocaleDateString()

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <CheckCircle className="h-12 w-12" />
            </div>
          </div>
          <h1 className="mb-2 font-space-grotesk text-3xl font-bold sm:text-4xl">Thank You for Your Purchase!</h1>
          <p className="text-muted-foreground">
            Your order has been confirmed and your digital products are ready for download.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                  <p className="text-sm text-muted-foreground">Order #{order.id.substring(0, 8)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{orderDate}</p>
                </div>
              </div>

              <Separator className="mb-6" />

              <div className="space-y-6">
                {orderItems.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt={item.products.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.products.title}</h3>
                        <p className="font-medium">${(item.price / 100).toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <div className="mt-auto">
                        <Button variant="ghost" size="sm" className="h-8 gap-1 p-0 text-primary">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalAmount}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="mt-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Access Your Purchases</h3>
                <p className="text-sm text-muted-foreground">
                  View and download your products anytime from your account.
                </p>
              </div>
              <Button className="ml-auto" asChild>
                <Link href="/account/purchases">
                  My Purchases
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

