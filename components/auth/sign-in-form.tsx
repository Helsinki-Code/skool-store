"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

interface SignInFormProps {
  redirectPath?: string | null
}

export function SignInForm({ redirectPath }: SignInFormProps) {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Attempting to sign in with email:", email)
      const { error: signInError, data } = await signIn(email, password)

      if (signInError) {
        console.error("Sign-in error:", signInError)
        setError(signInError.message || "Failed to sign in")
        return
      }

      console.log("Sign-in successful, redirecting to:", redirectPath || "/")
      
      // Redirect to the specified path or home
      router.push(redirectPath || "/")
      router.refresh()
    } catch (err) {
      console.error("Unexpected sign-in error:", err)
      setError("An unexpected error occurred during sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your email and password to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {redirectPath === "/cart" && (
            <Alert className="border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800/30 dark:bg-blue-900/30 dark:text-blue-400">
              <AlertDescription>Sign in to continue to checkout</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={`/sign-up${redirectPath ? `?redirect=${redirectPath}` : ""}`}
            className="text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

