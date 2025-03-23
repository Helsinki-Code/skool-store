import type { Metadata } from "next"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import ContactForm from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contact Us | Skool Growth Products",
  description: "Get in touch with our team for questions about our products or custom solutions",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}

