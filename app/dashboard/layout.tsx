'use client'

import { useState, createContext, useContext, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { dashboardService } from '@/lib/api/taskService'
import type { RootState } from '@/lib/store'
import { logger } from '@/lib/utils/logger'

// Create context for search query
const SearchContext = createContext<{
  searchQuery: string
  setSearchQuery: (query: string) => void
}>({
  searchQuery: '',
  setSearchQuery: () => {},
})

// Type for task counts
type TaskCounts = {
  all?: number
  today?: number
  scheduled?: number
  flagged?: number
  completed?: number
  friends?: number
  missed?: number
}

// Create context for task counts
const TaskCountsContext = createContext<{
  taskCounts: TaskCounts
  setTaskCounts: (counts: TaskCounts) => void
}>({
  taskCounts: {},
  setTaskCounts: () => {},
})

export const useSearch = () => useContext(SearchContext)
export const useTaskCounts = () => useContext(TaskCountsContext)

// Export function to refresh stats - can be called from anywhere
export const useRefreshStats = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { setTaskCounts } = useTaskCounts()
  
  return useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      return
    }

    try {
      const stats = await dashboardService.getDashboardStats()
      setTaskCounts({
        all: stats.all || 0,
        today: stats.today || 0,
        scheduled: stats.scheduled || 0,
        flagged: stats.flagged || 0,
        completed: stats.completed || 0,
        friends: stats.friends || 0,
        missed: stats.missed || 0,
      })
      logger.info('Dashboard stats refreshed successfully', stats)
    } catch (error) {
      logger.error('Failed to refresh dashboard stats:', error)
    }
  }, [isAuthenticated, user?.id, setTaskCounts])
}

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const [searchQuery, setSearchQuery] = useState('')
  const [taskCountsState, setTaskCountsState] = useState({
    all: 0,
    today: 0,
    scheduled: 0,
    flagged: 0,
    completed: 0,
    friends: 0,
    missed: 0,
  })
  // Wrapper function to handle partial updates
  const setTaskCounts = useCallback((counts: TaskCounts) => {
    setTaskCountsState((prev) => ({ ...prev, ...counts }))
  }, [])

  // Convert state to context format (with optional properties)
  const taskCounts = {
    all: taskCountsState.all,
    today: taskCountsState.today,
    scheduled: taskCountsState.scheduled,
    flagged: taskCountsState.flagged,
    completed: taskCountsState.completed,
    friends: taskCountsState.friends,
    missed: taskCountsState.missed,
  }

  // Fetch dashboard stats when user is authenticated
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!isAuthenticated || !user?.id) {
        return
      }

      try {
        const stats = await dashboardService.getDashboardStats()
        setTaskCountsState({
          all: stats.all || 0,
          today: stats.today || 0,
          scheduled: stats.scheduled || 0,
          flagged: stats.flagged || 0,
          completed: stats.completed || 0,
          friends: stats.friends || 0,
          missed: stats.missed || 0,
        })
        logger.info('Dashboard stats loaded successfully', stats)
      } catch (error) {
        logger.error('Failed to fetch dashboard stats:', error)
        // Don't show error to user, just log it
      }
    }

    fetchDashboardStats()
  }, [isAuthenticated, user?.id])

  // Extract category from pathname
  const getCategoryFromPath = () => {
    if (pathname === '/dashboard/today') return 'today'
    if (pathname === '/dashboard/scheduled') return 'scheduled'
    if (pathname === '/dashboard/flagged') return 'flagged'
    if (pathname === '/dashboard/completed') return 'completed'
    if (pathname === '/dashboard/missed') return 'missed'
    if (pathname === '/dashboard/friends') return 'friends'
    if (pathname?.startsWith('/dashboard/search')) return 'search'
    return 'all'
  }

  const selectedCategory = getCategoryFromPath()

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <TaskCountsContext.Provider value={{ taskCounts, setTaskCounts }}>
        <DashboardLayout
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          taskCounts={taskCounts}
        >
          {children}
        </DashboardLayout>
      </TaskCountsContext.Provider>
    </SearchContext.Provider>
  )
}

