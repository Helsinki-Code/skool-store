"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Package, CreditCard, Settings, UserIcon, Download, ExternalLink } from "lucide-react"

interface AccountDashboardProps {
  userData: {
    user: User
    profile: any
    purchasesCount: number
    recentOrders: any[]
  }
}

export default function AccountDashboard({ userData }: AccountDashboardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user, profile, purchasesCount, recentOrders } = userData

  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        throw error
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2)
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="mb-2 font-space-grotesk text-3xl font-bold tracking-tight sm:text-4xl">Account Dashboard</h1>
        <p className="mb-8 text-muted-foreground">Manage your account and access your purchased products</p>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{profile?.full_name || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member since:</span>
                <span className="font-medium">{formatDate(user.created_at || profile?.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purchases:</span>
                <span className="font-medium">{purchasesCount}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/account/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Button
                className="h-auto justify-start gap-2 px-4 py-6 text-left"
                onClick={() => router.push("/account/purchases")}
              >
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Package className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">My Purchases</span>
                  <span className="text-xs text-muted-foreground">Access your digital products</span>
                </div>
              </Button>

              <Button
                className="h-auto justify-start gap-2 px-4 py-6 text-left"
                onClick={() => router.push("/account/orders")}
              >
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">Order History</span>
                  <span className="text-xs text-muted-foreground">View your past orders</span>
                </div>
              </Button>

              <Button
                className="h-auto justify-start gap-2 px-4 py-6 text-left"
                onClick={() => router.push("/products")}
              >
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <ExternalLink className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">Browse Products</span>
                  <span className="text-xs text-muted-foreground">Discover new resources</span>
                </div>
              </Button>

              <Button
                className="h-auto justify-start gap-2 px-4 py-6 text-left"
                variant="outline"
                onClick={() => router.push("/blog")}
              >
                <div className="rounded-full bg-muted p-2">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">Community Blog</span>
                  <span className="text-xs text-muted-foreground">Read latest articles</span>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your most recent purchases</CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                    <Button variant="link" onClick={() => router.push("/products")}>
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="rounded-lg border p-4">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h3 className="font-medium">Order #{order.id.substring(0, 8)}</h3>
                            <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge status={order.status} />
                            <span className="font-medium">${formatPrice(order.total_amount)}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.order_items.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <span>{item.products.title}</span>
                              <Button variant="ghost" size="sm" className="h-8 gap-1 p-0">
                                <Download className="h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {recentOrders.length > 0 && (
                      <div className="mt-4 text-center">
                        <Button variant="outline" size="sm" onClick={() => router.push("/account/orders")}>
                          View All Orders
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email || ""} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <Button type="submit" disabled={isUpdating} className="w-full">
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

function Badge({ status }: { status: string }) {
  let color = "bg-muted text-muted-foreground"

  switch (status.toLowerCase()) {
    case "completed":
      color = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      break
    case "pending":
      color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      break
    case "failed":
      color = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      break
  }

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

