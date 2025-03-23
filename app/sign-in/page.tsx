import type { Metadata } from "next"
import { SignInForm } from "@/components/auth/sign-in-form"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Sign In | Skool Growth Products",
  description: "Sign in to your account to access your purchased products",
}

export default async function SignInPage({
  searchParams
}: {
  searchParams: { redirect?: string }
}) {
  const params = await searchParams
  const redirectPath = params?.redirect || null

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="container flex flex-1 items-center justify-center py-12">
          <SignInForm redirectPath={redirectPath} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

