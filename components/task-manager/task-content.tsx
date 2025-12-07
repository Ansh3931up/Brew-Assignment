'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CheckCircle2, Info, Plus, Undo2, Redo2, Edit2, Trash2, Filter, Eye, EyeOff, Flag, Calendar, ChevronDown } from 'lucide-react'
import type { RootState, AppDispatch } from '@/lib/store'
import {
  fetchTasks,
  fetchAssignedTasks,
  fetchTodayTasks,
  fetchFlaggedTasks,
  fetchScheduledTasks,
  fetchCompletedTasks,
  fetchMissedTasks,
  createTask as createTaskThunk,
  updateTask as updateTaskThunk,
  deleteTask as deleteTaskThunk,
  assignTaskToFriend as assignTaskToFriendThunk,
  optimisticUpdateStatus,
  revertOptimisticUpdate,
} from '@/lib/slices/taskSlice'
import { friendService } from '@/lib/api/friendService'
import { taskService } from '@/lib/api/taskService'
import type { Task } from '@/lib/interface/task'
import { useTheme } from '@/providers/theme-provider'
import { logger } from '@/lib/utils/logger'
import { TaskForm } from './task-form'
import { DeleteTaskDialog } from './delete-task-dialog'
import { AssignTaskModal } from './assign-task-modal'
import { TaskInfoDropdown } from './task-info-dropdown'
import { TaskSkeleton } from './task-skeleton'
import { toastService } from '@/lib/utils/toast'
import { getErrorMessage, isRateLimitError } from '@/lib/utils/errorHandler'
import { formatTaskDate } from '@/lib/utils/task-helpers'
import { useRefreshStats } from '@/app/dashboard/layout'

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
    missed: number
  }) => void
}

