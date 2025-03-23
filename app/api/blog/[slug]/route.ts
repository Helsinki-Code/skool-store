import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Get a single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const supabase = createRouteHandlerClient({ cookies })
    
    console.log(`Fetching blog post with slug: ${slug}`)
    
    // Fetch the blog post without joining profiles
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single()
    
    if (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error)
      
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Blog post not found" },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: "Failed to fetch blog post", details: error },
        { status: 500 }
      )
    }
    
    // If there's an author_id, fetch the author data separately
    let authorData = null
    if (data.author_id) {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", data.author_id)
        .single()
      
      if (!profileError && profileData) {
        authorData = {
          id: data.author_id,
          name: profileData.full_name,
          avatar: profileData.avatar_url
        }
      } else if (profileError) {
        console.warn(`Could not fetch author info: ${profileError.message}`)
      }
    }
    
    // Format the response
    const formattedPost = {
      id: data.id,
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      featured_image: data.featured_image,
      category: data.category,
      published: data.published,
      created_at: data.created_at,
      updated_at: data.updated_at,
      author: authorData
    }
    
    return NextResponse.json({ post: formattedPost })
    
  } catch (error) {
    console.error("Error in blog GET API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Check if user is admin
    const adminCheck = await isAdmin()
    if (!adminCheck) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      )
    }
    
    const { slug } = params
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get request body
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ["title", "content", "category"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Find existing post to ensure it exists
    const { data: existingPost, error: fetchError } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .single()
    
    if (fetchError || !existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      )
    }
    
    // Update the blog post
    const { data, error } = await supabase
      .from("blog_posts")
      .update({
        title: body.title,
        slug: body.slug, // Allow slug changes
        content: body.content,
        excerpt: body.excerpt,
        featured_image: body.featured_image,
        category: body.category,
        published: body.published || false,
        updated_at: new Date().toISOString()
      })
      .eq("id", existingPost.id)
      .select()
    
    if (error) {
      console.error(`Error updating blog post with slug ${slug}:`, error)
      return NextResponse.json(
        { error: "Failed to update blog post", details: error },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      post: data[0]
    })
    
  } catch (error) {
    console.error("Error in blog PUT API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Check if user is admin
    const adminCheck = await isAdmin()
    if (!adminCheck) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      )
    }
    
    const { slug } = params
    const supabase = createRouteHandlerClient({ cookies })
    
    // Find existing post to ensure it exists
    const { data: existingPost, error: fetchError } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .single()
    
    if (fetchError || !existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      )
    }
    
    // Delete the blog post
    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", existingPost.id)
    
    if (error) {
      console.error(`Error deleting blog post with slug ${slug}:`, error)
      return NextResponse.json(
        { error: "Failed to delete blog post", details: error },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Blog post deleted successfully"
    })
    
  } catch (error) {
    console.error("Error in blog DELETE API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 