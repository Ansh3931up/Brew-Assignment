'use client'

import { useState, useEffect, startTransition } from 'react'
import { useTheme } from '@/providers/theme-provider'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { mode, toggle, mounted } = useTheme()
  const [hasMounted, setHasMounted] = useState(false)

  // Ensure component only becomes interactive after client-side hydration
  useEffect(() => {
    startTransition(() => {
      setHasMounted(true)
    })
  }, [])

  // Only show theme-dependent content after both component and theme are mounted
  const isReady = hasMounted && mounted
  const currentMode = isReady ? mode : 'light'
  const isDark = currentMode === 'dark'

  return (
    <button
      onClick={isReady ? (e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle()
      } : undefined}
      className="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus:ring-ring inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      type="button"
      disabled={!isReady}
      suppressHydrationWarning
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4" />
          <span suppressHydrationWarning>Light</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          <span suppressHydrationWarning>Dark</span>
        </>
      )}
    </button>
  )
}
