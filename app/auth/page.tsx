import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import AuthForm from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: "Sign In | Skool Growth Products",
  description: "Sign in to your account or create a new one",
}

export default async function AuthPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is already logged in, redirect to home page
  if (session) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="container py-12 md:py-16">
          <div className="mx-auto max-w-md text-center">
            <h1 className="mb-4 font-space-grotesk text-3xl font-bold tracking-tight">Welcome to SkoolStore</h1>
            <p className="mb-8 text-muted-foreground">
              Sign in to your account or create a new one to access premium digital products
            </p>
          </div>
          <AuthForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}

