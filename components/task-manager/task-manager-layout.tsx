'use client'

import { useState } from 'react'
import { DashboardLayout } from '../dashboard/dashboard-layout'
import { TaskContent } from './task-content'
import { logger } from '@/lib/utils/logger'

export function TaskManagerLayout() {
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
      selectedCategory={null}
      taskCounts={taskCounts}
    >
      <TaskContent
        selectedCategory={null}
        searchQuery={searchQuery}
        onTaskCountsChange={setTaskCounts}
        onAddTask={() => {
          // TODO: Open add task modal/form
          logger.info('Add new task')
        }}
        onUndo={() => {
          // TODO: Implement undo functionality
          logger.info('Undo')
        }}
        onRedo={() => {
          // TODO: Implement redo functionality
          logger.info('Redo')
        }}
      />
    </DashboardLayout>
  )
}

