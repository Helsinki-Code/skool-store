import type { Metadata } from "next"
import { SignUpForm } from "@/components/auth/sign-up-form"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Sign Up | Skool Growth Products",
  description: "Create a new account to purchase and access digital products",
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="container flex items-center justify-center px-4 py-12 md:px-6 md:py-24">
          <SignUpForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}

