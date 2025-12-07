'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { TaskContent } from '@/components/task-manager/task-content'
import { useTaskCounts, useSearch } from '../layout'
import { taskService } from '@/lib/api/taskService'
import { logger } from '@/lib/utils/logger'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setTaskCounts } = useTaskCounts()
  const { setSearchQuery: setGlobalSearchQuery } = useSearch()
  const query = searchParams.get('q') || ''
  const [hasResults, setHasResults] = useState<boolean | null>(null)

  // Update global search query when query changes
  useEffect(() => {
    setGlobalSearchQuery(query)
  }, [query, setGlobalSearchQuery])

  // Check if there are results
  useEffect(() => {
    if (query.trim()) {
      setHasResults(null) // Loading state
      taskService.searchAllTasks(query.trim())
        .then((tasks) => {
          setHasResults(tasks.length > 0)
        })
        .catch((error) => {
          logger.error('Failed to search tasks:', error)
          setHasResults(false)
        })
    } else {
      setHasResults(false)
      // If no query, redirect to dashboard
      router.push('/dashboard')
    }
  }, [query, router])

  // Show loading state
  if (hasResults === null) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8">
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground dark:text-text-mutedDark">
              Searching...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // If no results, show empty state
  if (!hasResults && query.trim()) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8">
          <div className="text-center py-12">
            <p className="text-lg font-medium text-foreground dark:text-text-primaryDark mb-2">
              No tasks found
            </p>
            <p className="text-sm text-muted-foreground dark:text-text-mutedDark">
              No tasks match &quot;{query}&quot;
            </p>
          </div>
        </div>
      </div>
    )
  }

  // If has results, show filtered tasks
  return (
    <TaskContent
      selectedCategory="search"
      searchQuery={query}
      onTaskCountsChange={setTaskCounts}
      onAddTask={() => {
        // TODO: Open add task modal
      }}
      onUndo={() => {
        // TODO: Implement undo
      }}
      onRedo={() => {
        // TODO: Implement redo
      }}
    />
  )
}
