/**
 * Task Management Helper Utilities
 * 
 * These utilities provide validation, formatting, and helper functions
 * for task management operations. They are designed to work with the
 * task components and can be easily integrated with API calls.
 */

import type { Task } from '@/lib/interface/task'

export type TaskStatus = 'todo' | 'in-progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'

/**
 * Validates task data before submission
 */
export interface TaskValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function validateTask(data: {
  title: string
  description?: string
  dueDate?: string
}): TaskValidationResult {
  const errors: Record<string, string> = {}

  // Title validation
  if (!data.title || !data.title.trim()) {
    errors.title = 'Title is required'
  } else if (data.title.trim().length > 200) {
    errors.title = 'Title must be less than 200 characters'
  }

  // Description validation
  if (data.description && data.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters'
  }

  // Due date validation
  if (data.dueDate) {
    const selectedDate = new Date(data.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (isNaN(selectedDate.getTime())) {
      errors.dueDate = 'Invalid date format'
    } else if (selectedDate < today) {
      errors.dueDate = 'Due date cannot be in the past'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Formats task priority for display
 */
export function formatPriority(priority: TaskPriority): string {
  const priorityMap: Record<TaskPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  }
  return priorityMap[priority] || priority
}

/**
 * Formats task status for display
 */
export function formatStatus(status: TaskStatus): string {
  const statusMap: Record<TaskStatus, string> = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    completed: 'Done',
  }
  return statusMap[status] || status
}

/**
 * Gets priority color class
 */
export function getPriorityColor(priority: TaskPriority): string {
  const colorMap: Record<TaskPriority, string> = {
    low: 'text-blue-500 bg-blue-500/10',
    medium: 'text-yellow-500 bg-yellow-500/10',
    high: 'text-red-500 bg-red-500/10',
  }
  return colorMap[priority] || colorMap.medium
}

/**
 * Gets status color class
 */
export function getStatusColor(status: TaskStatus): string {
  const colorMap: Record<TaskStatus, string> = {
    todo: 'text-gray-500 bg-gray-500/10',
    'in-progress': 'text-blue-500 bg-blue-500/10',
    completed: 'text-green-500 bg-green-500/10',
  }
  return colorMap[status] || colorMap.todo
}

/**
 * Checks if task is overdue
 */
export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate) return false
  const dueDate = new Date(task.dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return dueDate < today && task.status !== 'completed'
}

/**
 * Formats date for display
 */
export function formatTaskDate(dateString: string | undefined): string {
  if (!dateString) return 'No due date'
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const taskDate = new Date(date)
  taskDate.setHours(0, 0, 0, 0)

  if (taskDate.getTime() === today.getTime()) {
    return 'Today'
  }

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (taskDate.getTime() === tomorrow.getTime()) {
    return 'Tomorrow'
  }

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (taskDate.getTime() === yesterday.getTime()) {
    return 'Yesterday'
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Validates email address
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Creates a new task object with default values
 */
export function createEmptyTask(): Omit<Task, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: undefined,
  }
}

/**
 * Checks if task can be edited (not assigned by someone else)
 */
export function canEditTask(task: Task, currentUserId?: string): boolean {
  // If task is not assigned, anyone can edit
  if (!task.assignedBy) return true
  // If assigned, only the assigner can edit
  return task.assignedBy === currentUserId
}

/**
 * Checks if task can be deleted
 */
export function canDeleteTask(task: Task, currentUserId?: string): boolean {
  // Similar logic to canEditTask
  if (!task.assignedBy) return true
  return task.assignedBy === currentUserId
}

