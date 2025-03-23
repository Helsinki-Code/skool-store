"use client"

import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function BlogHeader() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background to-muted px-6 py-16 sm:px-8 md:py-24">
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.h1
          className="mb-4 font-space-grotesk text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Community Growth{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Insights</span>
        </motion.h1>

        <motion.p
          className="mb-8 text-lg text-muted-foreground md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Expert strategies, case studies, and actionable advice for Skool community builders
        </motion.p>

        <motion.div
          className="mx-auto flex max-w-md gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Input
            placeholder="Search articles..."
            className="h-12 rounded-full border-primary/20 bg-background/80 backdrop-blur-sm"
          />
          <Button size="icon" className="h-12 w-12 rounded-full">
            <Search className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

