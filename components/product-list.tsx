"use client"

import { useEffect, useState, useCallback } from "react"
import { useProducts } from "@/lib/db/products"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define a type that matches what's returned from the API
interface ProductWithCategory {
  id: string
  title: string
  subtitle: string | null
  slug: string
  description: string
  long_description: string | null
  price: number
  category_id: string | null
  features: any
  image_url: string | null
  is_featured: boolean | null
  created_at: string
  updated_at: string
  categories: any
}

// Create a safe wrapper component for cart functionality
function CartFunctionality({ children }: { children: (addToCart: (product: any) => void) => React.ReactNode }) {
  const { addToCart } = useCart()
  return <>{children(addToCart)}</>
}

function SafeCartWrapper({ children }: { children: (addToCart: (product: any) => void) => React.ReactNode }) {
  const [error, setError] = useState(false)
  
  if (error) {
    return <>{children(() => {})}</>
  }
  
  try {
    return <CartFunctionality>{children}</CartFunctionality>
  } catch (e) {
    setError(true)
    return <>{children(() => {})}</>
  }
}

export default function ProductList() {
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const productsApi = useProducts()
  const router = useRouter()
  const { toast } = useToast()

  // Use useCallback to memoize the fetchProducts function
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const data = await productsApi.getAll()
      setProducts(data)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [productsApi])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleAddToCart = useCallback((addToCart: (product: any) => void, product: ProductWithCategory) => (e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      addToCart({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        image_url: product.image_url || undefined,
        is_featured: product.is_featured || undefined,
        slug: product.slug
      })
      
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      })
    } catch (err) {
      toast({
        title: "Cart not available",
        description: "Please try refreshing the page",
        variant: "destructive"
      })
    }
  }, [toast])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-1/3" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="mb-2 text-xl font-semibold">Oops! Something went wrong</h3>
        <p className="mb-6 text-muted-foreground">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="mb-2 text-xl font-semibold">No products found</h3>
        <p className="text-muted-foreground">Check back later for new products.</p>
      </div>
    )
  }

  return (
    <SafeCartWrapper>
      {(addToCart) => (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            // Format price from cents to dollars
            const formattedPrice = (product.price / 100).toFixed(2)
            
            // Use slug for navigation if available, otherwise use id
            const productPath = product.slug ? `/products/${product.slug}` : `/products/${product.id}`
            
            return (
              <Card
                key={product.id}
                className="relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                onClick={() => router.push(productPath)}
              >
                {product.is_featured && <Badge className="absolute right-3 top-3 z-10">Featured</Badge>}

                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/50 to-secondary/50">
                  {product.image_url ? (
                    <div
                      className="absolute inset-0 transition-transform duration-500 hover:scale-105"
                      style={{
                        backgroundImage: `url(${product.image_url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 transition-transform duration-500 hover:scale-105"
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
                    <Button 
                      size="sm" 
                      onClick={handleAddToCart(addToCart, product)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </SafeCartWrapper>
  )
}

