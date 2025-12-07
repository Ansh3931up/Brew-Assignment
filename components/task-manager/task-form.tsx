'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, AlertCircle } from 'lucide-react'
import type { Task } from '@/lib/interface/task'
import { logger } from '@/lib/utils/logger'

interface TaskFormProps {
  task?: Task | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  isLoading?: boolean
}

type TaskStatus = 'todo' | 'active' | 'completed'
type TaskPriority = 'low' | 'medium' | 'high'

export function TaskForm({ task, isOpen, onClose, onSubmit, isLoading = false }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [flagged, setFlagged] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const formKey = task?.id || 'new'

  // Initialize form with task data if editing
  useEffect(() => {
    if (!isOpen) return

    // Use a timeout to batch state updates and avoid cascading renders
    const timeoutId = setTimeout(() => {
      if (task) {
        setTitle(task.title || '')
        setDescription(task.description || '')
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '')
        setPriority(task.priority || 'medium')
        setStatus(task.status || 'todo')
        setFlagged(task.flagged || false)
      } else {
        // Reset form for new task
        setTitle('')
        setDescription('')
        setDueDate('')
        setPriority('medium')
        setStatus('todo')
        setFlagged(false)
      }
      setErrors({})
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [task, isOpen, formKey])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (dueDate) {
      const selectedDate = new Date(dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        priority,
        status,
        flagged,
        assignedBy: task?.assignedBy,
        assignedByEmail: task?.assignedByEmail,
      })
      // Reset form on success
      setTitle('')
      setDescription('')
      setDueDate('')
      setPriority('medium')
      setStatus('todo')
      setErrors({})
      onClose()
    } catch (error) {
      // Error handling is done by parent component
      logger.error('Failed to submit task:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-background dark:bg-background-cardDark border-2 border-border dark:border-border-darkMode rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border dark:border-border-darkMode">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground dark:text-text-primaryDark">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-background-overlayDark dark:hover:bg-background-overlayDark rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-foreground dark:text-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground dark:text-text-primaryDark mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: '' }))
                }
              }}
              className={`w-full px-3 py-2 bg-background-cardDark dark:bg-background-cardDark border ${
                errors.title
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-border dark:border-border-darkMode'
              } rounded-lg text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Enter task title"
              disabled={isLoading}
              required
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground dark:text-text-primaryDark mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Enter task description (optional)"
              disabled={isLoading}
            />
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-foreground dark:text-text-primaryDark mb-1.5">
              <Calendar className="inline h-4 w-4 mr-1" />
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value)
                if (errors.dueDate) {
                  setErrors((prev) => ({ ...prev, dueDate: '' }))
                }
              }}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 bg-background-cardDark dark:bg-background-cardDark border ${
                errors.dueDate
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-border dark:border-border-darkMode'
              } rounded-lg text-foreground dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
              disabled={isLoading}
            />
            {errors.dueDate && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.dueDate}
              </p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-foreground dark:text-text-primaryDark mb-1.5">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg text-foreground dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isLoading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-foreground dark:text-text-primaryDark mb-1.5">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg text-foreground dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isLoading}
            >
              <option value="todo">To Do</option>
              <option value="active">Active</option>
              <option value="completed">Done</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg text-foreground dark:text-foreground hover:bg-background-overlayDark dark:hover:bg-background-overlayDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

