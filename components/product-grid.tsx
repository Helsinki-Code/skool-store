"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useProducts } from "@/lib/db/products"
import type { Product } from "@/lib/db/products"

interface ProductGridProps {
  initialProducts?: Product[]
  categoryId?: string
}

export function ProductGrid({ initialProducts, categoryId }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || [])
  const [isLoading, setIsLoading] = useState(!initialProducts)
  const productsApi = useProducts()

  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts)
      return
    }

    async function fetchProducts() {
      try {
        setIsLoading(true)
        let data

        if (categoryId) {
          // This would need to be implemented in the useProducts hook
          data = await productsApi.getByCategoryId(categoryId)
        } else {
          data = await productsApi.getAll()
        }

        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [initialProducts, categoryId, productsApi])

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex justify-between pt-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard
            product={{
              id: product.id,
              title: product.title,
              subtitle: product.subtitle || undefined,
              description: product.description,
              price: product.price,
              category: product.category_id || "uncategorized",
              featured: product.is_featured || false,
              slug: product.slug,
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

