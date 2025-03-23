"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Mail, MapPin, Phone } from "lucide-react"

export default function ContactForm() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormState((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after showing success message
      setTimeout(() => {
        setIsSubmitted(false)
        setFormState({
          name: "",
          email: "",
          subject: "general",
          message: "",
        })
      }, 3000)
    }, 1500)
  }

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
            Get in{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Touch</span>
          </motion.h1>

          <motion.p
            className="mb-8 text-lg text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Have questions about our products or need custom solutions? We're here to help.
          </motion.p>
        </div>
      </div>

      <section className="bg-background py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-6 font-space-grotesk text-3xl font-bold">Contact Information</h2>
              <p className="mb-8 text-muted-foreground">
                Our team is ready to assist you with any questions about our products, custom solutions, or partnership
                opportunities.
              </p>

              <div className="space-y-6">
                <Card>
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email Us</h3>
                      <p className="text-sm text-muted-foreground">For general inquiries and support</p>
                      <a href="mailto:hello@skoolstore.com" className="mt-1 block text-primary hover:underline">
                        hello@skoolstore.com
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Call Us</h3>
                      <p className="text-sm text-muted-foreground">Monday to Friday, 9am to 5pm EST</p>
                      <a href="tel:+1234567890" className="mt-1 block text-primary hover:underline">
                        +1 (234) 567-890
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Visit Us</h3>
                      <p className="text-sm text-muted-foreground">Our headquarters</p>
                      <address className="mt-1 not-italic text-primary">
                        123 Community Lane
                        <br />
                        San Francisco, CA 94103
                      </address>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-6 font-space-grotesk text-2xl font-bold">Send a Message</h2>

                  {isSubmitted ? (
                    <motion.div
                      className="flex flex-col items-center justify-center py-8 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-8 w-8" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold">Message Sent!</h3>
                      <p className="text-muted-foreground">
                        Thank you for reaching out. We'll get back to you shortly.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <RadioGroup
                          value={formState.subject}
                          onValueChange={handleRadioChange}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="general" id="general" />
                            <Label htmlFor="general" className="font-normal">
                              General Inquiry
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="support" id="support" />
                            <Label htmlFor="support" className="font-normal">
                              Product Support
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="partnership" id="partnership" />
                            <Label htmlFor="partnership" className="font-normal">
                              Partnership Opportunity
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Your Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          placeholder="How can we help you?"
                          rows={5}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

