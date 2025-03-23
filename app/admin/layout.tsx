import type React from "react"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/admin"
import AdminNav from "@/components/admin/admin-nav"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { MobileMenu } from "@/components/admin/mobile-menu"

// Loading component for the admin section
function AdminLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/5">
      <NavBar />
      <main className="flex-grow">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="flex items-center justify-center py-24">
            <div className="relative h-16 w-16">
              <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/20"></div>
              <div className="absolute inset-1 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // For development purposes, bypass admin check if needed
  if (process.env.NODE_ENV === "development") {
    console.warn("Running in development mode - admin check may be bypassed")

    try {
      await requireAdmin()
    } catch (error) {
      console.error("Admin check failed, but continuing in development mode:", error)
      // Continue anyway in development
    }

    return (
      <div className="flex min-h-screen flex-col bg-muted/5">
        <NavBar />
        <main className="flex-grow">
          <div className="container px-4 pt-4 pb-8 md:px-6 md:pt-6 md:pb-12">
            <div className="flex min-h-screen flex-col">
              <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
                  <div className="h-full py-6 pr-2 pl-4">
                    <AdminNav />
                  </div>
                </aside>
                <div className="block md:hidden sticky top-0 z-30 w-full bg-background/95 backdrop-blur">
                  <MobileMenu />
                </div>
                <main className="flex w-full flex-col overflow-hidden py-6">
                  <Suspense fallback={<AdminLoading />}>{children}</Suspense>
                </main>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    )
  }

  // In production, enforce admin check
  try {
    await requireAdmin()

    return (
      <div className="flex min-h-screen flex-col bg-muted/5">
        <NavBar />
        <main className="flex-grow">
          <div className="container px-4 pt-4 pb-8 md:px-6 md:pt-6 md:pb-12">
            <div className="flex min-h-screen flex-col">
              <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
                  <div className="h-full py-6 pr-2 pl-4">
                    <AdminNav />
                  </div>
                </aside>
                <div className="block md:hidden sticky top-0 z-30 w-full bg-background/95 backdrop-blur">
                  <MobileMenu />
                </div>
                <main className="flex w-full flex-col overflow-hidden py-6">
                  <Suspense fallback={<AdminLoading />}>{children}</Suspense>
                </main>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    )
  } catch (error) {
    console.error("Error in admin layout:", error)
    redirect("/sign-in?error=admin-access-required")
  }
}

