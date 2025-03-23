import type { Metadata } from "next"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy | Skool Growth Products",
  description: "How we collect, use, and protect your personal information",
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="container max-w-4xl px-4 py-12 md:px-6 md:py-24">
          <h1 className="mb-8 font-space-grotesk text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>Last updated: March 21, 2025</p>

            <h2>1. Introduction</h2>
            <p>
              At Skool Growth Products, we respect your privacy and are committed to protecting your personal data. This
              Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or
              purchase our products.
            </p>

            <h2>2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul>
              <li>
                <strong>Personal Information:</strong> Name, email address, billing information
              </li>
              <li>
                <strong>Account Information:</strong> Login credentials, purchase history
              </li>
              <li>
                <strong>Usage Data:</strong> How you interact with our website and products
              </li>
              <li>
                <strong>Technical Data:</strong> IP address, browser type, device information
              </li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Process your purchases and provide customer support</li>
              <li>Improve our website and products</li>
              <li>Send you updates about your purchases</li>
              <li>Send marketing communications (if you've opted in)</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access,
              alteration, disclosure, or destruction. Your payment information is processed through secure, encrypted
              channels.
            </p>

            <h2>5. Third-Party Services</h2>
            <p>
              We use trusted third-party services for payment processing, email communication, and analytics. These
              services have their own privacy policies, and we recommend reviewing them.
            </p>

            <h2>6. Cookies</h2>
            <p>
              We use cookies to enhance your experience on our website. You can set your browser to refuse cookies, but
              this may limit your ability to use some features of our website.
            </p>

            <h2>7. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to our processing of your information</li>
              <li>Withdraw consent for marketing communications</li>
            </ul>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by
              posting a notice on our website or sending you an email.
            </p>

            <h2>9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@skoolstore.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

