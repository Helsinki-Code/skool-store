"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function TrendingProducts() {
  const router = useRouter()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const { toast } = useToast()

  // Products from the PDF [^1]
  const trendingProducts = [
    {
      id: "digital-growth",
      slug: "digital-growth",
      title: "DIGITAL GROWTH COMMUNITY DISSECTED",
      subtitle: "The $1M/Year Blueprint",
      description:
        "One of Skool's most profitable communities built a 7-figure business by systematically defying conventional community wisdom.",
      price: 44700,
      category: "case-studies",
      featured: true,
    },
    {
      id: "skool-masterclass",
      slug: "skool-masterclass",
      title: "SKOOL MASTERCLASS DECODED",
      subtitle: "How They Command $125/Month While Others Struggle to Charge $10",
      description:
        "Skool Masterclass has built the ultimate premium positioning in a space filled with free alternatives.",
      price: 34700,
      category: "case-studies",
      featured: true,
    },
    {
      id: "max-business-school",
      slug: "max-business-school",
      title: "MAX BUSINESS SCHOOL PHENOMENON",
      subtitle: "Building a 164K-Member Free Community That Actually Monetizes",
      description:
        "Most massive free communities fail to convert to revenue, but Max Business School cracked the code.",
      price: 39700,
      category: "case-studies",
      featured: true,
    },
    {
      id: "cyberdojo",
      slug: "cyberdojo",
      title: "CYBERDOJO'S METEORIC RISE",
      subtitle: "From Zero to 36K Members in a Niche Everyone Said Was Saturated",
      description:
        "CyberDojo entered the seemingly overcrowded cybersecurity space and quickly built a 36K-member community.",
      price: 34700,
      category: "case-studies",
      featured: true,
    },
  ]

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
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section ref={ref} className="bg-muted/30 py-20">
      <div className="container px-4 md:px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <motion.h2
              className="font-space-grotesk text-3xl font-bold tracking-tighter sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              Trending Products
            </motion.h2>
            <motion.p
              className="mt-2 text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Our most popular resources for Skool community builders
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button variant="ghost" className="group" onClick={() => router.push("/products")}>
              View all products
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {trendingProducts.map((product) => {
            // Format price from cents to dollars
            const formattedPrice = (product.price / 100).toFixed(2)
            const productPath = `/products/${product.slug}`
            
            return (
              <motion.div key={product.id} variants={itemVariants}>
                <Card 
                  className="relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  onClick={() => router.push(productPath)}
                >
                  {product.featured && <Badge className="absolute right-3 top-3 z-10">Featured</Badge>}

                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/50 to-secondary/50">
                    <div
                      className="absolute inset-0 transition-transform duration-500 hover:scale-105"
                      style={{
                        backgroundImage: `url(/placeholder.svg?height=400&width=600)`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
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
                    <Link href={productPath} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
                      View Details
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

