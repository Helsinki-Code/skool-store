import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"

// Get all blog posts with optional pagination and filtering
export async function GET(req: NextRequest) {
  try {
    // Log the request path and query parameters
    console.log(`GET request to ${req.url}`)
    
    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")
    const category = searchParams.get("category")
    const publishedParam = searchParams.get("published")
    const offset = (page - 1) * limit
    
    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies })
    
    // Build the query
    let query = supabase
      .from("blog_posts")
      .select("*", { count: "exact" })
    
    // Apply filters if provided
    if (category) {
      query = query.eq("category", category)
    }
    
    if (publishedParam !== null) {
      const published = publishedParam === "true"
      query = query.eq("published", published)
    }
    
    // Get the results with pagination
    const { data: posts, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error("Error fetching blog posts:", error)
      return NextResponse.json(
        { error: "Error fetching blog posts", details: error },
        { status: 500 }
      )
    }
    
    // Fetch author information separately for each post that has an author_id
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        if (post.author_id) {
          const { data: authorData, error: authorError } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", post.author_id)
            .single()
          
          if (!authorError && authorData) {
            return {
              ...post,
              author: {
                full_name: authorData.full_name,
                avatar_url: authorData.avatar_url
              }
            }
          }
        }
        return post
      })
    )
    
    return NextResponse.json({
      posts: postsWithAuthors,
      total: count || 0,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0
    })
  } catch (error) {
    console.error("Error in GET /api/blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Create a new blog post
export async function POST(req: NextRequest) {
  try {
    console.log("POST request to /api/blog")
    
    // Check if the user is an admin
    const isUserAdmin = await isAdmin()
    
    if (!isUserAdmin) {
      console.error("Unauthorized attempt to create blog post")
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      )
    }
    
    // Get the request body
    const body = await req.json()
    
    // Validate required fields
    if (!body.title || !body.content || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, and category are required" },
        { status: 400 }
      )
    }
    
    // Create slug from title if not provided
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
    }
    
    // Create excerpt from content if not provided
    if (!body.excerpt) {
      // Extract first 150 characters from content
      body.excerpt = body.content.substring(0, 150)
      
      // Add ellipsis if content is longer than 150 characters
      if (body.content.length > 150) {
        body.excerpt += "..."
      }
    }
    
    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the current user's session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !sessionData.session) {
      console.error("Error getting user session:", sessionError)
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }
    
    // Add author_id to the post
    body.author_id = sessionData.session.user.id
    
    // Insert the blog post
    const { data: post, error } = await supabase
      .from("blog_posts")
      .insert(body)
      .select()
      .single()
    
    if (error) {
      console.error("Error creating blog post:", error)
      return NextResponse.json(
        { error: "Error creating blog post", details: error },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error in POST /api/blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 