"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { 
  ArrowUpDown, 
  Search, 
  Users, 
  UserPlus, 
  ShoppingCart, 
  Calendar,
  MoreHorizontal,
  Mail,
  ExternalLink,
  AlertCircle
} from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import Link from "next/link"

type Customer = {
  id: string
  email: string
  full_name: string | null
  created_at: string
  last_sign_in_at: string | null
  total_orders: number
  total_spent: number
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof Customer>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()
  
  // Calculate metrics
  const totalCustomers = customers.length
  const newCustomersThisMonth = customers.filter(customer => {
    const createdDate = new Date(customer.created_at)
    const now = new Date()
    return createdDate.getMonth() === now.getMonth() && 
           createdDate.getFullYear() === now.getFullYear()
  }).length
  
  const activeCustomers = customers.filter(customer => 
    customer.last_sign_in_at && 
    new Date(customer.last_sign_in_at).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000)
  ).length
  
  const averageOrderValue = customers.length 
    ? customers.reduce((sum, customer) => sum + (customer.total_spent || 0), 0) / 
      customers.filter(customer => customer.total_orders > 0).length 
    : 0

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true)
        const response = await fetch("/api/customers")
        
        if (response.status === 401) {
          toast({
            title: "Authentication Required",
            description: "Please sign in as an admin to view customers.",
            variant: "destructive",
          })
          return
        }
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        setCustomers(data.customers)
      } catch (error) {
        console.error("Error fetching customers:", error)
        toast({
          title: "Error",
          description: "Failed to load customers. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [toast])

  // Filter and sort customers
  const filteredCustomers = customers
    .filter((customer) => {
      // Tab filter
      if (activeTab === "new" && 
          !(new Date(customer.created_at).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000))) {
        return false
      }
      if (activeTab === "active" && 
          !(customer.last_sign_in_at && 
            new Date(customer.last_sign_in_at).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000))) {
        return false
      }
      if (activeTab === "inactive" && 
          (customer.last_sign_in_at && 
            new Date(customer.last_sign_in_at).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000))) {
        return false
      }
      
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      return (
        customer.email.toLowerCase().includes(searchLower) ||
        (customer.full_name && customer.full_name.toLowerCase().includes(searchLower))
      )
    })
    .sort((a, b) => {
      const fieldA = a[sortField]
      const fieldB = b[sortField]
      
      // Handle null values
      if (fieldA === null && fieldB === null) return 0
      if (fieldA === null) return sortDirection === "asc" ? -1 : 1
      if (fieldB === null) return sortDirection === "asc" ? 1 : -1
      
      // Compare values based on field type
      if (typeof fieldA === "number" && typeof fieldB === "number") {
        return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA
      }
      
      // Convert to string and compare
      const strA = String(fieldA)
      const strB = String(fieldB)
      
      // Special handling for dates
      if (sortField === "created_at" || sortField === "last_sign_in_at") {
        return sortDirection === "asc" 
          ? new Date(strA).getTime() - new Date(strB).getTime()
          : new Date(strB).getTime() - new Date(strA).getTime()
      }
      
      return sortDirection === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA)
    })

  function formatDate(dateString: string | null) {
    if (!dateString) return "Never"
    
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>
      
      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newCustomersThisMonth}</div>
              <p className="text-xs text-muted-foreground">New registrations</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCustomers}</div>
              <p className="text-xs text-muted-foreground">Active in past 30 days</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(averageOrderValue || 0)}</div>
              <p className="text-xs text-muted-foreground">Per customer</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Customers Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-xl">Customer Management</CardTitle>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 md:w-64"
              />
            </div>
          </div>
          
          <Tabs onValueChange={setActiveTab} defaultValue="all" className="mt-3">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Customers</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {customers.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex h-60 flex-col items-center justify-center rounded-xl border bg-muted/30 p-8 text-center"
            >
              <div className="rounded-full bg-muted p-6 mb-4">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">No Customers Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                You don't have any customer data yet. As users register and make purchases, they'll appear here.
              </p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </motion.div>
          ) : filteredCustomers.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No customers match your search criteria</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => {
                      setSortDirection(sortField === "email" ? (sortDirection === "asc" ? "desc" : "asc") : "asc")
                      setSortField("email")
                    }} className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center">
                        Email
                        {sortField === "email" && (
                          <ArrowUpDown className={`ml-2 h-3.5 w-3.5 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => {
                      setSortDirection(sortField === "full_name" ? (sortDirection === "asc" ? "desc" : "asc") : "asc")
                      setSortField("full_name")
                    }} className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center">
                        Full Name
                        {sortField === "full_name" && (
                          <ArrowUpDown className={`ml-2 h-3.5 w-3.5 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => {
                      setSortDirection(sortField === "created_at" ? (sortDirection === "asc" ? "desc" : "asc") : "desc")
                      setSortField("created_at")
                    }} className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center">
                        Joined
                        {sortField === "created_at" && (
                          <ArrowUpDown className={`ml-2 h-3.5 w-3.5 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => {
                      setSortDirection(sortField === "last_sign_in_at" ? (sortDirection === "asc" ? "desc" : "asc") : "desc")
                      setSortField("last_sign_in_at")
                    }} className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center">
                        Last Sign In
                        {sortField === "last_sign_in_at" && (
                          <ArrowUpDown className={`ml-2 h-3.5 w-3.5 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => {
                      setSortDirection(sortField === "total_orders" ? (sortDirection === "asc" ? "desc" : "asc") : "desc")
                      setSortField("total_orders")
                    }} className="cursor-pointer hover:bg-muted/50 text-right">
                      <div className="flex items-center justify-end">
                        Orders
                        {sortField === "total_orders" && (
                          <ArrowUpDown className={`ml-2 h-3.5 w-3.5 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => {
                      setSortDirection(sortField === "total_spent" ? (sortDirection === "asc" ? "desc" : "asc") : "desc")
                      setSortField("total_spent")
                    }} className="cursor-pointer hover:bg-muted/50 text-right">
                      <div className="flex items-center justify-end">
                        Spent
                        {sortField === "total_spent" && (
                          <ArrowUpDown className={`ml-2 h-3.5 w-3.5 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.email}</TableCell>
                      <TableCell>{customer.full_name || "—"}</TableCell>
                      <TableCell>{formatDate(customer.created_at)}</TableCell>
                      <TableCell>{formatDate(customer.last_sign_in_at)}</TableCell>
                      <TableCell className="text-right">{customer.total_orders}</TableCell>
                      <TableCell className="text-right">{formatCurrency(customer.total_spent || 0)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Link href={`/admin/customers/${customer.id}`} className="flex w-full items-center">
                                <Users className="mr-2 h-4 w-4" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href={`/admin/orders?user=${customer.id}`} className="flex w-full items-center">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                View Orders
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View in Supabase
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
} 