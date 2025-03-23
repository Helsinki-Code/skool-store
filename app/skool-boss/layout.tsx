export default function SkoolBossLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {children}
    </div>
  )
} 