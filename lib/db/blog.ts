import { getSupabaseServerClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"]

export interface BlogPostWithAuthor extends BlogPost {
  author_name?: string
  author_image?: string
}

export async function getBlogPosts() {
  const supabase = getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      profiles (
        full_name,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false })
  
  if (error) {
    console.error("Error fetching blog posts:", error)
    throw new Error("Failed to fetch blog posts")
  }
  
  // Transform data to include author information
  const formattedPosts: BlogPostWithAuthor[] = data.map((post) => ({
    ...post,
    author_name: post.profiles?.full_name || "Unknown Author",
    author_image: post.profiles?.avatar_url || null
  }))
  
  return formattedPosts
}

export async function getBlogPostById(id: string) {
  const supabase = getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      profiles (
        full_name,
        avatar_url
      )
    `)
    .eq("id", id)
    .single()
  
  if (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error)
    throw new Error("Failed to fetch blog post")
  }
  
  if (!data) {
    throw new Error("Blog post not found")
  }
  
  const formattedPost: BlogPostWithAuthor = {
    ...data,
    author_name: data.profiles?.full_name || "Unknown Author",
    author_image: data.profiles?.avatar_url || null
  }
  
  return formattedPost
}

export async function createBlogPost(postData: Partial<BlogPost>) {
  const supabase = getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("blog_posts")
    .insert([postData])
    .select()
  
  if (error) {
    console.error("Error creating blog post:", error)
    throw new Error("Failed to create blog post")
  }
  
  return data[0]
}

export async function updateBlogPost(id: string, postData: Partial<BlogPost>) {
  const supabase = getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("blog_posts")
    .update(postData)
    .eq("id", id)
    .select()
  
  if (error) {
    console.error(`Error updating blog post with ID ${id}:`, error)
    throw new Error("Failed to update blog post")
  }
  
  return data[0]
}

export async function deleteBlogPost(id: string) {
  const supabase = getSupabaseServerClient()
  
  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id)
  
  if (error) {
    console.error(`Error deleting blog post with ID ${id}:`, error)
    throw new Error("Failed to delete blog post")
  }
  
  return true
} 