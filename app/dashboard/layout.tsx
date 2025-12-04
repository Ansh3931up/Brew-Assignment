'use client'

import { useState, createContext, useContext } from 'react'
import { usePathname } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

// Create context for search query
const SearchContext = createContext<{
  searchQuery: string
  setSearchQuery: (query: string) => void
}>({
  searchQuery: '',
  setSearchQuery: () => {},
})

// Create context for task counts
const TaskCountsContext = createContext<{
  taskCounts: {
    all?: number
    today?: number
    scheduled?: number
    flagged?: number
    completed?: number
    friends?: number
  }
  setTaskCounts: (counts: {
    all?: number
    today?: number
    scheduled?: number
    flagged?: number
    completed?: number
    friends?: number
  }) => void
}>({
  taskCounts: {},
  setTaskCounts: () => {},
})

export const useSearch = () => useContext(SearchContext)
export const useTaskCounts = () => useContext(TaskCountsContext)

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')
  const [taskCounts, setTaskCounts] = useState({
    all: 0,
    today: 0,
    scheduled: 0,
    flagged: 0,
    completed: 0,
    friends: 0,
  })

  // Extract category from pathname
  const getCategoryFromPath = () => {
    if (pathname === '/dashboard/today') return 'today'
    if (pathname === '/dashboard/scheduled') return 'scheduled'
    if (pathname === '/dashboard/flagged') return 'flagged'
    if (pathname === '/dashboard/completed') return 'completed'
    if (pathname === '/dashboard/friends') return 'friends'
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

