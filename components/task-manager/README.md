# Task Management UI Components

This directory contains reusable UI components for task and friend management. All components are ready to use and only require API integration.

## Components Overview

### 1. TaskForm (`task-form.tsx`)
Modal form for creating and editing tasks.

**Props:**
- `task?: Task | null` - Task to edit (null for new task)
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal closes
- `onSubmit: (taskData) => Promise<void>` - Callback when form is submitted
- `isLoading?: boolean` - Loading state

**Usage:**
```tsx
import { TaskForm } from '@/components/task-manager/task-form'

// Create new task
<TaskForm
  isOpen={isCreateOpen}
  onClose={() => setIsCreateOpen(false)}
  onSubmit={async (taskData) => {
    // Call your API here
    await createTaskAPI(taskData)
    toastService.success('Task created!')
  }}
/>

// Edit existing task
<TaskForm
  task={selectedTask}
  isOpen={isEditOpen}
  onClose={() => setIsEditOpen(false)}
  onSubmit={async (taskData) => {
    // Call your API here
    await updateTaskAPI(selectedTask.id, taskData)
    toastService.success('Task updated!')
  }}
/>
```

### 2. DeleteTaskDialog (`delete-task-dialog.tsx`)
Confirmation dialog for deleting tasks.

**Props:**
- `task: Task | null` - Task to delete
- `isOpen: boolean` - Controls dialog visibility
- `onClose: () => void` - Callback when dialog closes
- `onConfirm: () => Promise<void>` - Callback when delete is confirmed
- `isLoading?: boolean` - Loading state

**Usage:**
```tsx
import { DeleteTaskDialog } from '@/components/task-manager/delete-task-dialog'

<DeleteTaskDialog
  task={taskToDelete}
  isOpen={isDeleteOpen}
  onClose={() => setIsDeleteOpen(false)}
  onConfirm={async () => {
    // Call your API here
    await deleteTaskAPI(taskToDelete.id)
    toastService.success('Task deleted!')
  }}
/>
```

### 3. SendFriendRequestModal (`send-friend-request-modal.tsx`)
Modal for sending friend requests via email.

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal closes
- `onSend: (email: string) => Promise<void>` - Callback when request is sent
- `isLoading?: boolean` - Loading state

**Usage:**
```tsx
import { SendFriendRequestModal } from '@/components/task-manager/send-friend-request-modal'

<SendFriendRequestModal
  isOpen={isSendRequestOpen}
  onClose={() => setIsSendRequestOpen(false)}
  onSend={async (email) => {
    // Call your API here
    await sendFriendRequestAPI(email)
    toastService.success('Friend request sent!')
  }}
/>
```

### 4. AssignTaskModal (`assign-task-modal.tsx`)
Modal for assigning tasks to friends.

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal closes
- `onAssign: (friendId: string, friendEmail: string) => Promise<void>` - Callback when task is assigned
- `friends: Friend[]` - List of friends to choose from
- `isLoading?: boolean` - Loading state
- `taskTitle?: string` - Optional task title to display

**Usage:**
```tsx
import { AssignTaskModal } from '@/components/task-manager/assign-task-modal'

<AssignTaskModal
  isOpen={isAssignOpen}
  onClose={() => setIsAssignOpen(false)}
  friends={friendsList}
  taskTitle={selectedTask?.title}
  onAssign={async (friendId, friendEmail) => {
    // Call your API here
    await assignTaskAPI(selectedTask.id, friendId, friendEmail)
    toastService.success('Task assigned!')
  }}
/>
```

### 5. FriendRequestsList (`friend-requests-list.tsx`)
Component for displaying and managing friend requests.

**Props:**
- `requests: FriendRequest[]` - List of friend requests
- `onAccept: (requestId: string) => Promise<void>` - Callback when request is accepted
- `onReject: (requestId: string) => Promise<void>` - Callback when request is rejected
- `isLoading?: boolean` - Loading state
- `currentUserEmail?: string` - Current user's email to identify incoming vs outgoing requests

**Usage:**
```tsx
import { FriendRequestsList, type FriendRequest } from '@/components/task-manager/friend-requests-list'

const [requests, setRequests] = useState<FriendRequest[]>([])

<FriendRequestsList
  requests={requests}
  currentUserEmail={user?.email}
  onAccept={async (requestId) => {
    // Call your API here
    await acceptFriendRequestAPI(requestId)
    toastService.success('Friend request accepted!')
    // Refresh requests list
    const updated = await fetchFriendRequestsAPI()
    setRequests(updated)
  }}
  onReject={async (requestId) => {
    // Call your API here
    await rejectFriendRequestAPI(requestId)
    toastService.success('Friend request rejected!')
    // Refresh requests list
    const updated = await fetchFriendRequestsAPI()
    setRequests(updated)
  }}
/>
```

