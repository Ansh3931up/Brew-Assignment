'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Initialize from localStorage or system preference (only on client)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as ThemeMode | null
      if (stored) return stored
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return prefersDark ? 'dark' : 'light'
    }
    return 'light'
  })
  const mountedRef = useRef(false)

  // Initialize theme on mount
  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true

    // Apply initial theme
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }, [mode])

  // Update theme when mode changes (after initial mount)
  useEffect(() => {
    if (!mountedRef.current) return

    document.documentElement.classList.toggle('dark', mode === 'dark')
    localStorage.setItem('theme', mode)
  }, [mode])

  const toggle = () => {
    setMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : 'light'
      return newMode
    })
  }

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
