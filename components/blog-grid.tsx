"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock } from "lucide-react"

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
  {
    id: "onboarding-sequence",
    title: "The Perfect Onboarding Sequence for New Members",
    excerpt: "How to create a first-week experience that turns newcomers into active participants.",
    category: "Onboarding",
    author: "James Wilson",
    authorImage: "/placeholder.svg?height=100&width=100",
    date: "February 18, 2024",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: "community-metrics",
    title: "Key Metrics Every Community Builder Should Track",
    excerpt: "The numbers that actually matter for measuring community health and growth potential.",
    category: "Analytics",
    author: "Olivia Martinez",
    authorImage: "/placeholder.svg?height=100&width=100",
    date: "February 12, 2024",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: "member-retention",
    title: "Advanced Retention Strategies for Mature Communities",
    excerpt: "Sophisticated approaches to keeping long-term members engaged and active.",
    category: "Retention",
    author: "Michael Brown",
    authorImage: "/placeholder.svg?height=100&width=100",
    date: "February 5, 2024",
    readTime: "8 min read",
    featured: false,
  },
  {
    id: "community-culture",
    title: "Building a Strong Community Culture",
    excerpt: "How to establish values, norms, and traditions that create a sense of belonging.",
    category: "Culture",
    author: "Sarah Johnson",
    authorImage: "/placeholder.svg?height=100&width=100",
    date: "January 30, 2024",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: "scaling-moderation",
    title: "Scaling Your Moderation as Your Community Grows",
    excerpt: "Systems and processes for maintaining quality conversations in communities of any size.",
    category: "Moderation",
    author: "Robert Garcia",
    authorImage: "/placeholder.svg?height=100&width=100",
    date: "January 25, 2024",
    readTime: "9 min read",
    featured: false,
  },
]

const categories = ["All", "Community Building", "Monetization", "Content", "Retention", "Analytics"]

export default function BlogGrid() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [visiblePosts, setVisiblePosts] = useState(6)

  const filteredPosts =
    activeCategory === "All" ? blogPosts : blogPosts.filter((post) => post.category === activeCategory)

  const displayedPosts = filteredPosts.slice(0, visiblePosts)

  const loadMore = () => {
    setVisiblePosts((prev) => prev + 3)
  }

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

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <Tabs defaultValue="All" className="mb-12">
        <TabsList className="mx-auto flex w-full max-w-3xl justify-start overflow-x-auto">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => {
                setActiveCategory(category)
                setVisiblePosts(6)
              }}
              className="min-w-max"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <motion.div
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        key={activeCategory} // Re-render animation when category changes
      >
        {displayedPosts.map((post, index) => (
          <motion.div key={post.id} variants={itemVariants} className="flex">
            <Card className="group flex h-full flex-col overflow-hidden">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <Badge className="absolute left-4 top-4">{post.category}</Badge>
              </div>

              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-center gap-2">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full">
                    <Image
                      src={post.authorImage || "/placeholder.svg"}
                      alt={post.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">{post.author}</span>
                </div>

                <h3 className="mb-2 flex-grow font-space-grotesk text-xl font-bold leading-tight tracking-tight">
                  <Link href={`/blog/${post.id}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </h3>

                <p className="mb-4 text-muted-foreground">{post.excerpt}</p>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <Link href={`/blog/${post.id}`} className="text-sm font-medium text-primary hover:underline">
                    Read more
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {visiblePosts < filteredPosts.length && (
        <div className="mt-12 text-center">
          <Button onClick={loadMore} variant="outline" size="lg">
            Load More Articles
          </Button>
        </div>
      )}
    </div>
  )
}

