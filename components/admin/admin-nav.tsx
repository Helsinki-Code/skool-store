"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Package, ShoppingBag, Users, Tag, LayoutDashboard, Settings, FileText } from "lucide-react"
import { motion } from "framer-motion"

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

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <div className="pb-12">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-4 font-semibold tracking-tight">Admin Panel</h2>
          <div className="space-y-1">
            {adminRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all",
                  pathname === route.href ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <route.icon className={cn("mr-3 h-5 w-5 transition-all")} />
                {route.title}
                {pathname === route.href && (
                  <motion.div
                    layoutId="sidebar-active-item"
                    className="ml-auto h-2 w-2 rounded-full bg-primary"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

