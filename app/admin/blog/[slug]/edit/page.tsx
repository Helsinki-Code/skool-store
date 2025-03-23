"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import BlogEditor from "@/components/admin/blog-editor"
import { requireAdmin } from "@/lib/admin"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, RefreshCcw } from "lucide-react"
import Link from "next/link"

export default function EditBlogPostPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [blogPost, setBlogPost] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Server-side admin check is handled by the middleware
  // but we also do a client-side check
  requireAdmin()
  
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/blog/${params.slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Blog post not found")
          }
          throw new Error("Failed to fetch blog post")
        }
        
        const data = await response.json()
        setBlogPost(data.post)
      } catch (error) {
        console.error("Error fetching blog post:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch blog post")
        
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch blog post",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    if (params.slug) {
      fetchBlogPost()
    }
  }, [params.slug, toast])
  
  if (loading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog Posts
            </Link>
          </Button>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }
  
  if (error || !blogPost) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog Posts
            </Link>
          </Button>
        </div>
        <div className="rounded-lg border border-destructive p-8 text-center">
          <h2 className="text-xl font-semibold text-destructive">Error</h2>
          <p className="mt-2 text-muted-foreground">{error || "Failed to load blog post"}</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button onClick={() => router.refresh()}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/blog">
                Return to Blog Posts
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-6">
      <BlogEditor initialData={blogPost} isEditing={true} />
    </div>
  )
} 