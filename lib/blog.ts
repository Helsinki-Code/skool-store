/**
 * Blog system configuration and helper functions
 */

export const BLOG_CATEGORIES = [
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

/**
 * Convert markdown content to a plain text excerpt
 */
export function generateExcerptFromMarkdown(content: string, maxLength = 150): string {
  if (!content) return ""
  
  // Strip markdown and take first characters
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
  
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength).trim() + "..."
    : plainText
}

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlugFromTitle(title: string): string {
  if (!title) return ""
  
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
}

/**
 * Format a date for display
 */
export function formatBlogDate(dateString: string): string {
  if (!dateString) return ""
  
  const date = new Date(dateString)
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

/**
 * Blog post type definition
 */
export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image?: string
  category: string
  published: boolean
  author_id?: string
  author?: {
    name?: string
    avatar?: string
  }
  created_at: string
  updated_at: string
}

/**
 * Check if a blog post is new (published in the last 7 days)
 */
export function isNewPost(post: BlogPost): boolean {
  if (!post.created_at) return false
  
  const publishDate = new Date(post.created_at)
  const now = new Date()
  const differenceInDays = Math.floor(
    (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  
  return differenceInDays <= 7
}

/**
 * Calculate estimated reading time for a blog post
 */
export function getReadingTime(content: string): number {
  if (!content) return 0
  
  // Average reading speed (words per minute)
  const wordsPerMinute = 200
  
  // Count words (rough estimate)
  const wordCount = content.trim().split(/\s+/).length
  
  // Calculate reading time in minutes
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  
  return readingTime || 1 // Minimum 1 minute
} 