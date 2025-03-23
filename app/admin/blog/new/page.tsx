"use client"

import BlogEditor from "@/components/admin/blog-editor"
import { requireAdmin } from "@/lib/admin"

export default function NewBlogPostPage() {
  // Server-side admin check is handled by the middleware
  // but we also do a client-side check
  requireAdmin()
  
  return (
    <div className="container py-6">
      <BlogEditor />
    </div>
  )
} 