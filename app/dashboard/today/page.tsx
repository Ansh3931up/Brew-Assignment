'use client'

import { TaskContent } from '@/components/task-manager/task-content'
import { useSearch, useTaskCounts } from '../layout'

export default function TodayPage() {
  const { searchQuery } = useSearch()
  const { setTaskCounts } = useTaskCounts()
  return (
    <TaskContent
      selectedCategory="today"
      searchQuery={searchQuery}
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

