"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, X } from "lucide-react"
import type { Product, ProductInsert, ProductUpdate } from "@/lib/db/products"
import type { Category } from "@/lib/db/categories"

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [features, setFeatures] = useState<string[]>(
    product?.features 
      ? (Array.isArray(product.features) 
          ? product.features.map(f => String(f)) 
          : [])
      : []
  )
  const [newFeature, setNewFeature] = useState("")

  // Form state
  const [formData, setFormData] = useState<ProductInsert | ProductUpdate>({
    title: product?.title || "",
    subtitle: product?.subtitle || "",
    slug: product?.slug || "",
    description: product?.description || "",
    long_description: product?.long_description || "",
    price: product?.price || 0,
    category_id: product?.category_id || "",
    is_featured: product?.is_featured || false,
    image_url: product?.image_url || "",
  })

  // Update features when they change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      features: features,
    }))
  }, [features])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Handle price conversion from dollars to cents
    if (name === "price") {
      const priceInCents = Math.round(Number.parseFloat(value) * 100)
      setFormData({ ...formData, [name]: priceInCents })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, is_featured: checked })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, category_id: value })
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.slug || !formData.description || formData.price === 0) {
        throw new Error("Please fill in all required fields")
      }

      const url = product ? `/api/products/${product.id}` : "/api/products"

      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save product")
      }

      toast({
        title: product ? "Product updated" : "Product created",
        description: product
          ? `${formData.title} has been updated successfully.`
          : `${formData.title} has been created successfully.`,
      })

      // Redirect to products list
      router.push("/admin/products")
      router.refresh()
    } catch (error: any) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to convert price from cents to dollars for display
  const formatPriceForInput = (priceInCents: number) => {
    return ((priceInCents || 0) / 100).toFixed(2)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input id="title" name="title" value={formData.title || ""} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" name="subtitle" value={formData.subtitle || ""} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug || ""}
              onChange={handleChange}
              required
              placeholder="unique-product-slug"
            />
            <p className="text-xs text-muted-foreground">URL-friendly name (e.g., "digital-growth-blueprint")</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">
              Price ($) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formatPriceForInput(formData.price || 0)}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category_id || ""} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Uncategorized</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              name="image_url"
              value={formData.image_url || ""}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <Checkbox id="is_featured" checked={formData.is_featured || false} onCheckedChange={handleCheckboxChange} />
            <Label htmlFor="is_featured">Featured product</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="long_description">Long Description</Label>
            <Textarea
              id="long_description"
              name="long_description"
              value={formData.long_description || ""}
              onChange={handleChange}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label>Product Features</Label>
            <div className="flex gap-2">
              <Input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Add a feature" />
              <Button type="button" variant="outline" onClick={handleAddFeature} disabled={!newFeature.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 space-y-2">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="flex items-center justify-between p-3">
                    <span>{feature}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveFeature(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {features.length === 0 && <p className="text-sm text-muted-foreground">No features added yet.</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {product ? "Updating..." : "Creating..."}
            </>
          ) : product ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
      </div>
    </form>
  )
}

