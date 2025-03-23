"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Download, FileText, Package, Search } from "lucide-react"

interface OrderHistoryProps {
  data: {
    orders: any[]
    user: any
  }
}

export default function OrderHistory({ data }: OrderHistoryProps) {
  const { orders } = data
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOrders = orders.filter((order) => {
    const orderIdMatch = order.id.toLowerCase().includes(searchQuery.toLowerCase())
    const productMatch = order.order_items.some((item: any) =>
      item.products.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    return orderIdMatch || productMatch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2)
  }

  if (orders.length === 0) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 font-space-grotesk text-3xl font-bold">Order History</h1>

          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">No orders yet</h2>
            <p className="mb-6 max-w-md text-muted-foreground">
              You haven't placed any orders yet. Browse our catalog to find digital products for your Skool community.
            </p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-space-grotesk text-3xl font-bold">Order History</h1>

            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="rounded-lg border p-6 text-center">
                <p className="text-muted-foreground">No orders found matching your search.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <CardTitle className="text-lg">Order #{order.id.substring(0, 8)}</CardTitle>
                        <div className="flex items-center gap-3">
                          <Badge status={order.status} />
                          <span className="font-bold">${formatPrice(order.total_amount)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Placed on {formatDate(order.created_at)}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {order.order_items.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="rounded-md bg-primary/10 p-2 text-primary">
                                <Package className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">{item.products.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity} × ${formatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" className="gap-1">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-4" />

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Payment ID:</span>
                        <span className="font-mono">
                          {order.payment_intent_id ? order.payment_intent_id.substring(0, 16) + "..." : "N/A"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Badge({ status }: { status: string }) {
  let color = "bg-muted text-muted-foreground"

  switch (status.toLowerCase()) {
    case "completed":
      color = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      break
    case "pending":
      color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      break
    case "failed":
      color = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      break
  }

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

