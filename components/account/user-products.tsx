"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, ExternalLink, Package } from "lucide-react"

interface Product {
  id: string
  title: string
  subtitle: string | null
  slug: string
  description: string
  price: number
  image_url: string | null
  category_id: string | null
  categories: {
    name: string
    slug: string
  } | null
}

interface UserProduct {
  id: string
  purchased_at: string
  products: Product
}

interface UserProductsProps {
  userProducts: UserProduct[]
}

export default function UserProducts({ userProducts }: UserProductsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="mb-2 font-space-grotesk text-3xl font-bold tracking-tight sm:text-4xl">My Products</h1>
        <p className="mb-8 text-muted-foreground">Access your purchased digital products</p>

        {userProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-6 rounded-full bg-muted p-6">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">No products yet</h2>
            <p className="mb-6 max-w-md text-muted-foreground">
              You haven't purchased any products yet. Browse our catalog to find digital products that can help you grow
              your Skool community.
            </p>
            <Button onClick={() => (window.location.href = "/products")}>Browse Products</Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {userProducts.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={item.products.image_url || "/placeholder.svg?height=400&width=600"}
                    alt={item.products.title}
                    fill
                    className="object-cover"
                  />
                  {item.products.categories && (
                    <Badge className="absolute left-3 top-3">{item.products.categories.name}</Badge>
                  )}
                </div>

                <CardHeader>
                  <CardTitle>{item.products.title}</CardTitle>
                  {item.products.subtitle && <p className="text-sm text-muted-foreground">{item.products.subtitle}</p>}
                </CardHeader>

                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">{item.products.description}</p>
                  <p className="text-xs text-muted-foreground">Purchased on: {formatDate(item.purchased_at)}</p>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    Access Product
                  </Button>
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

