import { type NextRequest, NextResponse } from "next/server"
import { updateOrderStatus } from "@/lib/db/orders"
import { isAdmin } from "@/lib/admin"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isUserAdmin = await isAdmin()

    if (!isUserAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const updatedOrder = await updateOrderStatus(id, status)

    return NextResponse.json(updatedOrder)
  } catch (error: any) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

