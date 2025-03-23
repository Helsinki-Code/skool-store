"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Calendar,
  RefreshCcw,
  Loader2,
  LayoutGrid,
  List,
  Filter,
} from "lucide-react"

// Type definitions
interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  featured_image?: string
  published: boolean
  created_at: string
  updated_at: string
  author: {
    id: string
    email: string
    name?: string
  }
}

export default function AdminBlogPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  // Fetch blog posts
  useEffect(() => {
    fetchPosts()
  }, [])
  
  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/blog")
      
      if (!response.ok) {
        throw new Error("Failed to fetch blog posts")
      }
      
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Handle search and filtering
  const filteredPosts = posts.filter(post => {
    // Search query filter
    const matchesSearch = 
      searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Tab filter
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "published" && post.published) || 
      (activeTab === "drafts" && !post.published)
    
    // Category filter
    const matchesCategory = 
      !categoryFilter || post.category === categoryFilter
    
    return matchesSearch && matchesTab && matchesCategory
  })
  
  // Get unique categories
  const categories = Array.from(new Set(posts.map(post => post.category))).filter(Boolean)
  
  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchPosts()
    setIsRefreshing(false)
    
    toast({
      title: "Refreshed",
      description: "Blog posts have been refreshed.",
    })
  }
  
  // Handle delete post
  const handleDeletePost = async () => {
    if (!postToDelete) return
    
    try {
      const response = await fetch(`/api/blog/${postToDelete.slug}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete blog post")
      }
      
      // Remove from state
      setPosts(posts.filter(post => post.id !== postToDelete.id))
      
      toast({
        title: "Post deleted",
        description: `"${postToDelete.title}" has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete the blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setPostToDelete(null)
      setDeleteDialogOpen(false)
    }
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Blog Management</h1>
          <p className="text-muted-foreground">Create, edit, and manage your blog posts</p>
        </div>
        
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isRefreshing}>
            {isRefreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="mt-1 text-2xl font-bold">{posts.length}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <p className="mt-1 text-2xl font-bold">{posts.filter(post => post.published).length}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                <p className="mt-1 text-2xl font-bold">{posts.filter(post => !post.published).length}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="mt-1 text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Categories</p>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={categoryFilter === null ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setCategoryFilter(null)}
                >
                  All
                </Badge>
                {categories.map((category) => (
                  <Badge 
                    key={category} 
                    variant={categoryFilter === category ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link href="/blog" target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                View Blog
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <div className="md:col-span-3 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search blog posts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-muted" : ""}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-muted" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              {loading ? (
                viewMode === "list" ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 rounded-md border p-4">
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i}>
                        <CardHeader className="p-0">
                          <Skeleton className="h-48 w-full rounded-t-lg" />
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )
              ) : filteredPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <h3 className="mt-2 text-lg font-semibold">No posts found</h3>
                  <p className="mb-4 mt-1 text-sm text-muted-foreground">
                    {searchQuery ? "Try adjusting your search query" : "Get started by creating your first blog post"}
                  </p>
                  {!searchQuery && (
                    <Button asChild>
                      <Link href="/admin/blog/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Post
                      </Link>
                    </Button>
                  )}
                </div>
              ) : viewMode === "list" ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>
                            <Badge variant={post.published ? "default" : "secondary"}>
                              {post.published ? "Published" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell>{post.category}</TableCell>
                          <TableCell className="text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              <span>{formatDate(post.created_at)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/blog/${post.slug}`} target="_blank">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/blog/${post.slug}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => {
                                    setPostToDelete(post)
                                    setDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        {post.featured_image ? (
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <p className="text-sm text-muted-foreground">No image</p>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="line-clamp-1 font-semibold">{post.title}</h3>
                        <p className="line-clamp-2 mt-1 text-sm text-muted-foreground">
                          {post.excerpt || "No excerpt available"}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <Badge variant="outline">{post.category}</Badge>
                          <span className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDate(post.created_at)}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Eye className="mr-2 h-3 w-3" />
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/blog/${post.slug}/edit`}>
                            <Edit className="mr-2 h-3 w-3" />
                            Edit
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* The other tabs use the same content filtering with different activeTab values */}
            <TabsContent value="published" className="mt-6">
              {/* Same content as "all" tab but filtered for published posts */}
              {/* This is handled by the filteredPosts logic */}
            </TabsContent>
            
            <TabsContent value="drafts" className="mt-6">
              {/* Same content as "all" tab but filtered for draft posts */}
              {/* This is handled by the filteredPosts logic */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the blog post &quot;{postToDelete?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePost}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 