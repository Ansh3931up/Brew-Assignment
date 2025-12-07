'use client'

import { useState, useEffect } from 'react'
import { TaskSidebar } from '../task-manager/task-sidebar'
import { TaskHeader } from '../task-manager/task-header'
import { Search } from 'lucide-react'
import { useTheme } from '@/providers/theme-provider'

interface DashboardLayoutProps {
  children: React.ReactNode
  searchQuery?: string
  onSearchChange?: (query: string) => void
  selectedCategory?: string | null
  taskCounts?: {
    all?: number
    today?: number
    scheduled?: number
    flagged?: number
    completed?: number
    friends?: number
  }
}

export function DashboardLayout({
  children,
  searchQuery = '',
  onSearchChange = () => {},
  selectedCategory = null,
  taskCounts = {},
}: DashboardLayoutProps) {
  // Initialize sidebar state - always start with false to avoid hydration mismatch
  // Will be updated after mount based on localStorage/window size
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { wallpaper } = useTheme()

  // Initialize sidebar state from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebar-open')
      if (stored !== null) {
        // Use setTimeout to defer setState call
        setTimeout(() => {
          setIsSidebarOpen(stored === 'true')
        }, 0)
      } else {
        // Default: open on desktop (md+), closed on mobile
        // Use setTimeout to defer setState call
        setTimeout(() => {
          setIsSidebarOpen(window.innerWidth >= 768)
        }, 0)
      }
    }
  }, [])

  // Persist sidebar state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-open', String(isSidebarOpen))
    }
  }, [isSidebarOpen])

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  return (
    <div className="h-screen flex md:flex-row bg-background dark:bg-background-dark overflow-hidden relative transition-colors duration-300">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar - Only renders on desktop, takes space in layout */}
      {isSidebarOpen && (
        <div className="hidden md:block w-[320px] lg:w-3/12 shrink-0 transition-all duration-300">
          <TaskSidebar
            selectedCategory={selectedCategory}
            isOpen={true}
            onClose={toggleSidebar}
            taskCounts={taskCounts}
            isDesktopOpen={true}
          />
        </div>
      )}

      {/* Mobile Sidebar - Fixed overlay, doesn't affect layout */}
   {isSidebarOpen &&   <TaskSidebar
        selectedCategory={selectedCategory}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        taskCounts={taskCounts}
        isDesktopOpen={false}
      />}

      {/* Main Content Area - Takes full width when sidebar is closed */}
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${wallpaper ? 'has-wallpaper-content' : ''} min-w-0 w-full`}
      >
        {/* Header - Compact on mobile */}
        <TaskHeader
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onMenuClick={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Mobile Search Bar - Below header */}
        <div className="md:hidden px-3 py-2.5 bg-background dark:bg-background-dark border-b border-border dark:border-[#2d3748]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-[#cbd5e1]" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-background-cardDark dark:bg-[#1e2535] border border-border dark:border-[#2d3748] rounded-lg text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Dynamic Content - Better padding on mobile */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

