"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  image_url?: string
  description?: string
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: any) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  checkout: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const router = useRouter()
  const { toast } = useToast()

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [cart])

  const addToCart = (product: any) => {
    setCart((prevCart) => {
      // Check if the product is already in the cart
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id)

      if (existingItemIndex >= 0) {
        // If the product is already in the cart, increase its quantity
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        }
        return updatedCart
      } else {
        // If the product is not in the cart, add it with quantity 1
        return [
          ...prevCart,
          {
            id: product.id,
            title: product.title || "Product",
            price: product.price || 0,
            quantity: 1,
            image_url: product.image_url,
            description: product.description,
          },
        ]
      }
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const checkout = async () => {
    try {
      if (cart.length === 0) {
        throw new Error("Your cart is empty")
      }

      // Format cart items for the API
      const products = cart.map((item) => ({
        id: item.id,
        title: item.title || "Product", // Ensure title is not empty
        price: item.price, // Price in cents
        quantity: item.quantity,
      }))

      // Get the current URL for success and cancel URLs
      const baseUrl = window.location.origin

      // Call the checkout API
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products,
          successUrl: `${baseUrl}/checkout/success`,
          cancelUrl: `${baseUrl}/cart`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Checkout failed")
      }

      const data = await response.json()

      // Redirect to the checkout URL if provided
      if (data.url) {
        window.location.href = data.url
      } else {
        // If no URL is provided, redirect to a success page
        router.push("/checkout/success")
      }
    } catch (error: any) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: error.message || "An error occurred during checkout",
        variant: "destructive",
      })
      throw error // Re-throw to allow the component to handle it
    }
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    checkout,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