## Helper Utilities

### Task Helpers (`lib/utils/task-helpers.ts`)

Utility functions for task management:

- `validateTask(data)` - Validates task data
- `formatPriority(priority)` - Formats priority for display
- `formatStatus(status)` - Formats status for display
- `getPriorityColor(priority)` - Gets Tailwind color classes for priority
- `getStatusColor(status)` - Gets Tailwind color classes for status
- `isTaskOverdue(task)` - Checks if task is overdue
- `formatTaskDate(dateString)` - Formats date for display
- `validateEmail(email)` - Validates email address
- `createEmptyTask()` - Creates empty task object
- `canEditTask(task, currentUserId)` - Checks edit permissions
- `canDeleteTask(task, currentUserId)` - Checks delete permissions

**Usage:**
```tsx
import { validateTask, formatPriority, isTaskOverdue } from '@/lib/utils/task-helpers'

// Validate before submission
const validation = validateTask(taskData)
if (!validation.isValid) {
  // Show errors
  return
}

// Format for display
const priorityLabel = formatPriority(task.priority) // "Low", "Medium", "High"

// Check if overdue
if (isTaskOverdue(task)) {
  // Show warning
}
```

## API Integration Example

Here's a complete example of integrating these components with your API:

```tsx
'use client'

import { useState } from 'react'
import { TaskForm } from '@/components/task-manager/task-form'
import { DeleteTaskDialog } from '@/components/task-manager/delete-task-dialog'
import { AssignTaskModal } from '@/components/task-manager/assign-task-modal'
import { toastService } from '@/lib/utils/toast'
import type { Task } from '@/lib/interface/task'

export function TaskManager() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // API calls (replace with your actual API)
  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true)
    try {
      // Replace with your API call
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })
      if (!response.ok) throw new Error('Failed to create task')
      toastService.success('Task created successfully!')
      // Refresh task list
    } catch (error) {
      toastService.error('Failed to create task')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedTask) return
    setIsLoading(true)
    try {
      // Replace with your API call
      const response = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })
      if (!response.ok) throw new Error('Failed to update task')
      toastService.success('Task updated successfully!')
      // Refresh task list
    } catch (error) {
      toastService.error('Failed to update task')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTask = async () => {
    if (!selectedTask) return
    setIsLoading(true)
    try {
      // Replace with your API call
      const response = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete task')
      toastService.success('Task deleted successfully!')
      // Refresh task list
    } catch (error) {
      toastService.error('Failed to delete task')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const assignTask = async (friendId: string, friendEmail: string) => {
    if (!selectedTask) return
    setIsLoading(true)
    try {
      // Replace with your API call
      const response = await fetch(`/api/tasks/${selectedTask.id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId, friendEmail }),
      })
      if (!response.ok) throw new Error('Failed to assign task')
      toastService.success('Task assigned successfully!')
      // Refresh task list
    } catch (error) {
      toastService.error('Failed to assign task')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Your task list UI here */}
      
      {/* Create Task */}
      <TaskForm
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={createTask}
        isLoading={isLoading}
      />

      {/* Edit Task */}
      <TaskForm
        task={selectedTask}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false)
          setSelectedTask(null)
        }}
        onSubmit={updateTask}
        isLoading={isLoading}
      />

      {/* Delete Task */}
      <DeleteTaskDialog
        task={selectedTask}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setSelectedTask(null)
        }}
        onConfirm={deleteTask}
        isLoading={isLoading}
      />

      {/* Assign Task */}
      <AssignTaskModal
        isOpen={isAssignOpen}
        onClose={() => {
          setIsAssignOpen(false)
          setSelectedTask(null)
        }}
        friends={friendsList}
        taskTitle={selectedTask?.title}
        onAssign={assignTask}
        isLoading={isLoading}
      />
    </>
  )
}
```

## Features

✅ **Form Validation** - All forms include client-side validation
✅ **Error Handling** - Proper error states and messages
✅ **Loading States** - Disabled states during API calls
✅ **Responsive Design** - Works on mobile and desktop
✅ **Accessibility** - ARIA labels and keyboard navigation
✅ **Type Safety** - Full TypeScript support
✅ **Dark Mode** - Supports light/dark themes

## Next Steps

1. Replace API calls in the example with your actual backend endpoints
2. Add error handling for specific error cases
3. Implement optimistic updates if needed
4. Add pagination for friend requests if you have many requests
5. Add real-time updates using WebSockets if needed

All components are production-ready and follow React best practices!

