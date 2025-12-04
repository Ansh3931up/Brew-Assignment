'use client'
import { useTheme } from '@/providers/theme-provider'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { mode, toggle, mounted } = useTheme()

  // Prevent hydration mismatch by showing neutral state until mounted
  if (!mounted) {
    return (
      <button
        className="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus:ring-ring inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Toggle theme"
        type="button"
        disabled
      >
        <Moon className="h-4 w-4" />
        <span>Dark</span>
      </button>
    )
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle()
      }}
      className="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus:ring-ring inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      type="button"
    >
      {mode === 'light' ? (
        <>
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </>
      )}
    </button>
  )
}
