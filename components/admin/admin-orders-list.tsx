"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatCurrency } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Order {
  id: string
  user_id: string
  status: string
  total_amount: number
  created_at: string
  user_email?: string
  items?: any[]
}

interface AdminOrdersListProps {
  orders: Order[]
}

export default function AdminOrdersList({ orders: initialOrders }: AdminOrdersListProps) {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        order.id.toLowerCase().includes(query) ||
        (order.user_email && order.user_email.toLowerCase().includes(query))
      )
    }
    
    return true
  })

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order)
    setIsLoading(true)

    try {
      // Fetch order items
      const response = await fetch(`/api/orders/${order.id}/items`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch order items")
      }
      
      const data = await response.json()
      setOrderItems(data)
    } catch (error) {
      console.error("Error fetching order details:", error)
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsViewDialogOpen(true)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      // Update local state
      setOrders(
        orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )

      toast({
        title: "Status updated",
        description: `Order ${orderId} status changed to ${newStatus}`,
      })

    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "processing":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Processing</Badge>
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>{order.user_email || "Guest"}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order details dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order ID: {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <p>Loading order details...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Date: {selectedOrder && formatDate(selectedOrder.created_at)}</p>
                  <p className="text-sm text-muted-foreground">Customer: {selectedOrder?.user_email || "Guest"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Select 
                    value={selectedOrder?.status} 
                    onValueChange={(value) => selectedOrder && handleStatusChange(selectedOrder.id, value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium">Order Items</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.length > 0 ? (
                        orderItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.product_name || item.product_id}</TableCell>
                            <TableCell>{formatCurrency(item.price)}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            No items found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end border-t pt-4">
                <div className="space-y-1 text-right">
                  <p className="text-lg font-bold">
                    Total: {selectedOrder && formatCurrency(selectedOrder.total_amount)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 