export function TaskContent({ 
  selectedCategory, 
  searchQuery, 
  onAddTask,
  onUndo: externalUndo,
  onRedo: externalRedo,
  onTaskCountsChange, // Not used - stats are managed in layout
}: TaskContentProps) {
  // Suppress unused parameter warning
  void onTaskCountsChange
  
  // Get refresh stats function
  const refreshStats = useRefreshStats()
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated, loading: authLoading } = useSelector((state: RootState) => state.auth)
  const { myTasks, assignedTasks, loading, rateLimited } = useSelector((state: RootState) => state.tasks)
  const { wallpaper } = useTheme()
  const [friends, setFriends] = useState<{ id: string; name: string; email: string }[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const friendsDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const loadingFriendsRef = useRef(false)
  const lastFetchTimeRef = useRef<number>(0)
  const loadingTasksRef = useRef(false)
  const hasInitialLoadRef = useRef(false)
  const lastUserIdRef = useRef<string | undefined>(undefined)
  // Removed bulk mode - not responsive and not good UX
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
  const [showCompletedTasks, setShowCompletedTasks] = useState(false)
  const [showAssignedCompletedTasks, setShowAssignedCompletedTasks] = useState(false)
  const [showAllCompleted, setShowAllCompleted] = useState(false)
  const [showAllAssignedCompleted, setShowAllAssignedCompleted] = useState(false)

  // Undo/Redo state management
  const operationHistory = useRef<Array<{
    type: 'create' | 'update' | 'delete' | 'status';
    task: Task;
    previousState?: Task;
    reverse: () => Promise<void>;
  }>>([]);
  const historyIndex = useRef(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Load tasks using Redux based on selected category
  const loadTasks = useCallback(async () => {
    if (!user?.id) {
      logger.warn('loadTasks: User ID not available')
      return
    }
    
    // Don't make requests if rate limited
    if (rateLimited) {
      logger.warn('Skipping loadTasks - rate limited')
      return
    }
    
    // Prevent duplicate simultaneous calls - but allow if previous call completed
    if (loadingTasksRef.current) {
      logger.warn('loadTasks: Already loading, skipping')
      return
    }
    
    // Throttle requests - but allow first load without throttling
    const now = Date.now()
    if (hasInitialLoadRef.current && now - lastFetchTimeRef.current < 2000) {
      logger.warn('loadTasks: Throttled (too soon after last fetch)')
      return
    }
    
    loadingTasksRef.current = true
    lastFetchTimeRef.current = now
    
    try {
      logger.info('loadTasks: Starting fetch', { selectedCategory, searchQuery: searchQuery.trim() || undefined })
      
      // Always fetch assigned tasks
      logger.info('loadTasks: Dispatching fetchAssignedTasks')
      const assignedPromise = dispatch(fetchAssignedTasks())
      
      // Fetch tasks based on selected category
      let tasksPromise
      const search = searchQuery.trim() || undefined
      
      logger.info('loadTasks: Dispatching task fetch for category', { selectedCategory, search })
      switch (selectedCategory) {
        case 'today':
          tasksPromise = dispatch(fetchTodayTasks(search))
          break
        case 'flagged':
          tasksPromise = dispatch(fetchFlaggedTasks(search))
          break
        case 'scheduled':
          tasksPromise = dispatch(fetchScheduledTasks(search))
          break
        case 'completed':
          tasksPromise = dispatch(fetchCompletedTasks(search))
          break
        case 'missed':
          tasksPromise = dispatch(fetchMissedTasks(search))
          break
        case 'all':
        default:
          // Fetch all tasks (no status filter)
          tasksPromise = dispatch(fetchTasks({ all: true, search }))
          break
      }
      
      logger.info('loadTasks: Waiting for promises to resolve')
      // Fetch both in parallel but they're queued internally
      const results = await Promise.all([tasksPromise, assignedPromise])
      logger.info('loadTasks: Promises resolved', { 
        tasksResult: results[0], 
        assignedResult: results[1],
        tasksType: results[0]?.type,
        assignedType: results[1]?.type
      })
      
      // Mark that initial load has completed
      hasInitialLoadRef.current = true
      logger.info('loadTasks: Fetch completed successfully')
    } catch (error) {
      logger.error('Failed to load tasks:', error)
      // Reset loading flag on error so we can retry
      loadingTasksRef.current = false
    } finally {
      // Only reset if we're not still processing
      // The loading flag will be reset after a short delay to allow for async operations
      setTimeout(() => {
        loadingTasksRef.current = false
      }, 100)
    }
  }, [user?.id, dispatch, rateLimited, selectedCategory, searchQuery])

  // Debounced version of loadTasks
  const debouncedLoadTasks = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      loadTasks()
    }, 300)
  }, [loadTasks])

  const loadFriends = useCallback(async () => {
    if (!user?.id) return
    if (loadingFriendsRef.current) return
    
    // Clear any pending debounced calls
    if (friendsDebounceRef.current) {
      clearTimeout(friendsDebounceRef.current)
      friendsDebounceRef.current = null
    }
    
    loadingFriendsRef.current = true
    try {
      const friendsList = await friendService.getFriends()
      setFriends(friendsList.map(f => ({ id: f.id, name: f.name, email: f.email })))
    } catch (error) {
      logger.error('Failed to load friends:', error)
      const errorMessage = getErrorMessage(error)
      if (isRateLimitError(error)) {
        // Don't show toast for rate limit on initial load, will retry on next action
      } else {
        toastService.error(errorMessage || 'Failed to load friends')
      }
    } finally {
      loadingFriendsRef.current = false
    }
  }, [user?.id])

  // Reset initial load flag when user changes
  useEffect(() => {
    if (user?.id !== lastUserIdRef.current) {
      logger.info('User changed, resetting initial load flag', { 
        oldUserId: lastUserIdRef.current, 
        newUserId: user?.id 
      })
      hasInitialLoadRef.current = false
      lastUserIdRef.current = user?.id
    }
  }, [user?.id])

  // Load tasks when user, category, or search changes
  useEffect(() => {
    // Wait for auth to finish loading before attempting to load tasks
    if (authLoading) {
      logger.info('useEffect: Auth still loading, waiting...')
      return
    }
    
    // Only proceed if user is available and authenticated
    if (!isAuthenticated || !user?.id) {
      logger.warn('useEffect: User not authenticated or ID not available', { 
        isAuthenticated, 
        hasUser: !!user, 
        userId: user?.id 
      })
      return
    }
    
    logger.info('useEffect: Triggering task load', { 
      userId: user.id, 
      selectedCategory, 
      searchQuery,
      hasInitialLoad: hasInitialLoadRef.current 
    })
    
    // Load tasks immediately (throttling is handled inside loadTasks)
    // Use the latest version of loadTasks by calling it directly
    loadTasks()
    
    // Delay friends loading slightly to avoid simultaneous requests
    const friendsTimer = setTimeout(() => {
      loadFriends()
    }, 200)
    
    return () => {
      clearTimeout(friendsTimer)
      if (friendsDebounceRef.current) {
        clearTimeout(friendsDebounceRef.current)
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
    // Use direct dependencies instead of callback functions to avoid unnecessary re-renders
    // The loadTasks and loadFriends functions will be recreated when their dependencies change,
    // and since we're calling them directly, we'll get the latest version
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading, user?.id, selectedCategory, searchQuery])

  // Update undo/redo availability
  const updateHistoryState = useCallback(() => {
    setCanUndo(historyIndex.current >= 0);
    setCanRedo(historyIndex.current < operationHistory.current.length - 1);
  }, []);

  // Add operation to history
  const addToHistory = useCallback((
    type: 'create' | 'update' | 'delete' | 'status',
    task: Task,
    previousState: Task | undefined,
    reverse: () => Promise<void>
  ) => {
    // Remove any future history if we're not at the end
    operationHistory.current = operationHistory.current.slice(0, historyIndex.current + 1);
    operationHistory.current.push({ type, task, previousState, reverse });
    historyIndex.current = operationHistory.current.length - 1;
    // Keep history size manageable
    if (operationHistory.current.length > 20) {
      operationHistory.current.shift();
      historyIndex.current--;
    }
    updateHistoryState();
  }, [updateHistoryState]);

  // Undo last operation
  const handleUndo = useCallback(async () => {
    if (historyIndex.current < 0) {
      externalUndo?.();
      return;
    }
    
    const entry = operationHistory.current[historyIndex.current];
    try {
      await entry.reverse();
      historyIndex.current--;
      updateHistoryState();
      debouncedLoadTasks();
      toastService.success('Undone');
    } catch (error) {
      logger.error('Failed to undo:', error);
      const errorMessage = getErrorMessage(error);
      if (isRateLimitError(error)) {
        toastService.error('Too many requests. Please wait a moment and try again.');
      } else {
        toastService.error(errorMessage || 'Failed to undo operation');
      }
    }
  }, [debouncedLoadTasks, updateHistoryState, externalUndo]);

  // Redo last undone operation
  const handleRedo = useCallback(async () => {
    if (historyIndex.current >= operationHistory.current.length - 1) {
      externalRedo?.();
      return;
    }
    
    historyIndex.current++;
    const entry = operationHistory.current[historyIndex.current];
    try {
      // Re-apply the operation
      if (entry.type === 'create') {
        const createdTask = await taskService.createTask({
          title: entry.task.title,
          description: entry.task.description,
          dueDate: entry.task.dueDate,
          priority: entry.task.priority,
          status: entry.task.status,
        });
        // Update the entry with the new task ID if it changed
        entry.task = createdTask;
      } else if (entry.type === 'update') {
        // Check if task still exists before updating
        const existingTask = [...myTasks, ...assignedTasks].find(t => t.id === entry.task.id);
        if (!existingTask) {
          throw new Error('Task not found');
        }
        await taskService.updateTask(entry.task.id, {
          title: entry.task.title,
          description: entry.task.description,
          dueDate: entry.task.dueDate,
          priority: entry.task.priority,
          status: entry.task.status,
        });
      } else if (entry.type === 'delete') {
        // Check if task exists before deleting
        const existingTask = [...myTasks, ...assignedTasks].find(t => t.id === entry.task.id);
        if (!existingTask) {
          throw new Error('Task not found');
        }
        await taskService.deleteTask(entry.task.id);
      } else if (entry.type === 'status') {
        // Check if task still exists before updating status
        const existingTask = [...myTasks, ...assignedTasks].find(t => t.id === entry.task.id);
        if (!existingTask) {
          throw new Error('Task not found');
        }
        await taskService.updateTask(entry.task.id, { status: entry.task.status });
      }
      updateHistoryState();
      debouncedLoadTasks();
      toastService.success('Redone');
    } catch (error) {
      logger.error('Failed to redo:', error);
      const errorMessage = getErrorMessage(error);
      if (isRateLimitError(error)) {
        toastService.error('Too many requests. Please wait a moment and try again.');
      } else {
        toastService.error(errorMessage || 'Failed to redo operation');
      }
      historyIndex.current--;
      updateHistoryState();
    }
  }, [debouncedLoadTasks, updateHistoryState, externalRedo, myTasks, assignedTasks]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) handleUndo();
      } else if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (canRedo) handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, handleUndo, handleRedo]);


  // Handle status change from dropdown
  const handleStatusChange = useCallback(async (taskId: string, newStatus: Task['status']) => {
    if (!user?.id) return
    
    const task = [...myTasks, ...assignedTasks].find(t => t.id === taskId)
    if (!task) return
    
    // Optimistic update
    const previousState: Task = { ...task }
    const updatedTask: Task = { ...task, status: newStatus }
    
    // Use Redux optimistic update
    dispatch(optimisticUpdateStatus({ id: taskId, status: newStatus }))
    
    try {
      await dispatch(updateTaskThunk({ id: taskId, data: { status: newStatus } })).unwrap()
      
      // Add to history for undo
      addToHistory('status', updatedTask, previousState, async () => {
        await dispatch(updateTaskThunk({ id: taskId, data: { status: task.status } })).unwrap()
      })
      
      // Debounced refresh instead of immediate
      debouncedLoadTasks()
    } catch (error) {
      // Revert optimistic update on error
      dispatch(revertOptimisticUpdate({ id: taskId, previousTask: previousState }))
      
      logger.error('Failed to update task status:', error)
      const errorMessage = getErrorMessage(error)
      if (isRateLimitError(error)) {
        toastService.error('Too many requests. Please wait a moment and try again.')
      } else {
        toastService.error(errorMessage || 'Failed to update task status')
      }
    }
  }, [user?.id, myTasks, assignedTasks, dispatch, addToHistory, debouncedLoadTasks])

  const toggleTaskFlag = useCallback(async (taskId: string, currentFlagged: boolean) => {
    if (!user?.id) return
    
    // Find the task to get full details
    const task = [...myTasks, ...assignedTasks].find(t => t.id === taskId);
    if (!task) return;
    
    const newFlagged = !currentFlagged
    
    try {
      await dispatch(updateTaskThunk({ id: taskId, data: { flagged: newFlagged } })).unwrap();
      
      toastService.success(newFlagged ? 'Task flagged!' : 'Task unflagged');
      
      // Debounced refresh instead of immediate
      debouncedLoadTasks();
      // Refresh stats after flag change
      refreshStats();
    } catch (error) {
      logger.error('Failed to update task flag:', error);
      const errorMessage = getErrorMessage(error);
      if (isRateLimitError(error)) {
        toastService.error('Too many requests. Please wait a moment and try again.');
      } else {
        toastService.error(errorMessage || 'Failed to update task flag');
      }
    }
  }, [user?.id, myTasks, assignedTasks, dispatch, debouncedLoadTasks, refreshStats])

  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user?.id) return
    try {
      const createdTask = await dispatch(createTaskThunk({
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        status: taskData.status,
      })).unwrap();
      
      // Add to history for undo
      addToHistory('create', createdTask, undefined, async () => {
        await dispatch(deleteTaskThunk(createdTask.id)).unwrap();
      });
      
      setIsCreateModalOpen(false);
      // Refresh tasks after a short delay
      setTimeout(() => {
        loadTasks();
        refreshStats();
      }, 300);
    } catch (error) {
      logger.error('Failed to create task:', error);
      // Error is already handled by Redux slice
      throw error;
    }
  }, [user?.id, dispatch, addToHistory, loadTasks, refreshStats])

  const deleteTask = useCallback(async () => {
    if (!user?.id || !taskToDelete) return
    try {
      const taskToDeleteCopy = { ...taskToDelete };
      
      // Add to history for undo
      addToHistory('delete', taskToDeleteCopy, undefined, async () => {
        await dispatch(createTaskThunk({
          title: taskToDeleteCopy.title,
          description: taskToDeleteCopy.description,
          dueDate: taskToDeleteCopy.dueDate,
          priority: taskToDeleteCopy.priority,
          status: taskToDeleteCopy.status,
        })).unwrap();
      });
      
      await dispatch(deleteTaskThunk(taskToDelete.id)).unwrap();
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
      setSelectedTaskId(null);
      // Refresh tasks after a short delay
      setTimeout(() => {
        loadTasks();
        refreshStats();
      }, 300);
    } catch (error) {
      logger.error('Failed to delete task:', error);
      // Error is already handled by Redux slice
      throw error;
    }
  }, [user?.id, taskToDelete, dispatch, loadTasks, addToHistory, refreshStats])

  const handleEditTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!taskToEdit || !user?.id) return
    try {
      const previousState = { ...taskToEdit };
      const updatedTask = await dispatch(updateTaskThunk({
        id: taskToEdit.id,
        data: {
          title: taskData.title,
          description: taskData.description,
          dueDate: taskData.dueDate,
          priority: taskData.priority,
          status: taskData.status,
        },
      })).unwrap();
      
      // Add to history for undo
      addToHistory('update', updatedTask.task, previousState, async () => {
        await dispatch(updateTaskThunk({
          id: taskToEdit.id,
          data: {
            title: previousState.title,
            description: previousState.description,
            dueDate: previousState.dueDate,
            priority: previousState.priority,
            status: previousState.status,
          },
        })).unwrap();
      });
      
      setIsEditModalOpen(false);
      setTaskToEdit(null);
      setSelectedTaskId(null);
      // Refresh tasks after a short delay
      setTimeout(() => {
        loadTasks();
        refreshStats();
      }, 300);
    } catch (error) {
      logger.error('Failed to update task:', error);
      // Error is already handled by Redux slice
      throw error;
    }
  }, [taskToEdit, user?.id, dispatch, loadTasks, addToHistory, refreshStats])

  const handleAssignTask = useCallback(async (friendId: string, friendEmail: string) => {
    if (!taskToAssign || !user?.id) return
    try {
      await dispatch(assignTaskToFriendThunk({ taskId: taskToAssign.id, friendId })).unwrap()
      const friendName = friends.find(f => f.id === friendId)?.name || friendEmail.split('@')[0]
      toastService.success(`Task assigned to ${friendName}!`)
      setIsAssignModalOpen(false)
      setTaskToAssign(null)
      setSelectedTaskId(null)
      // Refresh tasks after a short delay
      setTimeout(() => {
        loadTasks();
        refreshStats();
      }, 300);
    } catch (error) {
      logger.error('Failed to assign task:', error)
      // Error is already handled by Redux slice
      throw error
    }
  }, [taskToAssign, user?.id, dispatch, loadTasks, friends, refreshStats])

  const clearMyCompletedTasks = async () => {
    if (!user?.id) return
    
    try {
      const completedTasks = myTasks.filter(t => t.status === 'completed')
      for (const task of completedTasks) {
        await taskService.deleteTask(task.id)
      }
      await loadTasks()
      toastService.success('Completed tasks cleared!')
    } catch (error) {
      logger.error('Failed to clear completed tasks:', error)
      toastService.error('Failed to clear completed tasks')
    }
  }

  // Filter tasks based on category and search
  // Note: today, flagged, scheduled, and all are already filtered by the server
  // We only need client-side filtering for categories without dedicated endpoints
  const filterTasks = useCallback((tasks: Task[]) => {
    let filtered = tasks

    // Filter by category (only for categories without dedicated server endpoints)
    if (selectedCategory) {
      const today = new Date().toISOString().split('T')[0]
      switch (selectedCategory) {
        case 'all':
          // Exclude completed tasks from "all" section
          filtered = filtered.filter((t) => t.status !== 'completed')
          break
        case 'today':
        case 'flagged':
        case 'scheduled':
          // These are already filtered by the server, but also exclude completed
          filtered = filtered.filter((t) => t.status !== 'completed')
          break
        case 'completed':
          filtered = filtered.filter((t) => t.status === 'completed')
          break
        case 'missed':
          filtered = filtered.filter(
            (t) => t.dueDate && t.dueDate < today && t.status !== 'completed'
          )
          break
        case 'friends':
          filtered = filtered.filter((t) => !!t.assignedBy)
          break
      }
    }

    // Search is already handled by the server for today, flagged, scheduled, and all
    // Only apply client-side search for other categories
    if (searchQuery.trim() && selectedCategory && !['all', 'today', 'flagged', 'scheduled'].includes(selectedCategory)) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [selectedCategory, searchQuery])

  // Bulk operations removed - not responsive and not good UX

  // Use task counts from context (from API stats) instead of calculating
  // No need to update parent - stats are managed in layout

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
  
  // For completed page, limit to top 3 initially unless "Show All" is clicked
  const isCompletedPage = selectedCategory === 'completed'
  const myCompletedTasksToShow = isCompletedPage && !showAllCompleted 
    ? myCompletedTasks.slice(0, 3) 
    : myCompletedTasks
  
  const assignedCompletedTasksToShow = isCompletedPage && !showAllAssignedCompleted 
    ? assignedCompletedTasks.slice(0, 3) 
    : assignedCompletedTasks
  
  // When on completed page, show only completed tasks (limited or all based on state)
  const myTasksToDisplay = isCompletedPage 
    ? myCompletedTasksToShow 
    : (showCompletedTasks ? myDisplayTasks : myIncompleteTasks)
  
  const assignedTasksToDisplay = isCompletedPage 
    ? assignedCompletedTasksToShow 
    : (showAssignedCompletedTasks ? assignedDisplayTasks : assignedIncompleteTasks)

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8 space-y-4 sm:space-y-6 md:space-y-8">
          <div>
            <div className="h-8 bg-muted-foreground/20 dark:bg-text-mutedDark/20 rounded w-48 mb-4 animate-pulse" />
            <TaskSkeleton />
          </div>
          <div>
            <div className="h-6 bg-muted-foreground/20 dark:bg-text-mutedDark/20 rounded w-40 mb-4 animate-pulse" />
            <TaskSkeleton />
          </div>
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

    // Status options for dropdown
    const statusOptions: Array<{ value: Task['status']; label: string }> = [
      { value: 'todo', label: 'To Do' },
      { value: 'active', label: 'Active' },
      { value: 'completed', label: 'Done' },
    ]

    return (
      <div className="space-y-0 w-full">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => {
              setSelectedTaskId(selectedTaskId === task.id ? null : task.id)
            }}
            className={`group flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 cursor-pointer transition-all relative rounded ${
              selectedTaskId === task.id
                ? 'bg-primary/20 dark:bg-primary/30 border-l-4 border-primary shadow-sm'
                : 'hover:bg-background-overlayDark/50 dark:hover:bg-background-overlayDark/30 border-l-4 border-transparent'
            } ${task.status === 'completed' ? 'opacity-75' : ''}`}
          >
            
            {/* Status Dropdown */}
            <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
              <select
                value={task.status}
                onChange={(e) => {
                  e.stopPropagation()
                  const newStatus = e.target.value as Task['status']
                  handleStatusChange(task.id, newStatus)
                }}
                className="appearance-none bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-md px-2 py-1 text-xs sm:text-sm text-foreground dark:text-foreground cursor-pointer hover:bg-background-overlayDark dark:hover:bg-background-overlayDark transition-colors focus:outline-none focus:ring-2 focus:ring-primary pr-6 min-w-[80px]"
                onClick={(e) => e.stopPropagation()}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground dark:text-text-mutedDark pointer-events-none" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-2 min-w-0">
                {task.dueDate && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 dark:border-blue-400/20 shrink-0">
                    <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 font-semibold">
                      {formatTaskDate(task.dueDate)}
                    </span>
                  </div>
                )}
                <span className="text-foreground dark:text-text-primaryDark text-xs sm:text-sm font-medium min-w-0 truncate">
                  {task.title}
                  {sectionType === 'assigned' && task.assignedByEmail && (
                    <span className="text-[10px] sm:text-xs text-muted-foreground dark:text-text-mutedDark ml-1 sm:ml-2 font-normal">
                      (from {task.assignedByEmail.split('@')[0]})
                    </span>
                  )}
                </span>
              </div>
              {task.description && (
                <span className="text-[10px] sm:text-xs text-muted-foreground/80 dark:text-text-mutedDark/70 italic truncate pl-0.5">
                  {task.description}
                </span>
              )}
            </div>
            
            {/* Hover buttons - always show on hover, or when selected */}
            <div className={`flex items-center gap-1 sm:gap-1.5 shrink-0 transition-opacity ${
              selectedTaskId === task.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
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
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center justify-center transition-colors shadow-md"
                  aria-label="Task info"
                  title="Info"
                >
                  <Info className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
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
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 flex items-center justify-center transition-colors shadow-md"
                aria-label="Edit task"
                title="Edit"
              >
                <Edit2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleTaskFlag(task.id, task.flagged)
                }}
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-colors shadow-md ${
                  task.flagged
                    ? 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600'
                    : 'bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600'
                }`}
                aria-label={task.flagged ? 'Unflag task' : 'Flag task'}
                title={task.flagged ? 'Unflag' : 'Flag'}
              >
                <Flag className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${task.flagged ? 'text-white fill-white' : 'text-white'}`} />
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
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 flex items-center justify-center transition-colors shadow-md"
                aria-label="Delete task"
                title="Delete"
              >
                <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
              </button>
            </div>
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
              {/* Active Filter Indicator */}
              {selectedCategory && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 rounded-lg mr-2 sm:mr-4">
                  <Filter className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs sm:text-sm font-medium text-primary capitalize">
                    {selectedCategory === 'all' ? 'All Tasks' : selectedCategory}
                  </span>
                  <span className="text-xs text-muted-foreground dark:text-text-mutedDark">
                    ({myIncompleteTasks.length + myCompletedTasks.length})
                  </span>
                </div>
              )}

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
                <button
                  onClick={handleUndo}
                  disabled={!canUndo}
                  className={`p-1.5 sm:p-2 bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg transition-colors shrink-0 ${
                    canUndo
                      ? 'hover:bg-background-overlayDark dark:hover:bg-background-overlayDark cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  aria-label="Undo"
                  title={canUndo ? 'Undo (Ctrl+Z)' : 'Nothing to undo'}
                >
                  <Undo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-foreground dark:text-foreground" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={!canRedo}
                  className={`p-1.5 sm:p-2 bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg transition-colors shrink-0 ${
                    canRedo
                      ? 'hover:bg-background-overlayDark dark:hover:bg-background-overlayDark cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  aria-label="Redo"
                  title={canRedo ? 'Redo (Ctrl+Y or Ctrl+Shift+Z)' : 'Nothing to redo'}
                >
                  <Redo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-foreground dark:text-foreground" />
                </button>
              </div>

              {/* Show All Toggle */}
              <button
                onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                className="flex flex-col items-end gap-1 px-3 py-2 rounded-lg border border-border dark:border-border-darkMode hover:bg-background-overlayDark dark:hover:bg-background-overlayDark transition-all group shrink-0"
                title={showCompletedTasks ? 'Hide completed tasks' : 'Show completed tasks'}
              >
                <div className="flex items-center gap-2">
                  {showCompletedTasks ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground dark:text-text-mutedDark group-hover:text-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground dark:text-text-mutedDark group-hover:text-foreground" />
                  )}
                  <div className="text-brand-primary dark:text-brand-primary text-base sm:text-lg md:text-xl font-bold">
                    {showCompletedTasks ? myDisplayTasks.length : myIncompleteTasks.length}
                  </div>
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground dark:text-text-mutedDark group-hover:text-foreground transition-colors">
                  {showCompletedTasks ? 'Showing All' : 'Show All'}
                </div>
                {myCompletedTasks.length > 0 && (
                  <div className="text-[9px] text-muted-foreground dark:text-text-mutedDark">
                    {myCompletedTasks.length} completed
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Completed Tasks Section - Only show when not on completed page */}
          {!isCompletedPage && showCompletedTasks && myCompletedTasks.length > 0 && (
            <div className="mb-4 flex items-center justify-between px-3 py-2 bg-background-cardDark/50 dark:bg-background-cardDark/30 border border-border dark:border-border-darkMode rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-foreground dark:text-text-primaryDark">
                  {myCompletedTasks.length} Completed Task{myCompletedTasks.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={clearMyCompletedTasks}
                className="px-3 py-1 text-xs sm:text-sm bg-red-500/10 hover:bg-red-500/20 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-red-500 rounded-md transition-colors font-medium"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Show All button for completed page */}
          {isCompletedPage && myCompletedTasks.length > 3 && (
            <div className="mb-4 flex items-center justify-center">
              <button
                onClick={() => setShowAllCompleted(!showAllCompleted)}
                className="px-4 py-2 text-sm font-medium text-brand-primary dark:text-brand-primary hover:bg-brand-primary/10 dark:hover:bg-brand-primary/20 rounded-lg border border-brand-primary/30 dark:border-brand-primary/30 transition-colors"
              >
                {showAllCompleted ? 'Show Less' : `Show All (${myCompletedTasks.length})`}
              </button>
            </div>
          )}

          {/* Task List */}
          {renderTaskList(myTasksToDisplay, 'my')}
        </div>

        {/* Friends Assigned Tasks Section */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4 gap-2 sm:gap-4">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-brand-primary dark:text-brand-primary min-w-0 flex-1">Friends Assigned Tasks</h2>
            {/* Show All Toggle */}
            <button
              onClick={() => setShowAssignedCompletedTasks(!showAssignedCompletedTasks)}
              className="flex flex-col items-end gap-1 px-3 py-2 rounded-lg border border-border dark:border-border-darkMode hover:bg-background-overlayDark dark:hover:bg-background-overlayDark transition-all group shrink-0"
              title={showAssignedCompletedTasks ? 'Hide completed tasks' : 'Show completed tasks'}
            >
              <div className="flex items-center gap-2">
                {showAssignedCompletedTasks ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground dark:text-text-mutedDark group-hover:text-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground dark:text-text-mutedDark group-hover:text-foreground" />
                )}
                <div className="text-brand-primary dark:text-brand-primary text-base sm:text-lg md:text-xl font-bold">
                  {showAssignedCompletedTasks ? assignedDisplayTasks.length : assignedIncompleteTasks.length}
                </div>
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground dark:text-text-mutedDark group-hover:text-foreground transition-colors">
                {showAssignedCompletedTasks ? 'Showing All' : 'Show All'}
              </div>
              {assignedCompletedTasks.length > 0 && (
                <div className="text-[9px] text-muted-foreground dark:text-text-mutedDark">
                  {assignedCompletedTasks.length} completed
                </div>
              )}
            </button>
          </div>

          {/* Completed Tasks Section - Only show when not on completed page */}
          {!isCompletedPage && showAssignedCompletedTasks && assignedCompletedTasks.length > 0 && (
            <div className="mb-4 flex items-center justify-between px-3 py-2 bg-background-cardDark/50 dark:bg-background-cardDark/30 border border-border dark:border-border-darkMode rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-foreground dark:text-text-primaryDark">
                  {assignedCompletedTasks.length} Completed Task{assignedCompletedTasks.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Show All button for completed page */}
          {isCompletedPage && assignedCompletedTasks.length > 3 && (
            <div className="mb-4 flex items-center justify-center">
              <button
                onClick={() => setShowAllAssignedCompleted(!showAllAssignedCompleted)}
                className="px-4 py-2 text-sm font-medium text-brand-primary dark:text-brand-primary hover:bg-brand-primary/10 dark:hover:bg-brand-primary/20 rounded-lg border border-brand-primary/30 dark:border-brand-primary/30 transition-colors"
              >
                {showAllAssignedCompleted ? 'Show Less' : `Show All (${assignedCompletedTasks.length})`}
              </button>
            </div>
          )}

          {/* Task List */}
          {renderTaskList(assignedTasksToDisplay, 'assigned')}
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

