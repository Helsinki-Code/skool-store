"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import type { ReactNode } from "react"

interface CategoryCardProps {
  id: string
  title: string
  description: string
  icon: ReactNode
  gradient: string
  count: number
}

export function CategoryCard({ id, title, description, icon, gradient, count }: CategoryCardProps) {
  const router = useRouter()

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      onClick={() => router.push(`/categories/${id}`)}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.08] transition-opacity duration-300 group-hover:opacity-[0.12]`}
      />

      <CardContent className="p-6">
        <div
          className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-white shadow-md`}
        >
          {icon}
        </div>
        <h3 className="mb-2 font-space-grotesk text-xl font-semibold">{title}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-6">
        <span className="text-sm text-muted-foreground">{count} Products</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-transform duration-300 group-hover:translate-x-1">
          <ArrowRight className="h-4 w-4" />
        </span>
      </CardFooter>
    </Card>
  )
}

