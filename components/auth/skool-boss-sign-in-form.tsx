"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Shield } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface SkoolBossSignInFormProps {
  error?: string | null
}

export function SkoolBossSignInForm({ error: initialError }: SkoolBossSignInFormProps) {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("vtu8022@gmail.com")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialError || null)
  
  // Direct Supabase client for more reliable auth
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Attempting skool-boss sign in with email:", email)
      
      // Only allow admin email
      if (email !== "vtu8022@gmail.com") {
        setError("Only authorized admins can access this area")
        setIsLoading(false)
        return
      }

      // Use direct Supabase auth for more reliable sign-in
      const { error: authError, data } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      if (authError) {
        console.error("Skool-boss sign-in error:", authError)
        setError(authError.message || "Invalid credentials")
        return
      }

      console.log("Skool-boss sign-in successful, redirecting to dashboard")
      
      // Force refresh auth state
      router.refresh()
      
      // Add delay to ensure auth state propagates
      setTimeout(() => {
        // Redirect to the skool-boss dashboard
        window.location.href = "/skool-boss"
      }, 500)
    } catch (err) {
      console.error("Unexpected skool-boss sign-in error:", err)
      setError("An unexpected error occurred during sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Shield className="h-10 w-10 text-primary" />
        </div>
        <CardTitle>Skool Boss Access</CardTitle>
        <CardDescription>Enter your administrator credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Admin Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
              required
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter admin password"
              autoFocus
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Access Dashboard"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">
            Return to store
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
} 