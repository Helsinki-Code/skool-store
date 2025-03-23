"use client"

import { motion } from "framer-motion"
import { CategoryCard } from "@/components/category-card"
import { BarChart2, BookOpen, Users, Lightbulb, TrendingUp, Target } from "lucide-react"

export default function CategorySection() {
  const categories = [
    {
      id: "case-studies",
      title: "Success Case Studies",
      description: "Detailed breakdowns of successful communities",
      icon: <BarChart2 className="h-10 w-10" />,
      color: "from-blue-500 to-cyan-400",
      count: 5,
    },
    {
      id: "growth-resources",
      title: "Creator Resources",
      description: "Tools and templates for community builders",
      icon: <BookOpen className="h-10 w-10" />,
      color: "from-purple-500 to-pink-400",
      count: 6,
    },
    {
      id: "community-strategies",
      title: "Community Strategies",
      description: "Proven approaches to engagement and retention",
      icon: <Users className="h-10 w-10" />,
      color: "from-amber-500 to-orange-400",
      count: 5,
    },
    {
      id: "monetization",
      title: "Monetization Models",
      description: "Revenue strategies for community businesses",
      icon: <Target className="h-10 w-10" />,
      color: "from-emerald-500 to-teal-400",
      count: 5,
    },
    {
      id: "market-trends",
      title: "Market Intelligence",
      description: "Insights on shifting community landscapes",
      icon: <TrendingUp className="h-10 w-10" />,
      color: "from-rose-500 to-red-400",
      count: 4,
    },
    {
      id: "niche-reports",
      title: "Niche Reports",
      description: "Targeted analysis for specific industries",
      icon: <Lightbulb className="h-10 w-10" />,
      color: "from-indigo-500 to-violet-400",
      count: 4,
    },
  ]

  return (
    <section className="bg-background py-20">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <motion.h2
            className="mb-4 font-space-grotesk text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Explore Products by Category
          </motion.h2>
          <motion.p
            className="mx-auto max-w-3xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Specialized knowledge resources organized by purpose and application
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <CategoryCard
                id={category.id}
                title={category.title}
                description={category.description}
                icon={category.icon}
                gradient={category.color}
                count={category.count}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

