import { SkoolBossSignInForm } from "@/components/auth/skool-boss-sign-in-form"

export default async function SkoolBossSignInPage({
  searchParams
}: {
  searchParams: { error?: string }
}) {
  // In Next.js 15, searchParams must be awaited before accessing properties
  const params = await searchParams
  const error = params?.error || null

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <div className="container flex flex-1 items-center justify-center py-12">
          <SkoolBossSignInForm error={error} />
        </div>
      </main>
    </div>
  )
} 