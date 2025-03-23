"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, ShoppingBag } from "lucide-react"

export default function UserProfile() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        setUser({ ...user, profile })
      }

      setLoading(false)
    }

    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (loading) {
    return null
  }

  if (!user) {
    return <Button onClick={() => router.push("/auth")}>Sign In</Button>
  }

  const initials = user.profile?.full_name
    ? user.profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
    : user.email.substring(0, 2).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profile?.avatar_url} alt={user.profile?.full_name || user.email} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.profile?.full_name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/account")}>
          <User className="mr-2 h-4 w-4" />
          <span>Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/account/orders")}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          <span>Orders</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/account/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

