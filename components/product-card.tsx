"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Product {
  id: string
  title: string
  subtitle?: string
  description: string
  price: number
  image_url?: string
  is_featured?: boolean
  slug?: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isHovered, setIsHovered] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(product)
    setAddedToCart(true)
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    })

    setTimeout(() => setAddedToCart(false), 2000)
  }

  // Format price from cents to dollars
  const formattedPrice = (product.price / 100).toFixed(2)

  // Use slug for navigation if available, otherwise use id
  const productPath = product.slug ? `/products/${product.slug}` : `/products/${product.id}`

  return (
    <Card
      className="relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(productPath)}
    >
      {product.is_featured && <Badge className="absolute right-3 top-3 z-10">Featured</Badge>}

      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/50 to-secondary/50">
        {product.image_url ? (
          <div
            className={`absolute inset-0 transition-transform duration-500 ${isHovered ? "scale-105" : "scale-100"}`}
            style={{
              backgroundImage: `url(${product.image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : (
          <div
            className={`absolute inset-0 transition-transform duration-500 ${isHovered ? "scale-105" : "scale-100"}`}
            style={{
              backgroundImage: `url(/placeholder.svg?height=400&width=600)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="mb-1 text-lg font-bold leading-tight text-background lg:text-xl">{product.title}</h3>
          {product.subtitle && <p className="text-sm text-background/90">{product.subtitle}</p>}
        </div>
      </div>

      <CardContent className="flex-grow p-6">
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-6">
        <div className="text-xl font-bold">${formattedPrice}</div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              router.push(productPath)
            }}
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">View Details</span>
          </Button>
          <Button size="sm" onClick={handleAddToCart} disabled={addedToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {addedToCart ? "Added" : "Add to Cart"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

