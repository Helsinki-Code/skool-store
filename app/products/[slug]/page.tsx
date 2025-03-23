import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductBySlug } from "@/actions/product-actions"
import ProductBuyButton from "@/components/products/product-buy-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import { formatPrice } from "@/lib/utils"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found",
    }
  }

  return {
    title: `${product.title} | Skool Store`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const category = product.categories

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col gap-4">
              <div className="overflow-hidden rounded-lg bg-gray-100">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="aspect-square w-full object-cover transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center text-gray-500">
                    No image available
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {category && (
                  <Badge variant="outline" className="w-fit">
                    {category.name}
                  </Badge>
                )}
                <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
                <div className="text-3xl font-bold text-primary">{formatPrice(product.price)}</div>
              </div>
              <Separator className="my-4" />
              <div className="prose max-w-none">
                <p>{product.description}</p>
                {product.long_description && <p>{product.long_description}</p>}
              </div>
              <div className="flex gap-4 pt-4">
                <ProductBuyButton productId={product.id} />
                <Button variant="outline">Add to Cart</Button>
              </div>
              {product.features && (
                <div className="mt-8">
                  <h3 className="mb-4 text-xl font-semibold">Features</h3>
                  <ul className="list-inside list-disc space-y-2">
                    {Array.isArray(product.features) ? (
                      product.features.map((feature: string, index: number) => (
                        <li key={index}>{feature}</li>
                      ))
                    ) : typeof product.features === 'object' ? (
                      Object.entries(product.features as Record<string, string>).map(([key, value]) => (
                        <li key={key}>{String(value)}</li>
                      ))
                    ) : null}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

