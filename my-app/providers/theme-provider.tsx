'use client'

import { createContext, useContext, useState, useEffect, useLayoutEffect, useRef } from 'react'

type ThemeMode = 'light' | 'dark'

export type ThemeColor = 
  | 'blue'
  | 'purple'
  | 'green'
  | 'pink'
  | 'orange'
  | 'red'
  | 'teal'
  | 'indigo'

export const themeColors: Record<ThemeColor, { 
  primary: string
  light: string
  dark: string
  bgLight: string
  bgMuted: string
  bgSurface: string
  bgCard: string
  bgDark: string
  bgCardDark: string
  bgMutedDark: string
  bgSurfaceDark: string
  bgOverlayDark: string
}> = {
  blue: {
    primary: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
    bgLight: '#f0f7ff', // Very light blue (blue + white)
    bgMuted: '#e0f2fe', // Light blue
    bgSurface: '#dbeafe', // Slightly darker light blue
    bgCard: '#ffffff',
    bgDark: '#1a1f2e', // Lighter dark blue
    bgCardDark: '#1e293b', // Slate blue
    bgMutedDark: '#2d3748', // Darker slate blue
    bgSurfaceDark: '#1e293b',
    bgOverlayDark: '#0f1419', // Lighter deep navy
  },
  purple: {
    primary: '#8b5cf6',
    light: '#a78bfa',
    dark: '#6d28d9',
    bgLight: '#faf5ff', // Very light purple (purple + white)
    bgMuted: '#f3e8ff', // Light purple
    bgSurface: '#e9d5ff', // Slightly darker light purple
    bgCard: '#ffffff',
    bgDark: '#1e1a2e', // Lighter dark purple
    bgCardDark: '#2d1f3d', // Purple slate
    bgMutedDark: '#3d2f4d',
    bgSurfaceDark: '#2d1f3d',
    bgOverlayDark: '#0f0c19', // Lighter deep purple
  },
  green: {
    primary: '#10b981',
    light: '#34d399',
    dark: '#059669',
    bgLight: '#f0fdf4', // Very light green (green + white)
    bgMuted: '#dcfce7', // Light green
    bgSurface: '#bbf7d0', // Slightly darker light green
    bgCard: '#ffffff',
    bgDark: '#0f1f1a', // Lighter dark green
    bgCardDark: '#1a2e25', // Emerald dark
    bgMutedDark: '#2a3d35',
    bgSurfaceDark: '#1a2e25',
    bgOverlayDark: '#0a1410', // Lighter deep green
  },
  pink: {
    primary: '#ec4899',
    light: '#f472b6',
    dark: '#db2777',
    bgLight: '#fdf2f8', // Very light pink (pink + white)
    bgMuted: '#fce7f3', // Light pink
    bgSurface: '#fbcfe8', // Slightly darker light pink
    bgCard: '#ffffff',
    bgDark: '#1f151a', // Lighter dark pink
    bgCardDark: '#2d1f2e', // Rose dark
    bgMutedDark: '#3d2f3e',
    bgSurfaceDark: '#2d1f2e',
    bgOverlayDark: '#0f0a0f', // Lighter deep pink
  },
  orange: {
    primary: '#f97316',
    light: '#fb923c',
    dark: '#ea580c',
    bgLight: '#fff7ed', // Very light orange (orange + white)
    bgMuted: '#ffedd5', // Light orange
    bgSurface: '#fed7aa', // Slightly darker light orange
    bgCard: '#ffffff',
    bgDark: '#1f1a0f', // Lighter dark orange
    bgCardDark: '#2d251a', // Orange dark
    bgMutedDark: '#3d352a',
    bgSurfaceDark: '#2d251a',
    bgOverlayDark: '#0f0a07', // Lighter deep orange
  },
  red: {
    primary: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
    bgLight: '#fef2f2', // Very light red (red + white)
    bgMuted: '#fee2e2', // Light red
    bgSurface: '#fecaca', // Slightly darker light red
    bgCard: '#ffffff',
    bgDark: '#1a0f0f', // Lighter dark red with tint (was too dark)
    bgCardDark: '#2d1a1a', // Medium dark red
    bgMutedDark: '#3d2525', // Darker red
    bgSurfaceDark: '#2d1a1a',
    bgOverlayDark: '#0f0808', // Deepest red (lighter)
  },
  teal: {
    primary: '#14b8a6',
    light: '#5eead4',
    dark: '#0d9488',
    bgLight: '#f0fdfa', // Very light teal (teal + white)
    bgMuted: '#ccfbf1', // Light teal
    bgSurface: '#99f6e4', // Slightly darker light teal
    bgCard: '#ffffff',
    bgDark: '#0f1f1a', // Lighter dark teal
    bgCardDark: '#1a2e28', // Teal dark
    bgMutedDark: '#2a3d38',
    bgSurfaceDark: '#1a2e28',
    bgOverlayDark: '#0a1410', // Lighter deep teal
  },
  indigo: {
    primary: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5',
    bgLight: '#eef2ff', // Very light indigo (indigo + white)
    bgMuted: '#e0e7ff', // Light indigo
    bgSurface: '#c7d2fe', // Slightly darker light indigo
    bgCard: '#ffffff',
    bgDark: '#1a1a2e', // Lighter dark indigo
    bgCardDark: '#252538', // Indigo dark
    bgMutedDark: '#353548',
    bgSurfaceDark: '#252538',
    bgOverlayDark: '#0f0f19', // Lighter deep indigo
  },
}

