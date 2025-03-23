import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/admin"
import { calculateDateRange } from "@/lib/utils"

export async function GET() {
  try {
    // Check if user is admin
    const { isAuthenticated, isAuthorized } = await isAdmin()

    // In development mode, bypass admin check
    if (process.env.NODE_ENV === "development" || (isAuthenticated && isAuthorized)) {
      // Initialize default response data
      const dashboardData: DashboardData = {
        revenue: { total: 0, previous: 0, trend: 0 },
        orders: { total: 0, previous: 0, trend: 0 },
        products: { total: 0, previous: 0, trend: 0 },
        customers: { total: 0, previous: 0, trend: 0 },
        recentOrders: [],
        popularProducts: [],
        lowStockProducts: 0,
      }

      const supabase = await getSupabaseServerClient()
      const now = new Date()
      const { currentStart, currentEnd, previousStart, previousEnd } = calculateDateRange("thisMonth")

      // Try to fetch revenue data safely
      try {
        const { data: revenueData, error: revenueError } = await supabase
          .from("orders")
          .select("total_amount")
          .gte("created_at", currentStart.toISOString())
          .lte("created_at", currentEnd.toISOString())

        if (revenueError) {
          console.error("Error fetching revenue data:", revenueError)
        } else if (revenueData) {
          // Calculate total revenue
          dashboardData.revenue.total = revenueData.reduce((sum, order) => sum + (order.total_amount || 0), 0)

          // Get previous period revenue for comparison
          const { data: previousRevenueData } = await supabase
            .from("orders")
            .select("total_amount")
            .gte("created_at", previousStart.toISOString())
            .lte("created_at", previousEnd.toISOString())

          const previousTotal = previousRevenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

          // Calculate trend percentage
          dashboardData.revenue.previous = previousTotal
          dashboardData.revenue.trend = previousTotal > 0 
            ? ((dashboardData.revenue.total - previousTotal) / previousTotal) * 100 
            : 0
        }
      } catch (error) {
        console.error("Failed to fetch revenue data:", error)
      }

      // Try to fetch orders count safely
      try {
        const { count: currentOrdersCount, error: ordersError } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .gte("created_at", currentStart.toISOString())
          .lte("created_at", currentEnd.toISOString())

        if (ordersError) {
          console.error("Error fetching orders count:", ordersError)
        } else if (currentOrdersCount !== null) {
          dashboardData.orders.total = currentOrdersCount

          // Get previous period orders for comparison
          const { count: previousOrdersCount } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true })
            .gte("created_at", previousStart.toISOString())
            .lte("created_at", previousEnd.toISOString())

          dashboardData.orders.previous = previousOrdersCount || 0
          dashboardData.orders.trend = dashboardData.orders.previous > 0 
            ? ((dashboardData.orders.total - dashboardData.orders.previous) / dashboardData.orders.previous) * 100 
            : 0
        }
      } catch (error) {
        console.error("Failed to fetch orders data:", error)
      }

      // Try to fetch products count safely
      try {
        const { count: currentProductsCount, error: productsError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })

        if (productsError) {
          console.error("Error fetching products count:", productsError)
        } else if (currentProductsCount !== null) {
          dashboardData.products.total = currentProductsCount
          
          // For products, we might not have historical data, but we can use inventory
          dashboardData.products.previous = currentProductsCount
          dashboardData.products.trend = 0 // No trend for products if we don't track creation dates
        }
      } catch (error) {
        console.error("Failed to fetch products data:", error)
      }

      // Try to fetch customers count safely
      try {
        const { count: currentCustomersCount, error: customersError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("is_admin", false)

        if (customersError) {
          console.error("Error fetching customers count:", customersError)
        } else if (currentCustomersCount !== null) {
          dashboardData.customers.total = currentCustomersCount
          
          // For customers, we can estimate trend based on recent signups
          const oneMonthAgo = new Date()
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
          
          const { count: recentCustomersCount } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("is_admin", false)
            .gte("created_at", oneMonthAgo.toISOString())

          const previousCustomersCount = currentCustomersCount - (recentCustomersCount || 0)
          dashboardData.customers.previous = previousCustomersCount
          dashboardData.customers.trend = previousCustomersCount > 0
            ? ((recentCustomersCount || 0) / previousCustomersCount) * 100
            : 0
        }
      } catch (error) {
        console.error("Failed to fetch customers data:", error)
      }

      // Try to fetch recent orders safely
      try {
        const { data: recentOrdersData, error: recentOrdersError } = await supabase
          .from("orders")
          .select(`
            id, 
            total_amount, 
            status, 
            created_at,
            user_id
          `)
          .order("created_at", { ascending: false })
          .limit(5)

        if (recentOrdersError) {
          console.error("Error fetching recent orders:", recentOrdersError)
        } else if (recentOrdersData) {
          // For each order, try to get the customer details
          const ordersWithCustomers = await Promise.all(
            recentOrdersData.map(async (order) => {
              try {
                // Try to get customer information
                const { data: userData } = await supabase
                  .from("profiles")
                  .select("full_name, avatar_url")
                  .eq("id", order.user_id)
                  .single()

                return {
                  id: order.id,
                  total: order.total_amount || 0,
                  status: order.status || "pending",
                  date: order.created_at,
                  customer: {
                    name: userData?.full_name || "Unknown Customer",
                    image: userData?.avatar_url || null
                  }
                }
              } catch (error) {
                console.error("Error fetching customer data for order:", error)
                return {
                  id: order.id,
                  total: order.total_amount || 0,
                  status: order.status || "pending",
                  date: order.created_at,
                  customer: {
                    name: "Unknown Customer",
                    image: null
                  }
                }
              }
            })
          )

          dashboardData.recentOrders = ordersWithCustomers
        }
      } catch (error) {
        console.error("Failed to fetch recent orders:", error)
      }

      // Try to fetch popular products safely - but don't use inventory column that doesn't exist
      try {
        // Use ID, title, price without relying on inventory
        const { data: popularProductsData, error: popularProductsError } = await supabase
          .from("products")
          .select("id, title, price")
          .limit(5)

        if (popularProductsError) {
          console.error("Error fetching popular products:", popularProductsError)
        } else if (popularProductsData) {
          dashboardData.popularProducts = popularProductsData.map(product => ({
            id: product.id,
            name: product.title || "",
            price: product.price || 0,
            sales: Math.floor(Math.random() * 100) // Mock sales data since we don't have real data
          }))
        }
      } catch (error) {
        console.error("Failed to fetch popular products:", error)
      }

      // Skip the low stock check since inventory column doesn't exist
      dashboardData.lowStockProducts = 0

      return NextResponse.json(dashboardData)
    }
    
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    )
  } catch (error) {
    console.error("Dashboard API error:", error)
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    )
  }
}

interface DashboardData {
  revenue: MetricData
  orders: MetricData
  products: MetricData
  customers: MetricData
  recentOrders: RecentOrder[]
  popularProducts: PopularProduct[]
  lowStockProducts: number
}

interface MetricData {
  total: number
  previous: number
  trend: number
}

interface RecentOrder {
  id: string
  customer: {
    name: string
    image: string | null
  }
  status: string
  total: number
  date: string
}

interface PopularProduct {
  id: string
  name: string
  price: number
  sales: number
} 