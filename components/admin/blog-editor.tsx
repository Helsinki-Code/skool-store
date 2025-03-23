"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Image as ImageIcon, Link as LinkIcon, Eye, Save, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import dynamic from "next/dynamic"

// Import MDEditor dynamically to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor').then(mod => mod.default), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
})

// Form validation schema
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug can only contain lowercase letters, numbers, and hyphens",
  }),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(200, "Excerpt cannot exceed 200 characters"),
  category: z.string().min(1, "Category is required"),
  featured_image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  published: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

type BlogEditorProps = {
  initialData?: Partial<FormValues>
  isEditing?: boolean
}

export default function BlogEditor({ initialData, isEditing = false }: BlogEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  
  // Initialize form with default values or editing data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      content: initialData?.content || "",
      excerpt: initialData?.excerpt || "",
      category: initialData?.category || "",
      featured_image: initialData?.featured_image || "",
      published: initialData?.published || false,
    },
  })
  
  // Generate slug from title
  const generateSlug = () => {
    const title = form.getValues("title")
    if (!title) return
    
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
    
    form.setValue("slug", slug, { shouldValidate: true })
  }
  
  // Generate excerpt from content
  const generateExcerpt = () => {
    const content = form.getValues("content")
    if (!content) return
    
    // Strip markdown and take first 150 characters
    const plainText = content
      .replace(/#+\s(.*)/g, "$1") // Remove headings
      .replace(/\*\*(.*)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*)\*/g, "$1") // Remove italic
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links
      .replace(/!\[(.*?)\]\(.*?\)/g, "") // Remove images
      .replace(/```[^`]*```/g, "") // Remove code blocks
      .replace(/`([^`]*)`/g, "$1") // Remove inline code
      .replace(/>\s(.*)/g, "$1") // Remove blockquotes
      .replace(/\n+/g, " ") // Replace newlines with spaces
      .trim()
    
    const excerpt = plainText.length > 150 
      ? plainText.substring(0, 150).trim() + "..."
      : plainText
    
    form.setValue("excerpt", excerpt, { shouldValidate: true })
  }
  
  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true)
      
      const endpoint = isEditing 
        ? `/api/blog/${initialData?.slug}` 
        : "/api/blog"
      
      const method = isEditing ? "PUT" : "POST"
      
      console.log("Submitting blog post to:", endpoint)
      console.log("Data being sent:", data)
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      
      const responseData = await response.json()
      
      if (!response.ok) {
        console.error("API error response:", responseData)
        throw new Error(
          responseData.error || 
          responseData.message || 
          responseData.details || 
          "Failed to save blog post"
        )
      }
      
      console.log("API success response:", responseData)
      
      toast({
        title: isEditing ? "Blog post updated" : "Blog post created",
        description: isEditing 
          ? "Your changes have been saved successfully." 
          : "Your new blog post has been created successfully.",
      })
      
      // Redirect to blog list or published post
      if (data.published) {
        router.push(`/blog/${data.slug}`)
      } else {
        router.push("/admin/blog")
      }
      
    } catch (error) {
      console.error("Error saving blog post:", error)
      toast({
        title: "Error Saving Blog Post",
        description: error instanceof Error ? error.message : "Failed to save blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    "Community Building",
    "Monetization",
    "Content",
    "Pricing",
    "Tools",
    "Onboarding",
    "Analytics",
    "Retention",
    "Culture",
    "Moderation",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog Posts
          </Link>
        </Button>
        
        {isEditing && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/blog/${initialData?.slug}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              View Published Post
            </Link>
          </Button>
        )}
      </div>
      
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
        </h1>
        <p className="text-muted-foreground">
          {isEditing 
            ? "Update your blog post content and settings." 
            : "Create a new blog post for your store."}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="content">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              {previewMode && <TabsTrigger value="preview">Preview</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="content" className="space-y-6">
              {/* Title field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter a captivating title" 
                        {...field} 
                        className="text-lg font-medium"
                        onBlur={() => {
                          if (!isEditing && !form.getValues("slug")) {
                            generateSlug()
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Content field */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <div className="flex justify-between items-center space-x-2 mb-2">
                      <FormDescription>
                        Write your post content using Markdown
                      </FormDescription>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={generateExcerpt}
                      >
                        Generate Excerpt
                      </Button>
                    </div>
                    <FormControl>
                      <div data-color-mode="light">
                        <MDEditor
                          value={field.value}
                          onChange={(value) => field.onChange(value || '')}
                          height={400}
                          preview="edit"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  {previewMode ? (
                    <>Edit Mode</>
                  ) : (
                    <>Preview Mode</>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Slug field */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2">
                          <Input 
                            placeholder="url-friendly-slug" 
                            {...field} 
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={generateSlug}
                          >
                            Generate
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Will be used in the URL: /blog/{field.value || "your-slug"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Category field */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          {...field}
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Excerpt field */}
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief summary of your post" 
                        {...field} 
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      A short description that will appear in blog listing (max 200 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Featured Image field */}
              <FormField
                control={form.control}
                name="featured_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image URL</FormLabel>
                    <FormControl>
                      <div className="flex space-x-2">
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          {...field} 
                        />
                        <Button type="button" variant="outline">
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      URL to the main image for this post
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Published toggle */}
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Publish Post
                      </FormLabel>
                      <FormDescription>
                        When enabled, this post will be visible on your blog
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </TabsContent>
            
            {previewMode && (
              <TabsContent value="preview">
                <Card>
                  <CardContent className="p-6">
                    <article className="prose prose-slate max-w-none">
                      <h1>{form.getValues("title")}</h1>
                      {form.getValues("featured_image") && (
                        <img 
                          src={form.getValues("featured_image")} 
                          alt={form.getValues("title")} 
                          className="rounded-lg object-cover w-full max-h-96 mb-6"
                        />
                      )}
                      <div data-color-mode="light">
                        <MDEditor.Markdown source={form.getValues("content")} />
                      </div>
                    </article>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
          
          <Alert>
            <AlertTitle>Before you publish</AlertTitle>
            <AlertDescription>
              Make sure to preview your content and check for any spelling or grammar errors.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Update Post" : "Save Post"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 