interface ThemeContextType {
  mode: ThemeMode
  color: ThemeColor
  wallpaper: string | null
  toggle: () => void
  setColor: (color: ThemeColor) => void
  setWallpaper: (wallpaper: string | null) => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with function to avoid hydration mismatch
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = localStorage.getItem('theme') as ThemeMode | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return stored || (prefersDark ? 'dark' : 'light')
  })
  
  const [color, setColorState] = useState<ThemeColor>(() => {
    if (typeof window === 'undefined') return 'blue'
    return (localStorage.getItem('theme-color') as ThemeColor | null) || 'blue'
  })
  
  const [wallpaper, setWallpaperState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('theme-wallpaper') || null
  })
  
  const mountedRef = useRef(false)
  const mounted = typeof window !== 'undefined'

  // Apply color to CSS variables
  const applyColor = (selectedColor: ThemeColor) => {
    const colorScheme = themeColors[selectedColor]
    const root = document.documentElement
    
    // Brand colors
    root.style.setProperty('--color-brand-primary', colorScheme.primary)
    root.style.setProperty('--color-brand-primaryLight', colorScheme.light)
    root.style.setProperty('--color-brand-primaryDark', colorScheme.dark)
    
    // Background colors with tint
    root.style.setProperty('--color-background-default', colorScheme.bgLight)
    root.style.setProperty('--color-background-muted', colorScheme.bgMuted)
    root.style.setProperty('--color-background-surface', colorScheme.bgSurface)
    root.style.setProperty('--color-background-card', colorScheme.bgCard)
    root.style.setProperty('--color-background-dark', colorScheme.bgDark)
    root.style.setProperty('--color-background-cardDark', colorScheme.bgCardDark)
    root.style.setProperty('--color-background-mutedDark', colorScheme.bgMutedDark)
    root.style.setProperty('--color-background-surfaceDark', colorScheme.bgSurfaceDark)
    root.style.setProperty('--color-background-overlayDark', colorScheme.bgOverlayDark)
  }

  // Apply wallpaper
  const applyWallpaper = (wallpaperUrl: string | null) => {
    const root = document.documentElement
    if (wallpaperUrl) {
      root.style.setProperty('--theme-wallpaper', `url(${wallpaperUrl})`)
      root.classList.add('has-wallpaper')
    } else {
      root.style.removeProperty('--theme-wallpaper')
      root.classList.remove('has-wallpaper')
    }
  }

  // Initialize theme on mount (after hydration)
  useLayoutEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true

    // Apply DOM changes immediately (synchronization with external system)
    // State is already initialized with correct values from localStorage
    document.documentElement.classList.toggle('dark', mode === 'dark')
    applyColor(color)
    applyWallpaper(wallpaper)
  }, [mode, color, wallpaper]) // Include dependencies since we use them

  // Update theme when mode changes (after initial mount)
  useEffect(() => {
    if (!mountedRef.current || !mounted) return

    document.documentElement.classList.toggle('dark', mode === 'dark')
      localStorage.setItem('theme', mode)
  }, [mode, mounted])

  // Update color when it changes
  useEffect(() => {
    if (!mountedRef.current || !mounted) return
    applyColor(color)
      localStorage.setItem('theme-color', color)
  }, [color, mounted])

  // Update wallpaper when it changes
  useEffect(() => {
    if (!mountedRef.current || !mounted) return
    applyWallpaper(wallpaper)
      if (wallpaper) {
        localStorage.setItem('theme-wallpaper', wallpaper)
      } else {
        localStorage.removeItem('theme-wallpaper')
    }
  }, [wallpaper, mounted])

  const toggle = () => {
    setMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : 'light'
      return newMode
    })
  }

  const setColor = (newColor: ThemeColor) => {
    setColorState(newColor)
  }

  const setWallpaper = (newWallpaper: string | null) => {
    setWallpaperState(newWallpaper)
  }

  return (
    <ThemeContext.Provider value={{ mode, color, wallpaper, toggle, setColor, setWallpaper, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
