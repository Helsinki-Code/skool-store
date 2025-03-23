"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Package, Settings } from "lucide-react"

export function UserAccountNav() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => router.push("/sign-in")}>
          Sign In
        </Button>
        <Button onClick={() => router.push("/sign-up")}>Sign Up</Button>
      </div>
    )
  }

  const initials = user.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
    : user.email?.charAt(0).toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email || ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.user_metadata?.full_name && <p className="font-medium">{user.user_metadata.full_name}</p>}
            {user.email && <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account" className="flex w-full items-center">
            <User className="mr-2 h-4 w-4" />
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/purchases" className="flex w-full items-center">
            <Package className="mr-2 h-4 w-4" />
            My Purchases
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/settings" className="flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onSelect={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

