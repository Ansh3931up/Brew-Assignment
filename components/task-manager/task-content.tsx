'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { CheckCircle2, Info, Plus, Undo2, Redo2, Edit2, Trash2 } from 'lucide-react'
import type { RootState } from '@/lib/store'
import { mockTasksService } from '@/lib/utils/mockTasks'
import { mockFriendsService } from '@/lib/utils/mockFriends'
import type { Task } from '@/lib/interface/task'
import { useTheme } from '@/providers/theme-provider'
import { logger } from '@/lib/utils/logger'
import { TaskForm } from './task-form'
import { DeleteTaskDialog } from './delete-task-dialog'
import { AssignTaskModal } from './assign-task-modal'
import { TaskInfoDropdown } from './task-info-dropdown'
import { toastService } from '@/lib/utils/toast'

interface TaskContentProps {
  selectedCategory: string | null
  searchQuery: string
  onAddTask?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onTaskCountsChange?: (counts: {
    all: number
    today: number
    scheduled: number
    flagged: number
    completed: number
    friends: number
  }) => void
}

export function TaskContent({ 
  selectedCategory, 
  searchQuery, 
  onAddTask,
  onUndo,
  onRedo,
  onTaskCountsChange 
}: TaskContentProps) {
  const { user } = useSelector((state: RootState) => state.auth)
  const { wallpaper } = useTheme()
  const [myTasks, setMyTasks] = useState<Task[]>([])
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([])
  const [friends, setFriends] = useState<{ id: string; name: string; email: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [taskToAssign, setTaskToAssign] = useState<Task | null>(null)
  const [taskForInfo, setTaskForInfo] = useState<Task | null>(null)
  const [infoDropdownPosition, setInfoDropdownPosition] = useState<{ top: number; left: number } | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false)

  const loadTasks = useCallback(async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const tasks = await mockTasksService.getTasks(user.id)
      const assigned = await mockTasksService.getAssignedTasks(user.id)
      
      setMyTasks(tasks)
      setAssignedTasks(assigned)
    } catch (error) {
      logger.error('Failed to load tasks:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  const loadFriends = useCallback(async () => {
    if (!user?.id) return
    try {
      const friendsList = await mockFriendsService.getFriends(user.id)
      setFriends(friendsList)
    } catch (error) {
      logger.error('Failed to load friends:', error)
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id) {
      loadTasks()
      loadFriends()
    }
  }, [user?.id, loadTasks, loadFriends])

  const toggleTaskStatus = async (taskId: string, currentStatus: Task['status']) => {
    if (!user?.id) return
    
    // Simple toggle: todo <-> completed (Reminders style)
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed'
    
    try {
      await mockTasksService.updateTask(user.id, taskId, { status: newStatus })
      loadTasks()
    } catch (error) {
      logger.error('Failed to update task:', error)
    }
  }

  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user?.id) return
    try {
      await mockTasksService.createTask(user.id, taskData)
      await loadTasks()
      toastService.success('Task created successfully!')
      setIsCreateModalOpen(false)
    } catch (error) {
      logger.error('Failed to create task:', error)
      toastService.error('Failed to create task')
      throw error
    }
  }, [user?.id, loadTasks])

  const deleteTask = useCallback(async () => {
    if (!user?.id || !taskToDelete) return
    try {
      await mockTasksService.deleteTask(user.id, taskToDelete.id)
      await loadTasks()
      toastService.success('Task deleted successfully!')
      setIsDeleteDialogOpen(false)
      setTaskToDelete(null)
      setSelectedTaskId(null)
    } catch (error) {
      logger.error('Failed to delete task:', error)
      toastService.error('Failed to delete task')
      throw error
    }
  }, [user?.id, taskToDelete, loadTasks])

  const handleEditTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!taskToEdit || !user?.id) return
    try {
      await mockTasksService.updateTask(user.id, taskToEdit.id, taskData)
      await loadTasks()
      toastService.success('Task updated successfully!')
      setIsEditModalOpen(false)
      setTaskToEdit(null)
      setSelectedTaskId(null)
    } catch (error) {
      logger.error('Failed to update task:', error)
      toastService.error('Failed to update task')
      throw error
    }
  }, [taskToEdit, user?.id, loadTasks])

  const handleAssignTask = useCallback(async (friendId: string, friendEmail: string) => {
    if (!taskToAssign || !user?.id) return
    try {
      await mockTasksService.updateTask(user.id, taskToAssign.id, {
        assignedBy: friendId,
        assignedByEmail: friendEmail,
      })
      await loadTasks()
      toastService.success('Task assigned successfully!')
      setIsAssignModalOpen(false)
      setTaskToAssign(null)
      setSelectedTaskId(null)
    } catch (error) {
      logger.error('Failed to assign task:', error)
      toastService.error('Failed to assign task')
      throw error
    }
  }, [taskToAssign, user?.id, loadTasks])

  const clearMyCompletedTasks = async () => {
    if (!user?.id) return
    
    try {
      const completedTasks = myTasks.filter(t => t.status === 'completed')
      for (const task of completedTasks) {
        await mockTasksService.deleteTask(user.id, task.id)
      }
      loadTasks()
    } catch (error) {
      logger.error('Failed to clear completed tasks:', error)
    }
  }

  // Filter tasks based on category and search
  const filterTasks = useCallback((tasks: Task[]) => {
    let filtered = tasks

    // Filter by category
    if (selectedCategory) {
      const today = new Date().toISOString().split('T')[0]
      switch (selectedCategory) {
        case 'completed':
          filtered = filtered.filter((t) => t.status === 'completed')
          break
        case 'missed':
          filtered = filtered.filter(
            (t) => t.dueDate && t.dueDate < today && t.status !== 'completed'
          )
          break
        case 'today':
          filtered = filtered.filter((t) => t.dueDate === today)
          break
        case 'scheduled':
          filtered = filtered.filter((t) => t.dueDate && t.dueDate > today && t.status !== 'completed')
          break
        case 'flagged':
          filtered = filtered.filter((t) => t.priority === 'high')
          break
        case 'friends':
          filtered = filtered.filter((t) => !!t.assignedBy)
          break
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [selectedCategory, searchQuery])

  // Calculate task counts for sidebar - use useMemo to ensure stable reference
  const taskCounts = useMemo(() => {
    const allTasks = [...myTasks, ...assignedTasks]
    const today = new Date().toISOString().split('T')[0]
    
    return {
      all: allTasks.length,
      today: allTasks.filter((t) => t.dueDate === today).length,
      scheduled: allTasks.filter((t) => t.dueDate && t.dueDate > today && t.status !== 'completed').length,
      flagged: allTasks.filter((t) => t.priority === 'high').length,
      completed: allTasks.filter((t) => t.status === 'completed').length,
      friends: assignedTasks.length,
    }
  }, [myTasks, assignedTasks])

  const callbackRef = useRef(onTaskCountsChange)
  const prevCountsRef = useRef<typeof taskCounts | null>(null)

  // Store the latest callback in a ref
  useEffect(() => {
    callbackRef.current = onTaskCountsChange
  }, [onTaskCountsChange])

  // Update parent with task counts only when they actually change
  useEffect(() => {
    if (prevCountsRef.current === null) {
      // First render - initialize and notify parent
      prevCountsRef.current = taskCounts
      if (callbackRef.current) {
        callbackRef.current(taskCounts)
      }
      return
    }

    const countsChanged = JSON.stringify(prevCountsRef.current) !== JSON.stringify(taskCounts)
    if (countsChanged && callbackRef.current) {
      prevCountsRef.current = taskCounts
      callbackRef.current(taskCounts)
    }
  }, [taskCounts])

  // Filter and separate my tasks
  const myDisplayTasks = useMemo(() => {
    return filterTasks(myTasks)
  }, [myTasks, filterTasks])

  const myIncompleteTasks = myDisplayTasks.filter(t => t.status !== 'completed')
  const myCompletedTasks = myDisplayTasks.filter(t => t.status === 'completed')

  // Filter and separate assigned tasks
  const assignedDisplayTasks = useMemo(() => {
    return filterTasks(assignedTasks)
  }, [assignedTasks, filterTasks])

  const assignedIncompleteTasks = assignedDisplayTasks.filter(t => t.status !== 'completed')
  const assignedCompletedTasks = assignedDisplayTasks.filter(t => t.status === 'completed')

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground dark:text-text-mutedDark">Loading tasks...</p>
        </div>
      </div>
    )
  }

  const renderTaskList = (tasks: Task[], sectionType: 'my' | 'assigned') => {
    if (tasks.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground dark:text-text-mutedDark text-sm">
          <p>No tasks found.</p>
        </div>
      )
    }

    return (
      <div className="space-y-0 w-full">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => setSelectedTaskId(selectedTaskId === task.id ? null : task.id)}
            className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 cursor-pointer transition-colors ${
              selectedTaskId === task.id
                ? 'bg-background-overlayDark dark:bg-background-overlayDark rounded'
                : 'hover:bg-background-overlayDark/50 dark:hover:bg-background-overlayDark/30 rounded'
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleTaskStatus(task.id, task.status)
              }}
              className="shrink-0 flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-foreground dark:border-text-mutedDark hover:border-brand-primary dark:hover:border-brand-primary transition-colors"
            >
              {task.status === 'completed' && (
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-brand-primary dark:text-brand-primary fill-current" />
              )}
            </button>
            <span className="flex-1 text-foreground dark:text-text-primaryDark text-xs sm:text-sm min-w-0 truncate">
              {task.title}
              {sectionType === 'assigned' && task.assignedByEmail && (
                <span className="text-[10px] sm:text-xs text-muted-foreground dark:text-text-mutedDark ml-1 sm:ml-2">
                  (from {task.assignedByEmail.split('@')[0]})
                </span>
              )}
            </span>
            {selectedTaskId === task.id && (
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const taskForInfo = [...myTasks, ...assignedTasks].find(t => t.id === task.id)
                      if (taskForInfo) {
                        setTaskForInfo(taskForInfo)
                        const rect = e.currentTarget.getBoundingClientRect()
                        setInfoDropdownPosition({ top: rect.bottom + 4, left: rect.left })
                        setIsInfoDropdownOpen(true)
                      }
                    }}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-brand-primary dark:bg-brand-primary flex items-center justify-center hover:bg-brand-primary/80 transition-colors"
                    aria-label="Task info"
                    title="Info"
                  >
                    <Info className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                  </button>
                  {isInfoDropdownOpen && taskForInfo && taskForInfo.id === task.id && (
                    <TaskInfoDropdown
                      task={taskForInfo}
                      isOpen={isInfoDropdownOpen}
                      onClose={() => {
                        setIsInfoDropdownOpen(false)
                        setTaskForInfo(null)
                      }}
                      onEdit={() => {
                        setTaskToEdit(taskForInfo)
                        setIsEditModalOpen(true)
                      }}
                      onDelete={() => {
                        setTaskToDelete(taskForInfo)
                        setIsDeleteDialogOpen(true)
                      }}
                      onAssign={() => {
                        setTaskToAssign(taskForInfo)
                        setIsAssignModalOpen(true)
                      }}
                      position={infoDropdownPosition || undefined}
                    />
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const taskToEdit = [...myTasks, ...assignedTasks].find(t => t.id === task.id)
                    if (taskToEdit) {
                      setTaskToEdit(taskToEdit)
                      setIsEditModalOpen(true)
                    }
                  }}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors"
                  aria-label="Edit task"
                  title="Edit"
                >
                  <Edit2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const taskToDelete = [...myTasks, ...assignedTasks].find(t => t.id === task.id)
                    if (taskToDelete) {
                      setTaskToDelete(taskToDelete)
                      setIsDeleteDialogOpen(true)
                    }
                  }}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                  aria-label="Delete task"
                  title="Delete"
                >
                  <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`flex-1 overflow-y-auto transition-colors duration-300 ${wallpaper ? 'bg-transparent dark:bg-transparent' : 'bg-background dark:bg-background-dark'}`}>
      <div className="mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8 space-y-4 sm:space-y-6 md:space-y-8">
        {/* My Tasks Section */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4 gap-2 sm:gap-4">
            <div className="min-w-0 flex-1">
              <div className="hidden sm:block">
                <p className="text-[10px] sm:text-xs text-muted-foreground dark:text-text-mutedDark uppercase tracking-wider">TASK MANAGER</p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary dark:text-brand-primary">MY TASKS</h1>
              </div>
              <div className="sm:hidden">
                <h1 className="text-xl font-bold text-brand-primary dark:text-brand-primary">MY TASKS</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Action Buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => {
                    setIsCreateModalOpen(true)
                    if (onAddTask) onAddTask()
                  }}
                  className="p-1.5 sm:p-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors shrink-0"
                  aria-label="Add new task"
                  title="Add Task"
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                {onUndo && (
                  <button
                    onClick={onUndo}
                    className="p-1.5 sm:p-2 bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode hover:bg-background-overlayDark dark:hover:bg-background-overlayDark rounded-lg transition-colors shrink-0"
                    aria-label="Undo"
                    title="Undo"
                  >
                    <Undo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-foreground dark:text-foreground" />
                  </button>
                )}
                {onRedo && (
                  <button
                    onClick={onRedo}
                    className="p-1.5 sm:p-2 bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode hover:bg-background-overlayDark dark:hover:bg-background-overlayDark rounded-lg transition-colors shrink-0"
                    aria-label="Redo"
                    title="Redo"
                  >
                    <Redo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-foreground dark:text-foreground" />
                  </button>
                )}
              </div>

              <div className="text-right shrink-0">
                <div className="text-brand-primary dark:text-brand-primary text-base sm:text-lg md:text-xl font-semibold">{myIncompleteTasks.length}</div>
                <div className="text-[10px] sm:text-xs text-foreground dark:text-text-mutedDark">Show</div>
              </div>
            </div>
          </div>

          {/* Completed Tasks Section */}
          {myCompletedTasks.length > 0 && (
            <div className="mb-4 flex items-center gap-2 text-sm text-foreground dark:text-text-mutedDark">
              <span>{myCompletedTasks.length} Completed</span>
              <button
                onClick={clearMyCompletedTasks}
                className="text-brand-primary dark:text-brand-primary hover:underline"
              >
                Clear
              </button>
            </div>
          )}

          {/* Task List */}
          {renderTaskList(myIncompleteTasks, 'my')}
        </div>

        {/* Friends Assigned Tasks Section */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4 gap-2 sm:gap-4">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-brand-primary dark:text-brand-primary min-w-0 flex-1">Friends Assigned Tasks</h2>
            <div className="text-right shrink-0">
              <div className="text-brand-primary dark:text-brand-primary text-base sm:text-lg md:text-xl font-semibold">{assignedIncompleteTasks.length}</div>
              <div className="text-[10px] sm:text-xs text-foreground dark:text-text-mutedDark">Show</div>
            </div>
          </div>

          {/* Completed Tasks Section */}
          {assignedCompletedTasks.length > 0 && (
            <div className="mb-4 flex items-center gap-2 text-sm text-foreground dark:text-text-mutedDark">
              <span>{assignedCompletedTasks.length} Completed</span>
            </div>
          )}

          {/* Task List */}
          {renderTaskList(assignedIncompleteTasks, 'assigned')}
        </div>
      </div>

      {/* Modals */}
      <TaskForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createTask}
      />

      <TaskForm
        task={taskToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setTaskToEdit(null)
        }}
        onSubmit={handleEditTask}
      />

      <DeleteTaskDialog
        task={taskToDelete}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setTaskToDelete(null)
        }}
        onConfirm={deleteTask}
      />

      <AssignTaskModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false)
          setTaskToAssign(null)
        }}
        friends={friends}
        taskTitle={taskToAssign?.title}
        onAssign={handleAssignTask}
      />
    </div>
  )
}

