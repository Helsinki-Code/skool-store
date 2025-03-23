# Blog Management System Setup

This document provides instructions for setting up the blog management system for your Skool Store application.

## Features

- **Admin Blog Dashboard**: Manage all blog posts from a centralized dashboard
- **Create/Edit Posts**: Rich markdown editor for creating and editing blog content
- **Categories**: Organize posts by categories
- **Publishing Control**: Publish posts or save as drafts
- **Preview Mode**: Preview content before publishing
- **Image Support**: Add featured images and inline images in content
- **SEO-friendly**: Custom slugs, excerpts, and metadata

## Setup Instructions

### 1. Database Setup

Run the SQL script in Supabase SQL Editor to create the required table and policies:

```sql
-- Copy the contents of schema/blog_posts.sql here
```

You can find the complete SQL script in the `schema/blog_posts.sql` file.

### 2. Environment Variables

Ensure your Supabase environment variables are correctly set in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Dependencies

Install the required dependencies:

```bash
npm install @uiw/react-md-editor --legacy-peer-deps
```

### 4. Access the Blog Management

After running your application, navigate to:

```
/admin/blog
```

You must be logged in as an admin user to access this section.

## Blog Management Routes

- `/admin/blog` - Blog management dashboard (list all posts)
- `/admin/blog/new` - Create a new blog post
- `/admin/blog/[slug]/edit` - Edit an existing blog post

## API Endpoints

- `GET /api/blog` - Get all blog posts (with optional pagination and filtering)
- `POST /api/blog` - Create a new blog post
- `GET /api/blog/[slug]` - Get a specific blog post by slug
- `PUT /api/blog/[slug]` - Update a specific blog post by slug
- `DELETE /api/blog/[slug]` - Delete a specific blog post by slug

## Structure

- `components/admin/blog-editor.tsx` - The main blog post editor component
- `app/admin/blog/*` - Blog management pages
- `app/api/blog/*` - API endpoints for blog CRUD operations
- `schema/blog_posts.sql` - SQL schema for the blog_posts table

## Publishing Workflow

1. Create a new post in the editor
2. Preview your content to ensure it looks correct
3. Configure settings (slug, excerpt, category, etc.)
4. Save as draft or publish immediately
5. Edit or update published posts as needed
6. Delete posts that are no longer needed

## Customization

You can customize the blog system by:

- Modifying the category options in the `blog-editor.tsx` component
- Adding new fields to the blog post schema (requires DB and component updates)
- Customizing the design and layout of the blog management interfaces
- Enhancing the markdown editor with additional formatting options

## Troubleshooting

Common issues:

- **Permission Errors**: Ensure your user has admin privileges in the profiles table
- **Missing Posts**: Check that the RLS policies are correctly set up
- **Markdown Editor Issues**: Make sure the @uiw/react-md-editor package is installed
- **API Errors**: Check the server logs for detailed error messages 