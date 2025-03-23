"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Trash2, Plus, Search, Loader2 } from "lucide-react"
import type { Category, CategoryInsert, CategoryUpdate } from "@/lib/db/categories"

interface CategoryListProps {
  categories: Category[]
}

export default function CategoryList({ categories: initialCategories }: CategoryListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState(initialCategories)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // New/Edit category dialog state
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<CategoryInsert | CategoryUpdate>({
    name: "",
    slug: "",
    description: "",
    gradient: "",
  })

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete category")
      }

      // Remove the category from the local state
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id))

      toast({
        title: "Category deleted",
        description: `${categoryToDelete.name} has been deleted successfully.`,
      })

      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditClick = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      gradient: category.gradient || "",
    })
    setIsFormDialogOpen(true)
  }

  const handleNewCategory = () => {
    setEditingCategory(null)
    setFormData({
      name: "",
      slug: "",
      description: "",
      gradient: "",
    })
    setIsFormDialogOpen(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.slug) {
        throw new Error("Name and slug are required")
      }

      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories"

      const method = editingCategory ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save category")
      }

      const savedCategory = await response.json()

      if (editingCategory) {
        // Update existing category in the list
        setCategories(categories.map((c) => (c.id === editingCategory.id ? savedCategory : c)))
      } else {
        // Add new category to the list
        setCategories([...categories, savedCategory])
      }

      toast({
        title: editingCategory ? "Category updated" : "Category created",
        description: editingCategory
          ? `${formData.name} has been updated successfully.`
          : `${formData.name} has been created successfully.`,
      })

      setIsFormDialogOpen(false)
    } catch (error: any) {
      console.error("Error saving category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search categories..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={handleNewCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell className="max-w-xs truncate">{category.description || "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(category)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteClick(category)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredCategories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {searchQuery ? "No categories found matching your search." : "No categories found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{categoryToDelete?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Category Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the details for this category"
                : "Add a new category to organize your products"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input id="name" name="name" value={formData.name || ""} onChange={handleFormChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ""}
                  onChange={handleFormChange}
                  required
                  placeholder="category-slug"
                />
                <p className="text-xs text-muted-foreground">URL-friendly name (e.g., "digital-products")</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description || ""} onChange={handleFormChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gradient">CSS Gradient</Label>
                <Input
                  id="gradient"
                  name="gradient"
                  value={formData.gradient || ""}
                  onChange={handleFormChange}
                  placeholder="linear-gradient(to right, #9333ea, #4f46e5)"
                />
                <p className="text-xs text-muted-foreground">Optional CSS gradient for category styling</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsFormDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingCategory ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>{editingCategory ? "Save Changes" : "Create Category"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

