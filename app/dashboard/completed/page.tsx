'use client'

import { TaskContent } from '@/components/task-manager/task-content'
import { useSearch, useTaskCounts } from '../layout'

export default function CompletedPage() {
  const { searchQuery } = useSearch()
  const { setTaskCounts } = useTaskCounts()
  return <TaskContent selectedCategory="completed" searchQuery={searchQuery} onTaskCountsChange={setTaskCounts} />
}

