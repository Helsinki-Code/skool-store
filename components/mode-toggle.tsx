"use client"

import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor } from "lucide-react"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const options = [
    { value: "light", icon: <Sun className="h-5 w-5" />, label: "Light" },
    { value: "dark", icon: <Moon className="h-5 w-5" />, label: "Dark" },
    { value: "system", icon: <Monitor className="h-5 w-5" />, label: "System" },
  ]

  const getCurrentIcon = () => {
    if (!mounted) return options[2].icon // Default to system icon
    const option = options.find((opt) => opt.value === theme)
    return option ? option.icon : options[2].icon
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme" className="relative">
        <Monitor className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        onClick={() => setShowOptions(!showOptions)}
        className="relative"
      >
        <motion.div
          key={theme}
          initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          {getCurrentIcon()}
        </motion.div>
      </Button>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full z-50 mt-2 w-40 origin-top-right rounded-md border bg-background shadow-lg"
            onMouseLeave={() => setShowOptions(false)}
          >
            <div className="p-1">
              {options.map((option) => (
                <Button
                  key={option.value}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTheme(option.value)
                    setShowOptions(false)
                  }}
                  className={`flex w-full items-center justify-start px-2 py-1.5 ${
                    theme === option.value ? "bg-muted" : ""
                  }`}
                >
                  <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {option.icon}
                  </div>
                  {option.label}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

