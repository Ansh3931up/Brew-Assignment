'use client'

import { useState, useEffect, startTransition } from 'react'
import { useTheme } from '@/providers/theme-provider'
import { Moon, Sun } from 'lucide-react'

export function CompactThemeToggle() {
  const { mode, toggle, mounted } = useTheme()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    startTransition(() => {
      setHasMounted(true)
    })
  }, [])

  const isReady = hasMounted && mounted
  const isDark = isReady ? mode === 'dark' : false

  return (
    <button
      onClick={isReady ? (e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle()
      } : undefined}
      className="p-2 rounded-lg border border-border dark:border-[#2d3748] bg-background dark:bg-[#1e2535] hover:bg-accent dark:hover:bg-[#252b3a] transition-colors"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      type="button"
      disabled={!isReady}
      suppressHydrationWarning
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-foreground dark:text-[#cbd5e1]" />
      ) : (
        <Moon className="h-4 w-4 text-foreground dark:text-[#cbd5e1]" />
      )}
    </button>
  )
}

