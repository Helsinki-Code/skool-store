"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  FileText,
  Settings,
  ChevronDown
} from "lucide-react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: any
    submenu?: {
      href: string
      title: string
    }[]
  }[]
}

export function Sidebar() {
  const pathname = usePathname()
  
  const items = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: Package,
      submenu: [
        {
          title: "All Products",
          href: "/admin/products",
        },
        {
          title: "Add Product",
          href: "/admin/products/new",
        },
        {
          title: "Categories",
          href: "/admin/products/categories",
        },
      ],
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
      submenu: [
        {
          title: "All Posts",
          href: "/admin/blog",
        },
        {
          title: "Add Post",
          href: "/admin/blog/new",
        },
        {
          title: "Categories",
          href: "/admin/blog/categories",
        },
      ],
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span>Admin Portal</span>
        </Link>
      </div>
      <nav className="grid items-start px-2 py-4">
        <SidebarNav items={items} />
      </nav>
    </div>
  )
}

export function SidebarNav({ items, className, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("grid gap-1", className)} {...props}>
      {items.map((item) => {
        const isActive = pathname === item.href
        const hasSubmenu = item.submenu && item.submenu.length > 0
        
        return (
          <div key={item.href} className="relative">
            <Link
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
              {hasSubmenu && <ChevronDown className="ml-auto h-4 w-4" />}
            </Link>
            
            {hasSubmenu && (
              <div className="ml-6 mt-1 space-y-1">
                {item.submenu?.map((submenu) => {
                  const isSubmenuActive = pathname === submenu.href
                  
                  return (
                    <Link
                      key={submenu.href}
                      href={submenu.href}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        isSubmenuActive ? "bg-accent/50 text-accent-foreground" : "transparent"
                      )}
                    >
                      {submenu.title}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
} 