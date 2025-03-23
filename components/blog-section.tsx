"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, Clock, ChevronRight, ChevronLeft } from "lucide-react"

// Blog post data
const blogPosts = [
  {
    id: "community-engagement",
    title: "7 Proven Strategies to Boost Community Engagement",
    excerpt: "Discover the tactics that top Skool communities use to maintain high engagement levels and reduce churn.",
    category: "Community Building",
    author: "Jessica Chen",
    authorImage: "/placeholder.svg?height=100&width=100",
    date: "March 15, 2024",
    readTime: "8 min read",
    featured: true,
  },
  {
    id: "monetization-models",
    title: "Monetization Models That Won't Alienate Your Members",
    excerpt: "Learn how to implement revenue streams that feel like added value rather than cash grabs.",
    category: "Monetization",
    author: "Marcus Johnson",
    authorImage: "/placeholder.svg?height=100&width=100",
    date: "March 10, 2024",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: "content-strategy",
    title: "Content Strategy for Thriving Communities",
    excerpt: "Create a content calendar that keeps members engaged and attracts new prospects to your community.",
    category: "Content",
    author: "Sophia Williams",
    authorImage: "/placeholder.svg?height=100&width=100",
    date: "March 5, 2024",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: "pricing-psychology",
    title: "The Psychology of Premium Pricing",
    excerpt: "Why some communities can charge 10x more than competitors and still have a waiting list.",
    category: "Pricing",
    author: "David Rodriguez",
    authorImage: "/placeholder.svg?height=100&width=100",
    date: "February 28, 2024",
    readTime: "9 min read",
    featured: false,
  },
  {
    id: "community-tools",
    title: "Essential Tools for Modern Community Builders",
    excerpt: "The tech stack that successful Skool communities use to scale operations and improve member experience.",
    category: "Tools",
    author: "Emma Thompson",
    authorImage: "/placeholder.svg?height=100&width=100",
    date: "February 22, 2024",
    readTime: "5 min read",
    featured: false,
  },
]

export default function BlogSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [currentIndex, setCurrentIndex] = useState(0)

  const featuredPost = blogPosts.find((post) => post.featured) || blogPosts[0]
  const regularPosts = blogPosts.filter((post) => post.id !== featuredPost.id)

  const visiblePosts = regularPosts.slice(currentIndex, currentIndex + 3)

  const nextSlide = () => {
    if (currentIndex + 3 < regularPosts.length) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <section ref={ref} className="bg-background py-20">
      <div className="container px-4 md:px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <motion.h2
              className="font-space-grotesk text-3xl font-bold tracking-tighter sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              Latest Insights
            </motion.h2>
            <motion.p
              className="mt-2 text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Expert advice and strategies for Skool community builders
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button variant="ghost" className="group" onClick={() => (window.location.href = "/blog")}>
              View all articles
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Featured Post - Takes 2 columns on large screens */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="group h-full overflow-hidden">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <Badge className="absolute left-4 top-4">{featuredPost.category}</Badge>
              </div>

              <CardContent className="flex h-full flex-col p-6">
                <div className="mb-4 flex items-center gap-2">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full">
                    <Image
                      src={featuredPost.authorImage || "/placeholder.svg"}
                      alt={featuredPost.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">{featuredPost.author}</span>
                </div>

                <h3 className="mb-2 flex-grow font-space-grotesk text-xl font-bold leading-tight tracking-tight">
                  <Link href={`/blog/${featuredPost.id}`} className="hover:text-primary">
                    {featuredPost.title}
                  </Link>
                </h3>

                <p className="mb-4 text-muted-foreground">{featuredPost.excerpt}</p>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <Link href={`/blog/${featuredPost.id}`} className="text-sm font-medium text-primary hover:underline">
                    Read more
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Regular Posts - Takes 3 columns on large screens */}
          <div className="relative lg:col-span-3">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visiblePosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <Card className="group h-full overflow-hidden">
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <Badge className="absolute left-3 top-3 text-xs">{post.category}</Badge>
                    </div>

                    <CardContent className="flex h-full flex-col p-4">
                      <h3 className="mb-2 flex-grow font-space-grotesk text-base font-bold leading-tight tracking-tight">
                        <Link href={`/blog/${post.id}`} className="hover:text-primary">
                          {post.title}
                        </Link>
                      </h3>

                      <div className="mt-auto flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{post.date}</span>
                        <Link href={`/blog/${post.id}`} className="font-medium text-primary hover:underline">
                          Read more
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Navigation arrows */}
            {regularPosts.length > 3 && (
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className="h-8 w-8 rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  disabled={currentIndex + 3 >= regularPosts.length}
                  className="h-8 w-8 rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button onClick={() => (window.location.href = "/blog")} className="group">
            Explore All Articles
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  )
}

