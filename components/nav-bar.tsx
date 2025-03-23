"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Menu, ShoppingCart, User, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function NavBar() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { totalItems } = useCart()
  const { user, signOut } = useAuth()

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const routes = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">DigitalStore</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === route.href ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {mounted && (
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/account">My Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                {user.email === "vtu8022@gmail.com" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === route.href ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

