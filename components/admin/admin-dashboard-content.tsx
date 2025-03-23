"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  BarChart3,
  LineChart,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

// Update the type definition to match the new API response structure
type MetricData = {
  total: number
  previous: number
  trend: number
}

type RecentOrder = {
  id: string
  customer: {
    name: string
    image: string | null
  }
  status: string
  total: number
  date: string
}

type PopularProduct = {
  id: string
  name: string
  price: number
  sales: number
}

type DashboardData = {
  revenue: MetricData
  orders: MetricData
  products: MetricData
  customers: MetricData
  recentOrders: RecentOrder[]
  popularProducts: PopularProduct[]
  lowStockProducts: number
}

export function AdminDashboardContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch("/api/dashboard")
        
        if (response.status === 401) {
          setError("Authentication required")
          toast({
            title: "Authentication Required",
            description: "Please sign in as an admin to view the dashboard.",
            variant: "destructive",
          })
          return
        }
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`)
        }
        
        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data")
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }
  
  // Determine the color based on trend value
  function getDeltaColor(trend: number) {
    return trend >= 0 ? "text-green-500" : "text-red-500"
  }
  
  // Get the arrow icon based on trend value
  function getDeltaIcon(trend: number) {
    return trend >= 0 ? ArrowUpRight : ArrowDownRight
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-28" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
          ))}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div 
        className="flex h-80 flex-col items-center justify-center rounded-xl border bg-muted/30 p-8 text-center"
      >
        <div className="rounded-full bg-muted p-6 mb-4">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">Dashboard Data Unavailable</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {error || "Unable to load dashboard data. Please ensure you're signed in as an admin."}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/products/new">
              <Package className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              View Orders
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.revenue.total)}</div>
            <div className="flex items-center">
              <span className={`text-xs ${getDeltaColor(data.revenue.trend)}`}>
                {data.revenue.trend > 0 ? "+" : ""}{data.revenue.trend.toFixed(1)}%
              </span>
              {React.createElement(getDeltaIcon(data.revenue.trend), { 
                className: `ml-1 h-3 w-3 ${getDeltaColor(data.revenue.trend)}`
              })}
              <span className="text-xs text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.orders.total}</div>
            <div className="flex items-center">
              <span className={`text-xs ${getDeltaColor(data.orders.trend)}`}>
                {data.orders.trend > 0 ? "+" : ""}{data.orders.trend.toFixed(1)}%
              </span>
              {React.createElement(getDeltaIcon(data.orders.trend), { 
                className: `ml-1 h-3 w-3 ${getDeltaColor(data.orders.trend)}`
              })}
              <span className="text-xs text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.products.total}</div>
            <div className="flex items-center">
              <span className={`text-xs ${getDeltaColor(data.products.trend)}`}>
                {data.products.trend > 0 ? "+" : ""}{data.products.trend.toFixed(1)}%
              </span>
              {React.createElement(getDeltaIcon(data.products.trend), {
                className: `ml-1 h-3 w-3 ${getDeltaColor(data.products.trend)}`
              })}
              <span className="text-xs text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.customers.total}</div>
            <div className="flex items-center">
              <span className={`text-xs ${getDeltaColor(data.customers.trend)}`}>
                {data.customers.trend > 0 ? "+" : ""}{data.customers.trend.toFixed(1)}%
              </span>
              {React.createElement(getDeltaIcon(data.customers.trend), {
                className: `ml-1 h-3 w-3 ${getDeltaColor(data.customers.trend)}`
              })}
              <span className="text-xs text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="recent-orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent-orders" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Recent Orders</span>
            <span className="inline sm:hidden">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="popular-products" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Popular Products</span>
            <span className="inline sm:hidden">Products</span>
          </TabsTrigger>
          <TabsTrigger value="sales-overview" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Sales Overview</span>
            <span className="inline sm:hidden">Sales</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent-orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                {data.recentOrders.length} orders placed recently
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.recentOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent orders to display
                </p>
              ) : (
                <div className="space-y-4">
                  {data.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">{order.customer.name}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
                          <p className="text-xs capitalize text-muted-foreground">{order.status}</p>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/admin/orders">View All Orders</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="popular-products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Popular Products</CardTitle>
              <CardDescription>
                Your top-selling products this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.popularProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No popular products to display
                </p>
              ) : (
                <div className="space-y-4">
                  {data.popularProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium">{product.sales} sales</p>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/products/${product.id}`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{data.lowStockProducts}</span> products with low stock
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/products">View All Products</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales-overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                Summary of your store performance
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-medium">
                  {formatCurrency(data.revenue.total)} revenue this month
                </p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  {data.orders.total} orders from {data.customers.total} customers
                </p>
                <p className="text-sm">
                  <span className={`font-medium ${getDeltaColor(data.revenue.trend)}`}>
                    {data.revenue.trend > 0 ? "+" : ""}{data.revenue.trend.toFixed(1)}%
                  </span> 
                  {" "}revenue growth from previous month
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/admin/analytics">View Detailed Analytics</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 