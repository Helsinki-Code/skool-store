import Link from "next/link"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function CheckoutCancelPage() {
  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className="rounded-full bg-red-100 p-3">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold">Payment Cancelled</h1>
        <p className="text-muted-foreground">Your payment was cancelled. No charges were made to your account.</p>
        <div className="flex flex-col space-y-3 w-full">
          <Button asChild>
            <Link href="/cart">Return to Cart</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

