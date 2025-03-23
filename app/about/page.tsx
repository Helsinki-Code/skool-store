import type { Metadata } from "next"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import AboutContent from "@/components/about-content"

export const metadata: Metadata = {
  title: "About Us | Skool Growth Products",
  description: "Learn about our mission to help Skool community creators build thriving, profitable communities",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <AboutContent />
      </main>
      <Footer />
    </div>
  )
}

