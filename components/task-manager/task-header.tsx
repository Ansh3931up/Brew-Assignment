'use client'

import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { Search, User, LogOut, Moon, Sun, Check, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import type { RootState, AppDispatch } from '@/lib/store'
import { logout } from '@/lib/slices/authSlice'
import { toastService } from '@/lib/utils/toast'
import { useTheme, themeColors, type ThemeColor } from '@/providers/theme-provider'
import { WallpaperPicker } from '@/components/ui/wallpaper-picker'

interface TaskHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onMenuClick?: () => void
  isSidebarOpen?: boolean
}

export function TaskHeader({
  searchQuery,
  onSearchChange,
  onMenuClick,
  isSidebarOpen = true,
}: TaskHeaderProps) {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { mode, toggle, mounted, color, setColor } = useTheme()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const themePickerRef = useRef<HTMLDivElement>(null)
  const themeButtonRef = useRef<HTMLDivElement>(null)
  const avatarButtonRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      toastService.success('Logged out successfully')
      router.push('/login')
    } catch (error: unknown) {
      toastService.error((error as Error)?.message || 'Failed to logout')
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      // Check if click is outside user dropdown
      if (isDropdownOpen) {
        if (dropdownRef.current && !dropdownRef.current.contains(target)) {
          // Also check if not clicking on avatar button or its container
          const clickedElement = event.target as HTMLElement
          const isAvatarButton = clickedElement.closest('button[aria-label="User menu"]') ||
                                (avatarButtonRef.current && avatarButtonRef.current.contains(target))
          if (!isAvatarButton) {
        setIsDropdownOpen(false)
      }
        }
      }
      
      // Check if click is outside theme picker
      if (isThemePickerOpen) {
        if (themePickerRef.current && !themePickerRef.current.contains(target)) {
          // Also check if not clicking on theme button or its container
          const clickedElement = event.target as HTMLElement
          const isThemeButton = clickedElement.closest('button[aria-label="Theme settings"]') || 
                               (themeButtonRef.current && themeButtonRef.current.contains(target))
          if (!isThemeButton) {
            setIsThemePickerOpen(false)
          }
        }
      }
    }

    if (isDropdownOpen || isThemePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen, isThemePickerOpen])

  const handleThemeToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (mounted) {
      toggle()
    }
  }

  const handleThemeButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsThemePickerOpen((prev) => !prev)
    setIsDropdownOpen(false) // Close user dropdown if open
  }

  // Use mounted check to prevent hydration mismatch
  // Always default to false on server, update after mount using startTransition
  const [isDark, setIsDark] = useState(false)
  
  useEffect(() => {
    if (mounted) {
      // Use setTimeout to defer state update and avoid cascading renders
      const timeoutId = setTimeout(() => {
        setIsDark(mode === 'dark')
      }, 0)
      return () => clearTimeout(timeoutId)
    }
  }, [mounted, mode])

  const colorNames: Record<ThemeColor, string> = {
    blue: 'Blue',
    purple: 'Purple',
    green: 'Green',
    pink: 'Pink',
    orange: 'Orange',
    red: 'Red',
    teal: 'Teal',
    indigo: 'Indigo',
  }

  return (
    <header className="h-12 ml-4 sm:h-14 md:h-16 bg-background dark:bg-background-dark border-b border-border dark:border-border-darkMode flex items-center justify-between px-2 sm:px-3 md:px-6 shrink-0 relative z-10 mx-auto w-full" suppressHydrationWarning>
      {/* Left Section - Menu Button */}
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        {/* Sidebar Toggle Button - Always visible */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-1.5 sm:p-2 hover:bg-accent dark:hover:bg-background-overlayDark rounded-lg transition-colors shrink-0"
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="h-4 w-4 sm:h-5 sm:w-5 text-foreground dark:text-text-mutedDark" />
            ) : (
              <PanelLeftOpen className="h-4 w-4 sm:h-5 sm:w-5 text-foreground dark:text-text-mutedDark" />
            )}
          </button>
        )}
      </div>

      {/* Right Section - Action Buttons (Compact on mobile) */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-3 min-w-0 shrink-0">
        {/* Theme Button (Separate) */}
        <div ref={themeButtonRef} className="relative">
          <button
            onClick={handleThemeButtonClick}
            className="p-1.5 sm:p-2 md:p-2.5 bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg hover:bg-background-overlayDark dark:hover:bg-background-overlayDark transition-colors shrink-0"
            aria-label="Theme settings"
            title="Theme settings"
            suppressHydrationWarning
          >
            {isDark ? (
              <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-foreground dark:text-foreground" />
            ) : (
              <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-foreground dark:text-foreground" />
            )}
          </button>

          {/* Theme Picker Dropdown */}
          {isThemePickerOpen && (
            <div 
              ref={themePickerRef}
              className="absolute right-0 top-full mt-2 w-[280px] sm:w-64 bg-card dark:bg-background-cardDark border-2 border-border dark:border-border-darkMode rounded-lg shadow-lg z-50 overflow-hidden p-3 sm:p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Dark Mode Toggle */}
              <div className="mb-4 pb-4 border-b border-border dark:border-border-darkModeSubtle">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground dark:text-text-primaryDark">
                    {isDark ? 'Dark' : 'Light'} Mode
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleThemeToggle(e)
                    }}
                    className="p-2 rounded-lg border border-border dark:border-[#2d3748] bg-background dark:bg-[#1e2535] hover:bg-accent dark:hover:bg-[#252b3a] transition-colors"
                    aria-label={`Switch to ${mounted && isDark ? 'light' : 'dark'} mode`}
                    suppressHydrationWarning
                  >
                    {isDark ? (
                      <Sun className="h-4 w-4 text-foreground dark:text-[#cbd5e1]" />
                    ) : (
                      <Moon className="h-4 w-4 text-foreground dark:text-[#cbd5e1]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Theme Color Picker */}
              <div className="mb-4 pb-4 border-b border-border dark:border-border-darkModeSubtle space-y-3">
                <div className="text-xs font-medium text-foreground dark:text-text-primaryDark uppercase tracking-wider">
                  Theme Color
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(themeColors) as ThemeColor[]).map((colorOption) => (
                    <button
                      key={colorOption}
                      onClick={(e) => {
                        e.stopPropagation()
                        setColor(colorOption)
                        setIsThemePickerOpen(false)
                      }}
                      className={`relative group w-10 h-10 rounded-lg transition-all hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-offset-background dark:hover:ring-offset-background-dark hover:ring-brand-primary ${
                        color === colorOption
                          ? 'ring-2 ring-offset-2 ring-offset-background dark:ring-offset-background-dark ring-brand-primary scale-105'
                          : ''
                      }`}
                      style={{
                        backgroundColor: themeColors[colorOption].primary,
                      }}
                      aria-label={`Select ${colorNames[colorOption]} theme`}
                      title={colorNames[colorOption]}
                    >
                      {color === colorOption && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white drop-shadow-lg" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wallpaper Picker */}
              <div className="space-y-3">
                <WallpaperPicker />
              </div>
            </div>
          )}
        </div>

        {/* Avatar Button (Separate) */}
        <div ref={avatarButtonRef} className="relative shrink-0">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-1.5 sm:p-2 md:p-2.5 bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg hover:bg-background-overlayDark dark:hover:bg-background-overlayDark transition-colors"
            aria-label="User menu"
          >
            <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-primary/20 flex items-center justify-center">
              {user?.name ? (
                <span className="text-[10px] sm:text-xs font-semibold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
              )}
            </div>
          </button>

          {/* User Dropdown Menu */}
          {isDropdownOpen && (
            <div 
              className="absolute right-0 top-full mt-2 w-[240px] sm:w-56 bg-card dark:bg-background-cardDark border-2 border-border dark:border-border-darkMode rounded-lg shadow-lg z-50 overflow-hidden"
              ref={dropdownRef}
            >
              {/* User Details */}
              <div className="p-2.5 sm:p-3">
                <p className="text-xs sm:text-sm font-semibold text-foreground dark:text-text-primaryDark">{user?.name || 'UserName'}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground dark:text-text-mutedDark truncate">{user?.email || ''}</p>
              </div>
            </div>
          )}
        </div>
              
        {/* Logout Button (Separate) */}
        <button
          onClick={handleLogout}
          className="p-1.5 sm:p-2 md:p-2.5 bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg hover:bg-background-overlayDark dark:hover:bg-background-overlayDark transition-colors shrink-0"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-foreground dark:text-foreground" />
        </button>
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center min-w-0">
          <div className="relative">
            <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground dark:text-text-mutedDark" />
            <input
              type="text"
              placeholder="Search all tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  // Navigate to search results or filter current view
                  e.preventDefault()
                }
              }}
              className="pl-8 sm:pl-9 pr-2 sm:pr-3 py-1 sm:py-1.5 w-[120px] sm:w-[140px] md:w-[180px] lg:w-[220px] xl:w-[280px] bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg text-xs sm:text-sm text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

