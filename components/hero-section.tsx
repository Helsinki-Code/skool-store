"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowRight, Sparkles } from "lucide-react"

export default function HeroSection() {
  const router = useRouter()

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background to-muted px-6 py-24 sm:px-8 md:py-32">
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-[600px] w-[600px] rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 md:gap-8">
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 inline-flex items-center rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-sm text-primary">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Premium Digital Products for Skool Creators
            </div>
            <h1 className="mb-6 font-space-grotesk text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Unlock Your{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Community&apos;s
              </span>{" "}
              Full Potential
            </h1>
            <p className="mb-8 max-w-md text-lg text-muted-foreground">
              Proven strategies, actionable insights, and community growth models that have built seven-figure Skool
              communities.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => router.push("/products")} className="group">
                Explore Products
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/categories")}>
                Browse Categories
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="relative hidden md:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative h-[500px] w-full rounded-2xl bg-gradient-to-br from-primary/50 to-secondary/50 p-1">
              <div className="h-full w-full rounded-xl bg-background/95 p-6 backdrop-blur">
                <div className="grid h-full gap-4 rounded-lg bg-muted/50 p-4">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-lg bg-background p-4 shadow-sm">
                      <h3 className="mb-2 text-lg font-semibold">Digital Growth Community</h3>
                      <p className="text-sm text-muted-foreground">$447</p>
                      <div className="mt-2 h-2 w-24 rounded-full bg-primary/30"></div>
                    </div>
                    <div className="rounded-lg bg-background p-4 shadow-sm">
                      <h3 className="mb-2 text-lg font-semibold">Skool Masterclass</h3>
                      <p className="text-sm text-muted-foreground">$347</p>
                      <div className="mt-2 h-2 w-16 rounded-full bg-secondary/40"></div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-background p-4 shadow-sm">
                    <h3 className="mb-2 text-lg font-semibold">Max Business School Phenomenon</h3>
                    <p className="text-sm text-muted-foreground">$397</p>
                    <div className="mt-2 h-2 w-32 rounded-full bg-accent/40"></div>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-lg bg-background p-4 shadow-sm">
                      <h3 className="mb-2 text-lg font-semibold">CyberDojo's Rise</h3>
                      <p className="text-sm text-muted-foreground">$347</p>
                      <div className="mt-2 h-2 w-20 rounded-full bg-primary/20"></div>
                    </div>
                    <div className="rounded-lg bg-background p-4 shadow-sm">
                      <h3 className="mb-2 text-lg font-semibold">Fix-the-Mix Case Study</h3>
                      <p className="text-sm text-muted-foreground">$297</p>
                      <div className="mt-2 h-2 w-28 rounded-full bg-secondary/30"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-secondary opacity-20 blur-3xl"></div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

