import type { Metadata } from "next"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password | Skool Growth Products",
  description: "Reset your password to regain access to your account",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="container flex items-center justify-center px-4 py-12 md:px-6 md:py-24">
          <ForgotPasswordForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}

