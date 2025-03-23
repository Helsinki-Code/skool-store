"use client"

import { useState } from "react"
import { createProductCheckoutSession } from "@/actions/product-actions"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ProductBuyButtonProps {
  productId: string
}

export default function ProductBuyButton({ productId }: ProductBuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleBuyNow = async () => {
    setIsLoading(true)
    try {
      const { url } = await createProductCheckoutSession(productId)
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleBuyNow} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
        </>
      ) : (
        "Buy Now"
      )}
    </Button>
  )
} 