"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, ArrowLeft, Share2, Bookmark } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  authorImage: string
  date: string
  readTime: string
  content: string
  featured?: boolean
}

interface BlogPostDetailProps {
  post: BlogPost
}

export default function BlogPostDetail({ post }: BlogPostDetailProps) {
  // Related posts would typically be fetched based on category or tags
  const relatedPosts = [
    {
      id: "content-strategy",
      title: "Content Strategy for Thriving Communities",
      excerpt: "Create a content calendar that keeps members engaged and attracts new prospects.",
      category: "Content",
      author: "Sophia Williams",
      authorImage: "/placeholder.svg?height=100&width=100",
      date: "March 5, 2024",
    },
    {
      id: "member-retention",
      title: "Advanced Retention Strategies for Mature Communities",
      excerpt: "Sophisticated approaches to keeping long-term members engaged and active.",
      category: "Retention",
      author: "Michael Brown",
      authorImage: "/placeholder.svg?height=100&width=100",
      date: "February 5, 2024",
    },
  ]

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all articles
          </Link>

          <Badge className="mb-4">{post.category}</Badge>

          <h1 className="mb-6 font-space-grotesk text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.authorImage} alt={post.author} />
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author}</div>
                <div className="text-sm text-muted-foreground">Community Expert</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative mb-10 aspect-[21/9] w-full overflow-hidden rounded-xl"
        >
          <Image src="/placeholder.svg?height=800&width=1600" alt={post.title} fill className="object-cover" />
        </motion.div>

        <div className="flex gap-4">
          <div className="hidden md:block">
            <div className="sticky top-24 flex flex-col gap-4">
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                <Bookmark className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1"
          >
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-8 flex items-center justify-between border-t border-b py-6">
              <div>
                <h3 className="font-medium">Share this article</h3>
                <p className="text-sm text-muted-foreground">Help others learn these strategies</p>
              </div>
              <div className="flex gap-2 md:hidden">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="mb-6 font-space-grotesk text-2xl font-bold">Related Articles</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="overflow-hidden">
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute left-3 top-3">{relatedPost.category}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 font-space-grotesk text-lg font-bold">
                        <Link href={`/blog/${relatedPost.id}`} className="hover:text-primary">
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="mb-3 text-sm text-muted-foreground">{relatedPost.excerpt}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{relatedPost.date}</span>
                        <Link href={`/blog/${relatedPost.id}`} className="font-medium text-primary hover:underline">
                          Read more
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

