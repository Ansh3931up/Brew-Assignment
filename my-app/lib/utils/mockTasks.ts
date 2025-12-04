/**
 * Mock Tasks Service
 * Uses localStorage to simulate backend task management
 */

import type { Task } from '@/lib/interface/task'

const TASKS_STORAGE_KEY = 'mock_tasks'
const ASSIGNED_TASKS_STORAGE_KEY = 'mock_assigned_tasks'

// Simulate network delay
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockTasksService = {
  /**
   * Get all tasks for a user
   */
  async getTasks(userId: string): Promise<Task[]> {
    await delay()
    
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(`${TASKS_STORAGE_KEY}_${userId}`)
    if (stored) {
      return JSON.parse(stored)
    }
    return []
  },

  /**
   * Get tasks assigned to user by friends
   */
  async getAssignedTasks(userId: string): Promise<Task[]> {
    await delay()
    
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(`${ASSIGNED_TASKS_STORAGE_KEY}_${userId}`)
    if (stored) {
      return JSON.parse(stored)
    }
    return []
  },

  /**
   * Create a new task
   */
  async createTask(userId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    await delay()
    
    if (typeof window === 'undefined') {
      throw new Error('localStorage is not available')
    }

    const tasks = await this.getTasks(userId)
    const newTask: Task = {
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    tasks.push(newTask)
    localStorage.setItem(`${TASKS_STORAGE_KEY}_${userId}`, JSON.stringify(tasks))
    return newTask
  },

  /**
   * Update a task
   */
  async updateTask(userId: string, taskId: string, updates: Partial<Task>): Promise<Task> {
    await delay()
    
    if (typeof window === 'undefined') {
      throw new Error('localStorage is not available')
    }

    const tasks = await this.getTasks(userId)
    const index = tasks.findIndex((t) => t.id === taskId)
    
    if (index === -1) {
      throw new Error('Task not found')
    }

    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(`${TASKS_STORAGE_KEY}_${userId}`, JSON.stringify(tasks))
    return tasks[index]
  },

  /**
   * Delete a task
   */
  async deleteTask(userId: string, taskId: string): Promise<void> {
    await delay()
    
    if (typeof window === 'undefined') {
      throw new Error('localStorage is not available')
    }

    const tasks = await this.getTasks(userId)
    const filtered = tasks.filter((t) => t.id !== taskId)
    localStorage.setItem(`${TASKS_STORAGE_KEY}_${userId}`, JSON.stringify(filtered))
  },

  /**
   * Assign a task to a friend
   */
  async assignTaskToFriend(
    fromUserId: string,
    fromUserEmail: string,
    toUserId: string,
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'assignedBy' | 'assignedByEmail'>
  ): Promise<Task> {
    await delay()
    
    if (typeof window === 'undefined') {
      throw new Error('localStorage is not available')
    }

    const assignedTasks = await this.getAssignedTasks(toUserId)
    const newTask: Task = {
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      assignedBy: fromUserId,
      assignedByEmail: fromUserEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    assignedTasks.push(newTask)
    localStorage.setItem(`${ASSIGNED_TASKS_STORAGE_KEY}_${toUserId}`, JSON.stringify(assignedTasks))
    return newTask
  },
}

