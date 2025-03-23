"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { BadgeInfo, Sparkles } from "lucide-react"
import {
  DialogContent,
  DialogHeader,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ProductFilters() {
  const [priceRange, setPriceRange] = useState<string>("all")
  const [showInfoDialog, setShowInfoDialog] = useState(false)

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Filters</h3>
          <Button variant="ghost" size="sm">
            Reset
          </Button>
        </div>

        <Accordion type="multiple" defaultValue={["category", "price"]}>
          <AccordionItem value="category">
            <AccordionTrigger>Category</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="case-studies" />
                  <Label htmlFor="case-studies" className="font-normal">
                    Case Studies
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="growth-resources" />
                  <Label htmlFor="growth-resources" className="font-normal">
                    Creator Resources
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="community-strategies" />
                  <Label htmlFor="community-strategies" className="font-normal">
                    Community Strategies
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="monetization" />
                  <Label htmlFor="monetization" className="font-normal">
                    Monetization
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="market-trends" />
                  <Label htmlFor="market-trends" className="font-normal">
                    Market Intelligence
                  </Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <RadioGroup value={priceRange} onValueChange={setPriceRange}>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="all" value="all" />
                  <Label htmlFor="all" className="font-normal">
                    All Prices
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="under-200" value="under-200" />
                  <Label htmlFor="under-200" className="font-normal">
                    Under $200
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="200-400" value="200-400" />
                  <Label htmlFor="200-400" className="font-normal">
                    $200 - $400
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="400-plus" value="400-plus" />
                  <Label htmlFor="400-plus" className="font-normal">
                    $400+
                  </Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="community-size">
            <AccordionTrigger>
              <span className="flex items-center gap-1">
                Community Size
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowInfoDialog(true)
                  }}
                >
                  <BadgeInfo className="h-3 w-3" />
                </Button>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="starting" />
                  <Label htmlFor="starting" className="font-normal">
                    Starting (0-1K)
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="growing" />
                  <Label htmlFor="growing" className="font-normal">
                    Growing (1K-10K)
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="established" />
                  <Label htmlFor="established" className="font-normal">
                    Established (10K-50K)
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="large" />
                  <Label htmlFor="large" className="font-normal">
                    Large (50K+)
                  </Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
        <div className="flex flex-row items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">Featured Products</h3>
            <p className="text-sm text-muted-foreground">Our most valuable resources</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Button variant="outline" className="w-full justify-start">
            Digital Growth Community
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Monetization Migrations
          </Button>
        </div>
      </div>

      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About Community Size Filters</DialogTitle>
            <DialogDescription>
              Products are categorized by the community size they're most suitable for.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 p-1">
              <div>
                <h4 className="font-medium">Starting (0-1K members)</h4>
                <p className="text-sm text-muted-foreground">
                  Products that help new community founders establish their foundations, create initial engagement, and
                  define their value proposition.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Growing (1K-10K members)</h4>
                <p className="text-sm text-muted-foreground">
                  Resources focused on scaling engagement models, implementing moderation systems, and developing
                  initial monetization strategies.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Established (10K-50K members)</h4>
                <p className="text-sm text-muted-foreground">
                  Advanced frameworks for sustainable growth, premium monetization models, and creating robust community
                  ecosystems.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Large (50K+ members)</h4>
                <p className="text-sm text-muted-foreground">
                  Enterprise-level strategies for managing massive communities, multi-tier engagement models, and
                  diversified revenue systems.
                </p>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setShowInfoDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

