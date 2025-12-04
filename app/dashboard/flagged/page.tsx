'use client'

import { TaskContent } from '@/components/task-manager/task-content'
import { useSearch, useTaskCounts } from '../layout'

export default function FlaggedPage() {
  const { searchQuery } = useSearch()
  const { setTaskCounts } = useTaskCounts()
  return <TaskContent selectedCategory="flagged" searchQuery={searchQuery} onTaskCountsChange={setTaskCounts} />
}

