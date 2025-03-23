"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, ListFilter, ArrowUpDown, Search, Package, DollarSign, Users, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

type Order = {
  id: string
  user_id: string
  status: string
  total: number
  created_at: string
  user_email?: string
  items?: OrderItem[]
}

type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product_name?: string
}

export default function AdminOrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("created_at")
  const [sortDirection, setSortDirection] = useState("desc")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Calculate metrics
  const totalRevenue = orders.reduce((total, order) => total + order.total, 0)
  const pendingOrders = orders.filter(order => order.status === "pending").length
  const uniqueCustomers = new Set(orders.map(order => order.user_id)).size

  // Fetch orders
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)
        const response = await fetch("/api/orders")
        
        if (response.status === 401) {
          // Handle unauthorized error
          toast({
            title: "Authentication Required",
            description: "Please sign in as an admin to view orders.",
            variant: "destructive",
          })
          setOrders([])
          return
        }
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Failed to load orders. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  // If we're not showing any loading state and no orders are found, show an empty state
  if (orders.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-80 flex-col items-center justify-center rounded-xl border bg-muted/30 p-8 text-center"
      >
        <div className="rounded-full bg-muted p-6 mb-4">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">No Orders Found</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          You may need to sign in as an admin to view orders. Once you're authorized, orders will appear here.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </motion.div>
    )
  }

  // Handle order details view
  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
    setOrderItems([])

    try {
      const response = await fetch(`/api/orders/${order.id}/items`)
      if (!response.ok) {
        throw new Error("Failed to fetch order items")
      }
      const data = await response.json()
      setOrderItems(data)
    } catch (error) {
      console.error("Error fetching order items:", error)
      toast({
        title: "Error",
        description: "Failed to load order details. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle status update
  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedOrder) return

    setUpdatingStatus(true)

    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      // Update the orders list
      setOrders(orders.map((order) => (order.id === selectedOrder.id ? { ...order, status: newStatus } : order)))

      // Update the selected order
      setSelectedOrder({ ...selectedOrder, status: newStatus })

      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      // Tab filter
      if (activeTab !== "all" && order.status !== activeTab) return false
      
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        order.id.toLowerCase().includes(searchLower) || (order.user_email || "").toLowerCase().includes(searchLower)

      // Status filter
      const matchesStatus = statusFilter === "all" || order.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === "created_at") {
        return sortDirection === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }

      if (sortField === "total") {
        return sortDirection === "asc" ? a.total - b.total : b.total - a.total
      }

      // Default sort by ID
      return sortDirection === "asc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
    })

  // Status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "processing":
        return "warning"
      case "completed":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Dashboard overview cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/10 pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <DollarSign className="mr-1 h-4 w-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From {orders.length} orders</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-orange-500/10 pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Package className="mr-1 h-4 w-4" />
                Pending Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-blue-500/10 pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="mr-1 h-4 w-4" />
                Unique Customers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{uniqueCustomers}</div>
              <p className="text-xs text-muted-foreground">Total customers</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Orders main content */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-xl">Orders</CardTitle>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 md:w-64"
              />
            </div>
          </div>
          
          <Tabs onValueChange={setActiveTab} defaultValue="all" className="mt-3">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <ListFilter className="mr-1 h-4 w-4" />
              <span>Showing {filteredOrders.length} of {orders.length} orders</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger className="h-8 md:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date</SelectItem>
                  <SelectItem value="total">Total</SelectItem>
                  <SelectItem value="id">Order ID</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredOrders.map((order) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                        animate={{ opacity: 1, backgroundColor: "rgba(255, 255, 255, 0)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="group"
                      >
                        <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                        <TableCell>{formatDate(order.created_at)}</TableCell>
                        <TableCell>{order.user_email || "Unknown"}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewOrder(order)}
                            className="transition-all hover:bg-primary hover:text-primary-foreground"
                          >
                            View
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder && (
                <span>
                  Order #{selectedOrder.id.substring(0, 8)}... • {formatDate(selectedOrder.created_at)}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Customer</h4>
                  <p>{selectedOrder.user_email || "Unknown"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>{selectedOrder.status}</Badge>
                    <Select value={selectedOrder.status} onValueChange={handleStatusUpdate} disabled={updatingStatus}>
                      <SelectTrigger className="h-7 w-[130px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    {updatingStatus && <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-primary"></div>}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">Items</h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.length > 0 ? (
                        orderItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.product_name || `Product #${item.product_id}`}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center">
                            <div className="flex justify-center py-4">
                              <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-between border-t pt-4">
                <span className="font-medium">Total</span>
                <span className="font-bold">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

