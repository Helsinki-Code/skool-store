"use client"

import { motion } from "framer-motion"
import { CategoryCard } from "@/components/category-card"
import { BarChart2, BookOpen, Users, Lightbulb, TrendingUp, Target } from "lucide-react"

export default function AllCategories() {
  const categories = [
    {
      id: "case-studies",
      title: "Success Case Studies",
      description: "Detailed breakdowns of successful communities",
      icon: <BarChart2 className="h-10 w-10" />,
      color: "from-blue-500 to-cyan-400",
      count: 5,
      longDescription:
        "In-depth analysis of thriving Skool communities, revealing their strategies, systems, and growth trajectories. Each case study includes founder interviews, revenue breakdowns, and implementation guides.",
    },
    {
      id: "growth-resources",
      title: "Creator Resources",
      description: "Tools and templates for community builders",
      icon: <BookOpen className="h-10 w-10" />,
      color: "from-purple-500 to-pink-400",
      count: 6,
      longDescription:
        "Ready-to-use templates, frameworks, and systems that streamline community operations. These resources help you implement proven strategies without reinventing the wheel.",
    },
    {
      id: "community-strategies",
      title: "Community Strategies",
      description: "Proven approaches to engagement and retention",
      icon: <Users className="h-10 w-10" />,
      color: "from-amber-500 to-orange-400",
      count: 5,
      longDescription:
        "Strategic frameworks for building engaged, active communities. These resources focus on member experience, engagement rituals, and retention systems that keep members active and satisfied.",
    },
    {
      id: "monetization",
      title: "Monetization Models",
      description: "Revenue strategies for community businesses",
      icon: <Target className="h-10 w-10" />,
      color: "from-emerald-500 to-teal-400",
      count: 5,
      longDescription:
        "Comprehensive guides to generating sustainable revenue from your community. Includes pricing strategies, premium offer development, and ethical monetization approaches.",
    },
    {
      id: "market-trends",
      title: "Market Intelligence",
      description: "Insights on shifting community landscapes",
      icon: <TrendingUp className="h-10 w-10" />,
      color: "from-rose-500 to-red-400",
      count: 4,
      longDescription:
        "Data-driven reports on emerging trends, market shifts, and competitive analysis in the community space. Stay ahead of changes that could impact your community business.",
    },
    {
      id: "niche-reports",
      title: "Niche Reports",
      description: "Targeted analysis for specific industries",
      icon: <Lightbulb className="h-10 w-10" />,
      color: "from-indigo-500 to-violet-400",
      count: 4,
      longDescription:
        "Specialized research and analysis for specific community niches. These reports provide targeted insights for communities in areas like education, health and wellness, creative industries, and professional development.",
    },
  ]

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-background to-muted px-6 py-24 sm:px-8 md:py-32">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -right-20 bottom-20 h-[600px] w-[600px] rounded-full bg-secondary/20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.h1
            className="mb-4 font-space-grotesk text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Product{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Categories</span>
          </motion.h1>

          <motion.p
            className="mb-8 text-lg text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore our specialized knowledge resources organized by purpose and application
          </motion.p>
        </div>
      </div>

      <section className="bg-background py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                <p className="mt-4 text-sm text-muted-foreground">{category.longDescription}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

