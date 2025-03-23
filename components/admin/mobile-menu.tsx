"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, Package, ShoppingBag, Users, Tag, LayoutDashboard, Settings, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const adminRoutes = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Tag,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Blog",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between p-4">
        <SheetTrigger asChild>
          <Button variant="ghost" className="h-9 w-9 p-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <div className="font-medium">Admin Dashboard</div>
        <div className="w-9" />
      </div>
      <SheetContent side="left" className="w-64 pr-0">
        <SheetHeader className="mb-4">
          <SheetTitle>Admin Menu</SheetTitle>
        </SheetHeader>
        <div className="grid gap-1 py-2">
          {adminRoutes.map((route) => (
            <SheetClose asChild key={route.href}>
              <Link
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname === route.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted-foreground/10"
                )}
              >
                <route.icon className="h-4 w-4" />
                <span>{route.title}</span>
                {pathname === route.href && (
                  <motion.div
                    layoutId="mobile-active-item"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground"
                  />
                )}
              </Link>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
} 