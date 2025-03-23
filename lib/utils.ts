import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Alias for formatCurrency for better semantic meaning in product contexts
export const formatPrice = formatCurrency

export function isBrowser(): boolean {
  return typeof window !== "undefined"
}

export function isVercelBuild(): boolean {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === "true"
}

export function isDevelopment(): boolean {
  // Consider Vercel builds as non-development for compatibility
  if (isVercelBuild()) {
    return false
  }
  return process.env.NODE_ENV === "development"
}

/**
 * Calculate date ranges for current and previous time periods
 * @param period - The period to calculate ranges for (today, thisWeek, thisMonth, thisYear)
 */
export function calculateDateRange(period: 'today' | 'thisWeek' | 'thisMonth' | 'thisYear') {
  const now = new Date()
  let currentStart: Date
  let currentEnd: Date = new Date(now)
  let previousStart: Date
  let previousEnd: Date

  switch (period) {
    case 'today':
      // Today: start of today to now
      currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      // Yesterday: start of yesterday to end of yesterday
      previousStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      previousEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59)
      break
      
    case 'thisWeek':
      // This week: start of week to now
      const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, etc.
      const startOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Adjust for starting week on Monday
      currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - startOfWeek)
      
      // Last week: start of last week to end of last week
      previousStart = new Date(currentStart)
      previousStart.setDate(previousStart.getDate() - 7)
      previousEnd = new Date(currentStart)
      previousEnd.setDate(previousEnd.getDate() - 1)
      previousEnd.setHours(23, 59, 59)
      break
      
    case 'thisMonth':
      // This month: start of month to now
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1)
      
      // Last month: start of last month to end of last month
      previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      previousEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
      break
      
    case 'thisYear':
      // This year: start of year to now
      currentStart = new Date(now.getFullYear(), 0, 1)
      
      // Last year: start of last year to end of last year
      previousStart = new Date(now.getFullYear() - 1, 0, 1)
      previousEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59)
      break
      
    default:
      // Default to this month
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1)
      previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      previousEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
  }

  return {
    currentStart,
    currentEnd,
    previousStart,
    previousEnd
  }
}

