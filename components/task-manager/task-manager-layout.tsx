'use client'

import { useState } from 'react'
import { DashboardLayout } from '../dashboard/dashboard-layout'
import { TaskContent } from './task-content'

export function TaskManagerLayout() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [taskCounts, setTaskCounts] = useState({
    all: 0,
    today: 0,
    scheduled: 0,
    flagged: 0,
    completed: 0,
    friends: 0,
  })

  return (
    <DashboardLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedCategory={selectedCategory}
      onCategorySelect={setSelectedCategory}
      taskCounts={taskCounts}
    >
      <TaskContent
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onTaskCountsChange={setTaskCounts}
        onAddTask={() => {
          // TODO: Open add task modal/form
          console.log('Add new task')
        }}
        onUndo={() => {
          // TODO: Implement undo functionality
          console.log('Undo')
        }}
        onRedo={() => {
          // TODO: Implement redo functionality
          console.log('Redo')
        }}
      />
    </DashboardLayout>
  )
}

