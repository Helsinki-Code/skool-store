"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { ProductCard } from "@/components/product-card"
import { Check, ShoppingCart } from "lucide-react"

interface ProductDetailProps {
  product: any
  relatedProducts: any[]
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [addedToCart, setAddedToCart] = useState(false)

  const formattedPrice = (product.price / 100).toFixed(2)
  const features = Array.isArray(product.features)
    ? product.features
    : typeof product.features === "string"
      ? JSON.parse(product.features)
      : []

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: 1,
    })

    setAddedToCart(true)

    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    })

    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-primary/50 to-secondary/50">
              <Image
                src={product.image_url || "/placeholder.svg?height=600&width=600"}
                alt={product.title}
                fill
                className="object-cover"
              />
              {product.categories && (
                <div className="absolute left-4 top-4">
                  <Badge className="text-sm">{product.categories.name}</Badge>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="font-space-grotesk text-3xl font-bold tracking-tight sm:text-4xl">{product.title}</h1>

            {product.subtitle && <p className="mt-2 text-xl text-muted-foreground">{product.subtitle}</p>}

            <div className="mt-6 text-3xl font-bold">${formattedPrice}</div>

            <div className="mt-8">
              <Button size="lg" className="w-full gap-2 sm:w-auto" onClick={handleAddToCart} disabled={addedToCart}>
                <ShoppingCart className="h-5 w-5" />
                {addedToCart ? "Added to Cart" : "Add to Cart"}
              </Button>
            </div>

            <Separator className="my-8" />

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="mt-2 text-muted-foreground">{product.description}</p>
              </div>

              {product.long_description && (
                <div>
                  <p className="text-muted-foreground">{product.long_description}</p>
                </div>
              )}

              {features && features.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold">What's Included</h2>
                  <ul className="mt-4 space-y-3">
                    {features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="mb-8 font-space-grotesk text-2xl font-bold tracking-tight sm:text-3xl">Related Products</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={{
                    id: relatedProduct.id,
                    title: relatedProduct.title,
                    subtitle: relatedProduct.subtitle || undefined,
                    description: relatedProduct.description,
                    price: relatedProduct.price,
                    category: relatedProduct.category_id || "uncategorized",
                    featured: relatedProduct.is_featured || false,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

