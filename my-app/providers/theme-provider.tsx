'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  toggle: () => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always start with 'light' to match server render
  const [mode, setMode] = useState<ThemeMode>('light')
  const [mounted, setMounted] = useState(false)
  const mountedRef = useRef(false)

  // Initialize theme on mount (after hydration)
  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true

    // Read from localStorage or system preference
    const stored = localStorage.getItem('theme') as ThemeMode | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialMode = stored || (prefersDark ? 'dark' : 'light')
    
    setMode(initialMode)
    document.documentElement.classList.toggle('dark', initialMode === 'dark')
    setMounted(true)
  }, [])

  // Update theme when mode changes (after initial mount)
  useEffect(() => {
    if (!mountedRef.current) return

    document.documentElement.classList.toggle('dark', mode === 'dark')
    if (mounted) {
      localStorage.setItem('theme', mode)
    }
  }, [mode, mounted])

  const toggle = () => {
    setMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : 'light'
      return newMode
    })
  }

  return (
    <ThemeContext.Provider value={{ mode, toggle, mounted }}>{children}</ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
