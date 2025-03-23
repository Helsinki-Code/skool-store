-- Seed file for Skool Store
-- This file populates the database with some initial data to make the store functional

-- Insert sample categories
INSERT INTO categories (name, slug, description)
VALUES 
  ('Digital Marketing', 'digital-marketing', 'Resources to improve your digital marketing skills'),
  ('Social Media', 'social-media', 'Tools and guides for social media management'),
  ('SEO', 'seo', 'Search engine optimization resources and tools'),
  ('Content Creation', 'content-creation', 'Templates and guides for creating engaging content');

-- Insert sample products
INSERT INTO products (title, slug, description, price, image_url, category_id, is_featured, is_published)
VALUES 
  (
    'Social Media Growth Toolkit', 
    'social-media-growth-toolkit', 
    'A comprehensive toolkit to help you grow your social media presence including templates, scripts, and strategies.',
    29.99,
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    (SELECT id FROM categories WHERE slug = 'social-media'),
    true,
    true
  ),
  (
    'SEO Masterclass 2024', 
    'seo-masterclass-2024', 
    'Learn the latest SEO techniques to rank higher in search engines and drive more organic traffic to your website.',
    49.99,
    'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    (SELECT id FROM categories WHERE slug = 'seo'),
    true,
    true
  ),
  (
    'Content Calendar Template', 
    'content-calendar-template', 
    'A ready-to-use content calendar template to plan and organize your content marketing strategy for the entire year.',
    19.99,
    'https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    (SELECT id FROM categories WHERE slug = 'content-creation'),
    true,
    true
  ),
  (
    'Digital Marketing Roadmap', 
    'digital-marketing-roadmap', 
    'A step-by-step guide to implementing a successful digital marketing strategy for your business.',
    39.99,
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    (SELECT id FROM categories WHERE slug = 'digital-marketing'),
    false,
    true
  ),
  (
    'Instagram Growth Blueprint', 
    'instagram-growth-blueprint', 
    'A detailed blueprint for growing your Instagram following and engagement organically.',
    24.99,
    'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    (SELECT id FROM categories WHERE slug = 'social-media'),
    true,
    true
  ); 