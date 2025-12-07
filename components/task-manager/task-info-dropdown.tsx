'use client'

import { useRef, useEffect } from 'react'
import { Edit2, Trash2, UserPlus, Calendar } from 'lucide-react'
import type { Task } from '@/lib/interface/task'
import { formatTaskDate, formatPriority, formatStatus } from '@/lib/utils/task-helpers'

interface TaskInfoDropdownProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onAssign: () => void
  position?: { top: number; left: number }
}

export function TaskInfoDropdown({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onAssign,
  position,
}: TaskInfoDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute z-50 bg-background-cardDark dark:bg-background-cardDark border-2 border-border dark:border-border-darkMode rounded-lg shadow-xl min-w-[280px] max-w-[320px] overflow-hidden"
      style={
        position
          ? {
              top: `${position.top}px`,
              left: `${position.left}px`,
            }
          : undefined
      }
    >
      {/* Task Details */}
      <div className="p-4 border-b border-border dark:border-border-darkMode">
        <h3 className="font-semibold text-foreground dark:text-text-primaryDark mb-2 truncate">
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-muted-foreground dark:text-text-mutedDark line-clamp-2 mb-3">
            {task.description}
          </p>
        )}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground dark:text-text-mutedDark">Status:</span>
            <span className="text-foreground dark:text-text-primaryDark font-medium">
              {formatStatus(task.status)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground dark:text-text-mutedDark">Priority:</span>
            <span className="text-foreground dark:text-text-primaryDark font-medium">
              {formatPriority(task.priority)}
            </span>
          </div>
          {task.dueDate && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground dark:text-text-mutedDark flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Due Date:
              </span>
              <span className="text-foreground dark:text-text-primaryDark font-medium">
                {formatTaskDate(task.dueDate)}
              </span>
            </div>
          )}
          {task.assignedByEmail && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground dark:text-text-mutedDark">Assigned by:</span>
              <span className="text-foreground dark:text-text-primaryDark font-medium truncate max-w-[150px]">
                {task.assignedByEmail}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-2">
        <button
          onClick={() => {
            onAssign()
            onClose()
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-background-overlayDark dark:hover:bg-background-overlayDark transition-colors text-left text-sm text-foreground dark:text-text-primaryDark"
        >
          <UserPlus className="h-4 w-4 text-primary" />
          <span>Assign to Friend</span>
        </button>
        <button
          onClick={() => {
            onEdit()
            onClose()
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-background-overlayDark dark:hover:bg-background-overlayDark transition-colors text-left text-sm text-foreground dark:text-text-primaryDark"
        >
          <Edit2 className="h-4 w-4 text-blue-500" />
          <span>Edit Task</span>
        </button>
        <button
          onClick={() => {
            onDelete()
            onClose()
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-background-overlayDark dark:hover:bg-background-overlayDark transition-colors text-left text-sm text-foreground dark:text-text-primaryDark"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
          <span>Delete Task</span>
        </button>
      </div>
    </div>
  )
}

