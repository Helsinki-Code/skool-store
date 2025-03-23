-- Ensure profiles table exists with is_admin column
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add is_admin column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' 
                  AND column_name = 'is_admin') THEN
        ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    category TEXT,
    published BOOLEAN DEFAULT false,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read published blog posts
CREATE POLICY "Anyone can read published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (published = true);

-- Allow authenticated users to read their own draft posts
CREATE POLICY "Users can read their own blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (auth.uid() = author_id);

-- Allow only admins to insert blog posts
CREATE POLICY "Only admins can create blog posts" 
ON public.blog_posts 
FOR INSERT 
TO authenticated
WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
));

-- Allow only admins or the author to update blog posts
CREATE POLICY "Only admins or author can update blog posts" 
ON public.blog_posts 
FOR UPDATE 
TO authenticated
USING (
    auth.uid() = author_id OR 
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Allow only admins to delete blog posts
CREATE POLICY "Only admins can delete blog posts" 
ON public.blog_posts 
FOR DELETE 
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
));

-- Create an index on slug for faster lookups
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON public.blog_posts (slug);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.blog_posts;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Comment this section out and customize with your user ID to make yourself an admin
-- UPDATE public.profiles 
-- SET is_admin = true 
-- WHERE id = 'YOUR_USER_ID_HERE'; 