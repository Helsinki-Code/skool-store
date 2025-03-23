"use client"

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
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Trash2, Plus, Search, ArrowUpDown, Package, Tag, ShoppingBag, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import type { Product } from "@/lib/db/products"

// Extended product interface to account for category, inventory and sku fields
interface ExtendedProduct extends Product {
  category?: string; // For easier access to categories.name
  inventory?: number;
  sku?: string;
  categories?: { name: string } | null;
}

interface AdminProductListProps {
  products: ExtendedProduct[]
}

export default function AdminProductList({ products: initialProducts }: AdminProductListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<ExtendedProduct[]>(
    // Transform the products to include category, inventory, and sku fields
    initialProducts.map(product => ({
      ...product,
      category: product.categories?.name || "Uncategorized",
      // Add defaults for inventory and sku if needed
      inventory: 0,
      sku: product.id.substring(0, 8)
    }))
  )
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<ExtendedProduct | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<string>("title")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category || "Uncategorized"))).sort()

  // Calculate metrics
  const totalProducts = products.length
  const totalValue = products.reduce((sum, product) => sum + (product.price * (product.inventory || 0)), 0)
  const lowStockCount = products.filter(p => (p.inventory || 0) < 5).length

  const handleDeleteClick = (product: ExtendedProduct) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      setProducts(products.filter((p) => p.id !== productToDelete.id))
      toast({
        title: "Product Deleted",
        description: `${productToDelete.title} has been removed successfully.`,
      })
      setDeleteDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditClick = (product: ExtendedProduct) => {
    router.push(`/admin/products/edit/${product.id}`)
  }

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Category filter
      if (categoryFilter !== "all" && product.category !== categoryFilter) {
        return false
      }
      
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      return (
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        (product.sku && product.sku.toLowerCase().includes(searchLower))
      )
    })
    .sort((a, b) => {
      // Handle price and inventory as numbers
      if (sortField === "price") {
        return sortDirection === "asc" ? a.price - b.price : b.price - a.price
      }

      if (sortField === "inventory") {
        const aStock = a.inventory || 0
        const bStock = b.inventory || 0
        return sortDirection === "asc" ? aStock - bStock : bStock - aStock
      }

      // Handle title, category, etc. as strings
      const aValue = String(a[sortField as keyof ExtendedProduct] || "")
      const bValue = String(b[sortField as keyof ExtendedProduct] || "")
      
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    })

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Dashboard metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/10 pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Package className="mr-1 h-4 w-4" />
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active items in inventory</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-green-500/10 pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Tag className="mr-1 h-4 w-4" />
                Inventory Value
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total value of all products</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-orange-500/10 pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <ShoppingBag className="mr-1 h-4 w-4" />
                Low Stock Items
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{lowStockCount}</div>
              <p className="text-xs text-muted-foreground">Products with less than 5 units</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Products List/Grid */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-xl">Products</CardTitle>
            
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 md:w-64"
                />
              </div>
              
              <Button
                variant="outline"
                className="h-9 gap-1"
                onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">{viewMode === "table" ? "Grid View" : "Table View"}</span>
              </Button>
              
              <Button
                variant="default"
                className="gap-1"
                onClick={() => router.push("/admin/products/new")}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Product</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <div className="flex overflow-auto pb-1 -mx-1 px-1">
              <div className="flex gap-1">
                <Button
                  variant={categoryFilter === "all" ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => setCategoryFilter("all")}
                >
                  All Categories
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={categoryFilter === category ? "default" : "outline"}
                    size="sm"
                    className="whitespace-nowrap"
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing {filteredProducts.length} of {products.length} products</span>
              
              <div className="flex items-center ml-auto gap-1">
                <span>Sort by:</span>
                <select
                  className="bg-transparent border rounded px-1 py-0.5 text-xs"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                >
                  <option value="title">Name</option>
                  <option value="price">Price</option>
                  <option value="category">Category</option>
                  <option value="inventory">Stock</option>
                </select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                >
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No products found matching your criteria</p>
            </div>
          ) : viewMode === "table" ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                        animate={{ opacity: 1, backgroundColor: "rgba(255, 255, 255, 0)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="group"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {product.image_url && (
                              <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                                <Image
                                  src={product.image_url}
                                  alt={product.title}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{product.title}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <span className={`${(product.inventory || 0) < 5 ? 'text-red-500' : ''}`}>
                            {product.inventory || 0}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-70 hover:opacity-100"
                              onClick={() => handleEditClick(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 opacity-70 hover:opacity-100 hover:text-red-500"
                              onClick={() => handleDeleteClick(product)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group"
                  >
                    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
                      <div className="relative aspect-square bg-muted">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-muted">
                            <Package className="h-10 w-10 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardContent className="flex-grow p-4">
                        <Badge variant="outline" className="mb-2">{product.category}</Badge>
                        <h3 className="font-medium line-clamp-1">{product.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold">${product.price.toFixed(2)}</span>
                          <span className={`text-sm ${(product.inventory || 0) < 5 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            Stock: {product.inventory || 0}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteClick(product)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {productToDelete?.title}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

