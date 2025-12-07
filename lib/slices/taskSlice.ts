'use client'

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { taskService } from '@/lib/api/taskService'
import type { Task } from '@/lib/interface/task'
import { getErrorMessage, isRateLimitError } from '@/lib/utils/errorHandler'
import { toastService } from '@/lib/utils/toast'

// Task filters interface
export interface TaskFilters {
  status?: 'todo' | 'active' | 'completed'
  search?: string
  priority?: 'low' | 'medium' | 'high'
  flagged?: boolean
  all?: boolean
}

// Async thunks - using real API (simplified like authSlice)
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (filters: TaskFilters | undefined, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getTasks(filters)
      return tasks
    } catch (error) {
      if (isRateLimitError(error)) {
        return rejectWithValue({ message: 'Too many requests. Please wait a moment.', rateLimited: true })
      }
      return rejectWithValue({ message: getErrorMessage(error) || 'Failed to fetch tasks' })
    }
  }
)

export const fetchAssignedTasks = createAsyncThunk(
  'tasks/fetchAssignedTasks',
  async (_, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getAssignedTasks()
      return tasks
    } catch (error) {
      if (isRateLimitError(error)) {
        return rejectWithValue({ message: 'Too many requests. Please wait a moment.', rateLimited: true })
      }
      return rejectWithValue({ message: getErrorMessage(error) || 'Failed to fetch assigned tasks' })
    }
  }
)

export const fetchTodayTasks = createAsyncThunk(
  'tasks/fetchTodayTasks',
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getTodayTasks(search)
      return tasks
    } catch (error) {
      if (isRateLimitError(error)) {
        return rejectWithValue({ message: 'Too many requests. Please wait a moment.', rateLimited: true })
      }
      return rejectWithValue({ message: getErrorMessage(error) || 'Failed to fetch today tasks' })
    }
  }
)

export const fetchFlaggedTasks = createAsyncThunk(
  'tasks/fetchFlaggedTasks',
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getFlaggedTasks(search)
      return tasks
    } catch (error) {
      if (isRateLimitError(error)) {
        return rejectWithValue({ message: 'Too many requests. Please wait a moment.', rateLimited: true })
      }
      return rejectWithValue({ message: getErrorMessage(error) || 'Failed to fetch flagged tasks' })
    }
  }
)

export const fetchScheduledTasks = createAsyncThunk(
  'tasks/fetchScheduledTasks',
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getScheduledTasks(search)
      return tasks
    } catch (error) {
      if (isRateLimitError(error)) {
        return rejectWithValue({ message: 'Too many requests. Please wait a moment.', rateLimited: true })
      }
      return rejectWithValue({ message: getErrorMessage(error) || 'Failed to fetch scheduled tasks' })
    }
  }
)

export const fetchCompletedTasks = createAsyncThunk(
  'tasks/fetchCompletedTasks',
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getCompletedTasks(search)
      return tasks
    } catch (error) {
      if (isRateLimitError(error)) {
        return rejectWithValue({ message: 'Too many requests. Please wait a moment.', rateLimited: true })
      }
      return rejectWithValue({ message: getErrorMessage(error) || 'Failed to fetch completed tasks' })
    }
  }
)

export const fetchSearchTasks = createAsyncThunk(
  'tasks/fetchSearchTasks',
  async (query: string, { rejectWithValue }) => {
    try {
      const tasks = await taskService.searchAllTasks(query)
      return tasks
    } catch (error) {
      if (isRateLimitError(error)) {
        return rejectWithValue({ message: 'Too many requests. Please wait a moment.', rateLimited: true })
      }
      return rejectWithValue({ message: getErrorMessage(error) || 'Failed to search tasks' })
    }
  }
)

export const fetchMissedTasks = createAsyncThunk(
  'tasks/fetchMissedTasks',
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getMissedTasks(search)
      return tasks
    } catch (error) {
      if (isRateLimitError(error)) {
        return rejectWithValue({ message: 'Too many requests. Please wait a moment.', rateLimited: true })
      }
      return rejectWithValue({ message: getErrorMessage(error) || 'Failed to fetch missed tasks' })
    }
  }
)

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Parameters<typeof taskService.createTask>[0], { rejectWithValue }) => {
    try {
      const task = await taskService.createTask(taskData)
      return task
    } catch (error) {
      if (isRateLimitError(error)) {
        return rejectWithValue({ message: 'Too many requests. Please wait a moment.', rateLimited: true })
      }
      return rejectWithValue({ message: getErrorMessage(error) || 'Failed to create task' })
    }
  }
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (
    { id, data }: { id: string; data: Parameters<typeof taskService.updateTask>[1] },
    { rejectWithValue, getState }
  ) => {
    try {
      // Get current task for optimistic update
      const state = getState() as { tasks: TaskState }
      const currentTask = state.tasks.myTasks.find(t => t.id === id) || 
                         state.tasks.assignedTasks.find(t => t.id === id)
      
      // Optimistic update - update local state immediately
      const updatedTask = currentTask ? { ...currentTask, ...data } : null

      const task = await taskService.updateTask(id, data)
      return { task, optimisticTask: updatedTask }
    } catch (error) {
      if (isRateLimitError(error)) {
        return rejectWithValue({ message: 'Too many requests. Please wait a moment.', rateLimited: true })
      }
      return rejectWithValue({ message: getErrorMessage(error) || 'Failed to update task' })
    }
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id)
      return id
    } catch (error) {
      if (isRateLimitError(error)) {
        return rejectWithValue({ message: 'Too many requests. Please wait a moment.', rateLimited: true })
      }
      return rejectWithValue({ message: getErrorMessage(error) || 'Failed to delete task' })
    }
  }
)

