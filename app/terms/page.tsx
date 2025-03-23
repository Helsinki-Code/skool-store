import type { Metadata } from "next"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Terms of Service | Skool Growth Products",
  description: "Terms and conditions for using our platform and products",
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="container max-w-4xl px-4 py-12 md:px-6 md:py-24">
          <h1 className="mb-8 font-space-grotesk text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>Last updated: March 21, 2025</p>

            <h2>1. Introduction</h2>
            <p>
              Welcome to Skool Growth Products. These Terms of Service govern your use of our website and the digital
              products we offer. By accessing our website or purchasing our products, you agree to these terms.
            </p>

            <h2>2. Definitions</h2>
            <p>
              <strong>"We", "Us", "Our"</strong> refers to Skool Growth Products.
              <br />
              <strong>"Website"</strong> refers to our website at skoolstore.com.
              <br />
              <strong>"Products"</strong> refers to the digital products available for purchase on our Website.
              <br />
              <strong>"You", "Your"</strong> refers to the user or purchaser of our Products.
            </p>

            <h2>3. Account Registration</h2>
            <p>
              To purchase our Products, you must create an account. You are responsible for maintaining the
              confidentiality of your account information and for all activities that occur under your account.
            </p>

            <h2>4. Product Licenses</h2>
            <p>
              When you purchase a Product, you are granted a non-exclusive, non-transferable license to use the Product
              for your personal or business use. You may not redistribute, resell, or share our Products without our
              explicit permission.
            </p>

            <h2>5. Payments and Refunds</h2>
            <p>
              All payments are processed securely through our payment processor. Due to the digital nature of our
              Products, all sales are final and we do not offer refunds unless required by law.
            </p>

            <h2>6. Intellectual Property</h2>
            <p>
              All content on our Website and in our Products, including text, graphics, logos, and images, is our
              property and is protected by copyright and other intellectual property laws.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              We provide our Products "as is" without any warranties. We shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages resulting from your use of our Products.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of any significant changes by
              posting a notice on our Website or sending you an email.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without
              regard to its conflict of law provisions.
            </p>

            <h2>10. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at support@skoolstore.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

