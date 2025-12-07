'use client'

import { TaskContent } from '@/components/task-manager/task-content'
import { useSearch, useTaskCounts } from '../layout'

export default function FriendsPage() {
  const { searchQuery } = useSearch()
  const { setTaskCounts } = useTaskCounts()
  return (
    <TaskContent
      selectedCategory="friends"
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