export const assignTaskToFriend = createAsyncThunk(
  'tasks/assignTaskToFriend',
  async (
    { taskId, friendId }: { taskId: string; friendId: string },
    { rejectWithValue }
  ) => {
    try {
      const task = await taskService.assignTaskToFriend(taskId, friendId)
      return task
    } catch (error) {
      if (isRateLimitError(error)) {
        return rejectWithValue({ message: 'Too many requests. Please wait a moment.', rateLimited: true })
      }
      return rejectWithValue({ message: getErrorMessage(error) || 'Failed to assign task' })
    }
  }
)

interface TaskState {
  myTasks: Task[]
  assignedTasks: Task[]
  loading: boolean
  error: string | null
  rateLimited: boolean
  lastFetchTime: number | null
  // Operation-specific loading states
  creating: boolean
  updating: string[] // Array of task IDs being updated
  deleting: string[] // Array of task IDs being deleted
}

const initialState: TaskState = {
  myTasks: [],
  assignedTasks: [],
  loading: false,
  error: null,
  rateLimited: false,
  lastFetchTime: null,
  creating: false,
  updating: [],
  deleting: [],
}

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.rateLimited = false
    },
    clearRateLimit: (state) => {
      state.rateLimited = false
    },
    // Optimistic update for status toggle
    optimisticUpdateStatus: (state, action: PayloadAction<{ id: string; status: Task['status'] }>) => {
      const { id, status } = action.payload
      const task = state.myTasks.find(t => t.id === id) || state.assignedTasks.find(t => t.id === id)
      if (task) {
        task.status = status
      }
    },
    // Revert optimistic update
    revertOptimisticUpdate: (state, action: PayloadAction<{ id: string; previousTask: Task }>) => {
      const { id, previousTask } = action.payload
      const taskIndex = state.myTasks.findIndex(t => t.id === id)
      if (taskIndex !== -1) {
        state.myTasks[taskIndex] = previousTask
      } else {
        const assignedIndex = state.assignedTasks.findIndex(t => t.id === id)
        if (assignedIndex !== -1) {
          state.assignedTasks[assignedIndex] = previousTask
        }
      }
    },
    // Clear all tasks (on logout)
    clearTasks: (state) => {
      state.myTasks = []
      state.assignedTasks = []
      state.error = null
      state.rateLimited = false
      state.lastFetchTime = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
        state.rateLimited = false
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.myTasks = action.payload
        state.lastFetchTime = Date.now()
        state.error = null
        state.rateLimited = false
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        const error = action.payload as { message: string; rateLimited?: boolean } | undefined
        state.error = error?.message || 'Failed to fetch tasks'
        const wasRateLimited = state.rateLimited
        state.rateLimited = error?.rateLimited || false
        // Only show toast if we weren't already rate limited (to prevent duplicate toasts)
        if (state.rateLimited && !wasRateLimited) {
          toastService.error('Too many requests. Please wait a moment and try again.')
        }
      })
      // Fetch assigned tasks
      .addCase(fetchAssignedTasks.pending, (state) => {
        // Don't set loading to true if we're already loading my tasks
        if (!state.loading) {
          state.loading = true
        }
        state.error = null
        state.rateLimited = false
      })
      .addCase(fetchAssignedTasks.fulfilled, (state, action) => {
        state.loading = false
        state.assignedTasks = action.payload
        state.lastFetchTime = Date.now()
        state.error = null
        state.rateLimited = false
      })
      .addCase(fetchAssignedTasks.rejected, (state, action) => {
        state.loading = false
        const error = action.payload as { message: string; rateLimited?: boolean } | undefined
        state.error = error?.message || 'Failed to fetch assigned tasks'
        const wasRateLimited = state.rateLimited
        state.rateLimited = error?.rateLimited || false
        // Only show toast if we weren't already rate limited (to prevent duplicate toasts)
        if (state.rateLimited && !wasRateLimited) {
          toastService.error('Too many requests. Please wait a moment and try again.')
        }
      })
      // Fetch today tasks
      .addCase(fetchTodayTasks.pending, (state) => {
        state.loading = true
        state.error = null
        state.rateLimited = false
      })
      .addCase(fetchTodayTasks.fulfilled, (state, action) => {
        state.loading = false
        state.myTasks = action.payload
        state.lastFetchTime = Date.now()
        state.error = null
        state.rateLimited = false
      })
      .addCase(fetchTodayTasks.rejected, (state, action) => {
        state.loading = false
        const error = action.payload as { message: string; rateLimited?: boolean } | undefined
        state.error = error?.message || 'Failed to fetch today tasks'
        const wasRateLimited = state.rateLimited
        state.rateLimited = error?.rateLimited || false
        if (state.rateLimited && !wasRateLimited) {
          toastService.error('Too many requests. Please wait a moment and try again.')
        }
      })
      // Fetch flagged tasks
      .addCase(fetchFlaggedTasks.pending, (state) => {
        state.loading = true
        state.error = null
        state.rateLimited = false
      })
      .addCase(fetchFlaggedTasks.fulfilled, (state, action) => {
        state.loading = false
        state.myTasks = action.payload
        state.lastFetchTime = Date.now()
        state.error = null
        state.rateLimited = false
      })
      .addCase(fetchFlaggedTasks.rejected, (state, action) => {
        state.loading = false
        const error = action.payload as { message: string; rateLimited?: boolean } | undefined
        state.error = error?.message || 'Failed to fetch flagged tasks'
        const wasRateLimited = state.rateLimited
        state.rateLimited = error?.rateLimited || false
        if (state.rateLimited && !wasRateLimited) {
          toastService.error('Too many requests. Please wait a moment and try again.')
        }
      })
      // Fetch scheduled tasks
      .addCase(fetchScheduledTasks.pending, (state) => {
        state.loading = true
        state.error = null
        state.rateLimited = false
      })
      .addCase(fetchScheduledTasks.fulfilled, (state, action) => {
        state.loading = false
        state.myTasks = action.payload
        state.lastFetchTime = Date.now()
        state.error = null
        state.rateLimited = false
      })
      .addCase(fetchScheduledTasks.rejected, (state, action) => {
        state.loading = false
        const error = action.payload as { message: string; rateLimited?: boolean } | undefined
        state.error = error?.message || 'Failed to fetch scheduled tasks'
        const wasRateLimited = state.rateLimited
        state.rateLimited = error?.rateLimited || false
        if (state.rateLimited && !wasRateLimited) {
          toastService.error('Too many requests. Please wait a moment and try again.')
        }
      })
      // Fetch completed tasks
      .addCase(fetchCompletedTasks.pending, (state) => {
        state.loading = true
        state.error = null
        state.rateLimited = false
      })
      .addCase(fetchCompletedTasks.fulfilled, (state, action) => {
        state.loading = false
        state.myTasks = action.payload
        state.lastFetchTime = Date.now()
        state.error = null
        state.rateLimited = false
      })
      .addCase(fetchCompletedTasks.rejected, (state, action) => {
        state.loading = false
        const error = action.payload as { message: string; rateLimited?: boolean } | undefined
        state.error = error?.message || 'Failed to fetch completed tasks'
        const wasRateLimited = state.rateLimited
        state.rateLimited = error?.rateLimited || false
        if (state.rateLimited && !wasRateLimited) {
          toastService.error('Too many requests. Please wait a moment and try again.')
        }
      })
      // Fetch missed tasks
      .addCase(fetchMissedTasks.pending, (state) => {
        state.loading = true
        state.error = null
        state.rateLimited = false
      })
      .addCase(fetchMissedTasks.fulfilled, (state, action) => {
        state.loading = false
        state.myTasks = action.payload
        state.lastFetchTime = Date.now()
        state.error = null
        state.rateLimited = false
      })
      .addCase(fetchMissedTasks.rejected, (state, action) => {
        state.loading = false
        const error = action.payload as { message: string; rateLimited?: boolean } | undefined
        state.error = error?.message || 'Failed to fetch missed tasks'
        const wasRateLimited = state.rateLimited
        state.rateLimited = error?.rateLimited || false
        if (state.rateLimited && !wasRateLimited) {
          toastService.error('Too many requests. Please wait a moment and try again.')
        }
      })
      // Search tasks
      .addCase(fetchSearchTasks.pending, (state) => {
        state.loading = true
        state.error = null
        state.rateLimited = false
      })
      .addCase(fetchSearchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.myTasks = action.payload
        state.lastFetchTime = Date.now()
        state.error = null
        state.rateLimited = false
      })
      .addCase(fetchSearchTasks.rejected, (state, action) => {
        state.loading = false
        const error = action.payload as { message: string; rateLimited?: boolean } | undefined
        state.error = error?.message || 'Failed to search tasks'
        const wasRateLimited = state.rateLimited
        state.rateLimited = error?.rateLimited || false
        if (state.rateLimited && !wasRateLimited) {
          toastService.error('Too many requests. Please wait a moment and try again.')
        }
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.creating = true
        state.error = null
        state.rateLimited = false
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.creating = false
        state.myTasks.push(action.payload)
        state.error = null
        state.rateLimited = false
        toastService.success('Task created successfully!')
      })
      .addCase(createTask.rejected, (state, action) => {
        state.creating = false
        const error = action.payload as { message: string; rateLimited?: boolean } | undefined
        state.error = error?.message || 'Failed to create task'
        const wasRateLimited = state.rateLimited
        state.rateLimited = error?.rateLimited || false
        if (state.rateLimited && !wasRateLimited) {
          toastService.error('Too many requests. Please wait a moment and try again.')
        } else if (!state.rateLimited) {
          toastService.error(state.error)
        }
      })
      // Update task
      .addCase(updateTask.pending, (state, action) => {
        const taskId = action.meta.arg.id
        if (!state.updating.includes(taskId)) {
          state.updating.push(taskId)
        }
        state.error = null
        state.rateLimited = false
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const { task } = action.payload
        const taskId = task.id
        
        // Update in myTasks or assignedTasks
        const myTaskIndex = state.myTasks.findIndex(t => t.id === taskId)
        if (myTaskIndex !== -1) {
          state.myTasks[myTaskIndex] = task
        } else {
          const assignedIndex = state.assignedTasks.findIndex(t => t.id === taskId)
          if (assignedIndex !== -1) {
            state.assignedTasks[assignedIndex] = task
          }
        }
        
        state.updating = state.updating.filter(id => id !== taskId)
        state.error = null
        state.rateLimited = false
      })
      .addCase(updateTask.rejected, (state, action) => {
        const taskId = action.meta.arg.id
        state.updating = state.updating.filter(id => id !== taskId)
        const error = action.payload as { message: string; rateLimited?: boolean } | undefined
        state.error = error?.message || 'Failed to update task'
        const wasRateLimited = state.rateLimited
        state.rateLimited = error?.rateLimited || false
        if (state.rateLimited && !wasRateLimited) {
          toastService.error('Too many requests. Please wait a moment and try again.')
        } else if (!state.rateLimited) {
          toastService.error(state.error)
        }
      })
      // Delete task
      .addCase(deleteTask.pending, (state, action) => {
        const taskId = action.meta.arg
        if (!state.deleting.includes(taskId)) {
          state.deleting.push(taskId)
        }
        state.error = null
        state.rateLimited = false
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const taskId = action.payload
        state.myTasks = state.myTasks.filter(t => t.id !== taskId)
        state.assignedTasks = state.assignedTasks.filter(t => t.id !== taskId)
        state.deleting = state.deleting.filter(id => id !== taskId)
        state.error = null
        state.rateLimited = false
        toastService.success('Task deleted successfully!')
      })
      .addCase(deleteTask.rejected, (state, action) => {
        const taskId = action.meta.arg
        state.deleting = state.deleting.filter(id => id !== taskId)
        const error = action.payload as { message: string; rateLimited?: boolean } | undefined
        state.error = error?.message || 'Failed to delete task'
        const wasRateLimited = state.rateLimited
        state.rateLimited = error?.rateLimited || false
        if (state.rateLimited && !wasRateLimited) {
          toastService.error('Too many requests. Please wait a moment and try again.')
        } else if (!state.rateLimited) {
          toastService.error(state.error)
        }
      })
      // Assign task
      .addCase(assignTaskToFriend.pending, (state) => {
        state.error = null
        state.rateLimited = false
      })
      .addCase(assignTaskToFriend.fulfilled, (state) => {
        state.error = null
        state.rateLimited = false
        // Task will be refreshed on next fetch
      })
      .addCase(assignTaskToFriend.rejected, (state, action) => {
        const error = action.payload as { message: string; rateLimited?: boolean } | undefined
        state.error = error?.message || 'Failed to assign task'
        const wasRateLimited = state.rateLimited
        state.rateLimited = error?.rateLimited || false
        if (state.rateLimited && !wasRateLimited) {
          toastService.error('Too many requests. Please wait a moment and try again.')
        } else if (!state.rateLimited) {
          toastService.error(state.error)
        }
      })
  },
})

export const { clearError, clearRateLimit, optimisticUpdateStatus, revertOptimisticUpdate, clearTasks } = taskSlice.actions
export default taskSlice.reducer
