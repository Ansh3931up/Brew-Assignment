'use client'

import { AlertTriangle, X } from 'lucide-react'
import type { Task } from '@/lib/interface/task'
import { logger } from '@/lib/utils/logger'

interface DeleteTaskDialogProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  isLoading?: boolean
}

export function DeleteTaskDialog({ task, isOpen, onClose, onConfirm, isLoading = false }: DeleteTaskDialogProps) {
  if (!isOpen || !task) return null

  const handleConfirm = async () => {
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      // Error handling is done by parent component
      logger.error('Failed to delete task:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-background dark:bg-background-cardDark border-2 border-border dark:border-border-darkMode rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border dark:border-border-darkMode">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground dark:text-text-primaryDark">
              Delete Task
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-background-overlayDark dark:hover:bg-background-overlayDark rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-foreground dark:text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <p className="text-foreground dark:text-text-primaryDark mb-4">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <div className="bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg p-3 mb-4">
            <p className="font-semibold text-foreground dark:text-text-primaryDark">{task.title}</p>
            {task.description && (
              <p className="text-sm text-muted-foreground dark:text-text-mutedDark mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg text-foreground dark:text-foreground hover:bg-background-overlayDark dark:hover:bg-background-overlayDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Deleting...' : 'Delete Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

