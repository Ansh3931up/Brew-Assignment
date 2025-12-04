'use client'

import { TaskContent } from '@/components/task-manager/task-content'
import { useSearch, useTaskCounts } from '../layout'

export default function ScheduledPage() {
  const { searchQuery } = useSearch()
  const { setTaskCounts } = useTaskCounts()
  return <TaskContent selectedCategory="scheduled" searchQuery={searchQuery} onTaskCountsChange={setTaskCounts} />
}

