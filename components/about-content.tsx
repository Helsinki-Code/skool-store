"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, BarChart2, Target, Lightbulb } from "lucide-react"

export default function AboutContent() {
  return (
    <>
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
              <h1 className="mb-6 font-space-grotesk text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Empowering{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Community
                </span>{" "}
                Creators
              </h1>
              <p className="mb-8 max-w-md text-lg text-muted-foreground">
                We provide data-driven resources that help Skool community builders create thriving, profitable
                communities that transform lives.
              </p>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative h-[400px] w-full overflow-hidden rounded-2xl">
                <Image
                  src="/placeholder.svg?height=800&width=1200"
                  alt="Team collaboration"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <section className="bg-background py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              className="mb-4 font-space-grotesk text-3xl font-bold tracking-tighter sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Mission
            </motion.h2>
            <motion.p
              className="mb-8 text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              We believe that thriving online communities are the future of education, connection, and commerce. Our
              mission is to provide community creators with the insights, strategies, and tools they need to build
              sustainable businesses that create genuine value for their members.
            </motion.p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Users className="h-10 w-10" />,
                title: "Community Expertise",
                description: "We've analyzed hundreds of successful Skool communities to identify what actually works.",
              },
              {
                icon: <BarChart2 className="h-10 w-10" />,
                title: "Data-Driven Insights",
                description: "Our resources are based on real metrics, not theories or assumptions.",
              },
              {
                icon: <Target className="h-10 w-10" />,
                title: "Actionable Strategies",
                description: "Everything we create is designed to be immediately applicable to your community.",
              },
              {
                icon: <Lightbulb className="h-10 w-10" />,
                title: "Innovative Approaches",
                description: "We're constantly researching emerging trends and testing new community models.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="h-full">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">{item.icon}</div>
                    <h3 className="mb-2 font-space-grotesk text-xl font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative h-[500px] overflow-hidden rounded-2xl"
            >
              <Image src="/placeholder.svg?height=1000&width=800" alt="Our team" fill className="object-cover" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <h2 className="mb-6 font-space-grotesk text-3xl font-bold tracking-tighter sm:text-4xl">Our Story</h2>
              <div className="space-y-4">
                <p>
                  We started as a small team of community builders who were frustrated by the lack of concrete,
                  data-backed resources for creating successful online communities.
                </p>
                <p>
                  After building several seven-figure communities on Skool, we began documenting our processes,
                  analyzing what worked, and studying other successful communities in the ecosystem.
                </p>
                <p>
                  What began as internal documentation evolved into a comprehensive resource library that we now share
                  with other community creators. Our case studies, frameworks, and strategies have helped hundreds of
                  Skool communities increase engagement, retention, and revenue.
                </p>
                <p>
                  Today, we're dedicated to advancing the field of community building through rigorous research,
                  innovative strategies, and practical resources that deliver real results.
                </p>
              </div>

              <Button className="mt-8 w-fit" onClick={() => (window.location.href = "/contact")}>
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              className="mb-4 font-space-grotesk text-3xl font-bold tracking-tighter sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Values
            </motion.h2>
            <motion.p
              className="mb-12 text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              These core principles guide everything we create and share
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Data Over Opinion",
                description:
                  "We prioritize measurable results and evidence-based strategies over subjective opinions or conventional wisdom.",
              },
              {
                title: "Practical Application",
                description:
                  "Every resource we create must be immediately applicable and provide clear implementation steps.",
              },
              {
                title: "Ethical Community Building",
                description:
                  "We promote community models that create genuine value for members, not exploitative or manipulative tactics.",
              },
              {
                title: "Continuous Innovation",
                description:
                  "We're committed to pushing the boundaries of what's possible in community building through constant experimentation.",
              },
              {
                title: "Transparency",
                description:
                  "We share both successes and failures, providing honest assessments of what works and what doesn't.",
              },
              {
                title: "Long-Term Sustainability",
                description:
                  "We focus on strategies that build enduring communities, not quick-fix solutions that burn out creators or members.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Card className="h-full border-primary/10 bg-background/50 transition-colors hover:border-primary/30">
                  <CardContent className="p-6">
                    <h3 className="mb-2 font-space-grotesk text-xl font-semibold">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

