/**
 * Seed Products Script
 * 
 * This script imports all products from the Products.md file into the Supabase database
 * and creates the corresponding categories and product entries.
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import slugify from 'slugify'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Note: Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to convert price string to number
function priceToNumber(priceStr) {
  return parseFloat(priceStr.replace('$', '').replace(',', ''))
}

// Helper function to extract products from markdown
function extractProductsFromMarkdown(markdown) {
  const sections = markdown.split('##')
  const products = []
  
  sections.slice(1).forEach(section => {
    const lines = section.trim().split('\n')
    const categoryName = lines[0].trim().replace(/\*\*/g, '').replace(/🔍|📊|💰|🚀|📝|🗂️|✅|💸|📈|🛠️/g, '').trim()
    
    const tableStart = lines.findIndex(line => line.includes('| Product Title | Description | Price |'))
    if (tableStart === -1) return
    
    const tableRows = lines.slice(tableStart + 2)
    
    tableRows.forEach(row => {
      if (!row.includes('|')) return
      
      const [_, title, description, price] = row.split('|').map(cell => cell.trim())
      if (!title || !description || !price) return
      
      const cleanTitle = title.replace(/\*\*/g, '').replace(/"/g, '').trim()
      const cleanDescription = description.replace(/\*/g, '').trim()
      const priceValue = priceToNumber(price)
      
      products.push({
        title: cleanTitle,
        slug: slugify(cleanTitle, { lower: true }),
        description: cleanDescription,
        price: priceValue,
        category: categoryName,
        is_featured: Math.random() > 0.7, // Randomly set some products as featured
        is_published: true
      })
    })
  })
  
  return products
}

// Helper function to create categories
async function createCategories(products) {
  const categories = [...new Set(products.map(p => p.category))]
  
  const categoryData = categories.map(name => ({
    name,
    slug: slugify(name, { lower: true }),
    description: `${name} resources and tools for creators and community builders`
  }))
  
  for (const category of categoryData) {
    // Check if category exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category.slug)
      .single()
    
    if (!existingCategory) {
      console.log(`Creating category: ${category.name}`)
      await supabase.from('categories').insert(category)
    } else {
      console.log(`Category already exists: ${category.name}`)
    }
  }
  
  // Get all categories with their IDs
  const { data: allCategories } = await supabase
    .from('categories')
    .select('id, slug')
  
  return allCategories
}

// Helper function to create products
async function createProducts(products, categories) {
  for (const product of products) {
    // Find category ID
    const category = categories.find(c => c.slug === slugify(product.category, { lower: true }))
    const categoryId = category ? category.id : null
    
    // Check if product exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('slug', product.slug)
      .single()
    
    if (!existingProduct) {
      const imageIndex = Math.floor(Math.random() * 10) + 1
      console.log(`Creating product: ${product.title}`)
      await supabase.from('products').insert({
        title: product.title,
        slug: product.slug,
        description: product.description,
        price: product.price,
        image_url: `https://source.unsplash.com/random/800x600/?digital,product,${imageIndex}`,
        category_id: categoryId,
        is_featured: product.is_featured,
        is_published: product.is_published,
        long_description: product.description
      })
    } else {
      console.log(`Product already exists: ${product.title}`)
    }
  }
}

// Main execution function
async function seedProducts() {
  try {
    // Read the Products.md file
    const filePath = path.join(process.cwd(), 'data', 'Products.md')
    const markdown = fs.readFileSync(filePath, 'utf8')
    
    // Extract products from markdown
    const products = extractProductsFromMarkdown(markdown)
    console.log(`Extracted ${products.length} products from Products.md`)
    
    // Create categories
    const categories = await createCategories(products)
    
    // Create products
    await createProducts(products, categories)
    
    console.log('Products seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding products:', error)
  }
}

// Run the seed function
seedProducts() 