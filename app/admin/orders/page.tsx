import type { Metadata } from "next"
import AdminOrderList from "@/components/admin/order-list"

export const metadata: Metadata = {
  title: "Admin - Orders | Skool Growth Products",
  description: "Manage customer orders",
}

export default async function AdminOrdersPage() {
  return (
    <>
      <h1 className="mb-2 font-space-grotesk text-3xl font-bold tracking-tight">Manage Orders</h1>
      <p className="mb-8 text-muted-foreground">View and process customer orders</p>

      <AdminOrderList />
    </>
  )
}

