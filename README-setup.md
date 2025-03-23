# Skool Store Database Setup Guide

This guide will help you set up all necessary database tables and configurations for the Skool Store application.

## Prerequisites

1. A Supabase project set up with authentication enabled
2. Access to the Supabase SQL Editor
3. Admin access to your Supabase project

## Database Setup Steps

Follow these steps in order to set up your database properly:

### 1. Create the Profiles Table and Admin Settings

Run the following SQL in the Supabase SQL Editor:

```sql
-- Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read their own profile"
  ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Insert an admin user (replace with your user ID from Supabase auth)
-- UPDATE public.profiles 
-- SET is_admin = true 
-- WHERE id = 'YOUR_USER_ID_HERE';
```

### 2. Create the Categories Table

Run the `schema/categories.sql` file in the SQL Editor:

```sql
-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create categories policies
CREATE POLICY "Anyone can read categories"
  ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can create categories"
  ON public.categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update categories"
  ON public.categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete categories"
  ON public.categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

### 3. Create the Products Table

Run the `schema/products.sql` file in the SQL Editor:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price DECIMAL NOT NULL,
  inventory INTEGER NOT NULL DEFAULT 0,
  category_id UUID REFERENCES public.categories(id),
  featured BOOLEAN DEFAULT false,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create products policies
CREATE POLICY "Anyone can read products"
  ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Admins can create products"
  ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update products"
  ON public.products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete products"
  ON public.products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

### 4. Create the Blog Posts Table

Run the `schema/blog_posts.sql` file in the SQL Editor:

```sql
-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  featured_image TEXT,
  category TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on blog_posts table
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blog posts
CREATE POLICY "Everyone can read published blog posts"
  ON public.blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can read all blog posts"
  ON public.blog_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can insert blog posts"
  ON public.blog_posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update blog posts"
  ON public.blog_posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete blog posts"
  ON public.blog_posts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

### 5. Create the Store Settings Table

Run the `schema/store_settings.sql` file in the SQL Editor:

```sql
-- Create the store_settings table
CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  store_name TEXT NOT NULL DEFAULT 'Skool Store',
  store_description TEXT DEFAULT 'The ultimate online store for educational products',
  contact_email TEXT NOT NULL DEFAULT 'contact@skoolstore.com',
  support_phone TEXT,
  business_address TEXT,
  currency TEXT DEFAULT 'USD',
  tax_rate DECIMAL DEFAULT 8.5, 
  shipping_fee DECIMAL DEFAULT 5.99,
  free_shipping_threshold DECIMAL DEFAULT 50.0,
  enable_user_reviews BOOLEAN DEFAULT true,
  enable_wishlist BOOLEAN DEFAULT true,
  maintenance_mode BOOLEAN DEFAULT false,
  social_media JSONB DEFAULT '{"facebook": "https://facebook.com/skoolstore", "twitter": "https://twitter.com/skoolstore", "instagram": "https://instagram.com/skoolstore"}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Configure access policies (RLS)
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read the default store settings
CREATE POLICY "Anyone can read default store settings"
  ON public.store_settings
  FOR SELECT USING (
    id = 'default'
  );

-- Only admins can modify store settings
CREATE POLICY "Admins can manage store settings"
  ON public.store_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Insert default settings
INSERT INTO public.store_settings (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;
```

### 6. Set up an Admin User

After running all SQL files, you need to set up an admin user:

1. Sign up a new user in your application 
2. Get the user ID from the Supabase Auth dashboard
3. Run the following SQL to make them an admin:

```sql
UPDATE public.profiles 
SET is_admin = true 
WHERE id = 'YOUR_USER_ID_HERE';
```

## Troubleshooting

### Missing Tables

If you encounter errors about missing tables, ensure you've run all the SQL files in the order specified above.

### RLS Policy Errors

If you encounter RLS policy errors, check that:
1. All tables have RLS enabled
2. The policies are correctly created
3. Your user has the `is_admin` flag set to true in the profiles table

### Missing Columns

If you encounter errors about missing columns, check the SQL files to ensure all required columns are defined in your tables. 