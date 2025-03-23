"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, ExternalLink, Package } from "lucide-react"

interface UserPurchasesProps {
  data: {
    purchases: any[]
    user: any
  }
}

export default function UserPurchases({ data }: UserPurchasesProps) {
  const { purchases, user } = data
  const [activeTab, setActiveTab] = useState("all")

  if (!purchases || purchases.length === 0) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 font-space-grotesk text-3xl font-bold">My Purchases</h1>

          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">No purchases yet</h2>
            <p className="mb-6 max-w-md text-muted-foreground">
              You haven't purchased any products yet. Browse our catalog to find digital products for your Skool
              community.
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
          <h1 className="mb-6 font-space-grotesk text-3xl font-bold">My Purchases</h1>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              {purchases
                .filter(
                  (purchase) =>
                    activeTab === "all" ||
                    (activeTab === "case-studies" && purchase.products.category_id.includes("case-studies")) ||
                    (activeTab === "resources" && !purchase.products.category_id.includes("case-studies")),
                )
                .map((purchase) => (
                  <motion.div
                    key={purchase.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardContent className="flex gap-4 p-6">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image
                            src="/placeholder.svg?height=200&width=200"
                            alt={purchase.products.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h3 className="font-medium">{purchase.products.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Purchased on {new Date(purchase.purchased_at).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {purchase.products.description.substring(0, 120)}...
                          </p>
                          <div className="mt-auto flex flex-wrap gap-2">
                            <Button size="sm" className="gap-1">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/products/${purchase.products.slug}`}>
                                <ExternalLink className="mr-1 h-4 w-4" />
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

