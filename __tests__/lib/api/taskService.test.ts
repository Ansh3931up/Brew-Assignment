import { describe, it, expect, jest, beforeEach } from '@jest/globals'

// Mock the api object
const mockGet = jest.fn()
const mockPost = jest.fn()
const mockPut = jest.fn()
const mockDelete = jest.fn()

jest.mock('@/lib/api/clients', () => ({
  api: {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
    patch: jest.fn(),
    request: jest.fn(),
  },
}))

import { taskService } from '@/lib/api/taskService'

describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getTasks', () => {
    it('should get tasks with filters', async () => {
      const mockResponse = [
        {
          id: '1',
          title: 'Task 1',
          status: 'todo',
          priority: 'high',
        },
      ]
      mockGet.mockResolvedValue(mockResponse)

      const result = await taskService.getTasks({ status: 'todo' })

      expect(mockGet).toHaveBeenCalledWith('/api/tasks?status=todo')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('createTask', () => {
    it('should create a new task', async () => {
      const mockResponse = {
        id: '1',
        title: 'New Task',
        status: 'todo',
      }
      mockPost.mockResolvedValue(mockResponse)

      const taskData = {
        title: 'New Task',
        description: 'Description',
        priority: 'high' as const,
      }

      const result = await taskService.createTask(taskData)

      expect(mockPost).toHaveBeenCalledWith('/api/tasks', taskData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateTask', () => {
    it('should update a task', async () => {
      const mockResponse = {
        id: '1',
        title: 'Updated Task',
      }
      mockPut.mockResolvedValue(mockResponse)

      const result = await taskService.updateTask('1', { title: 'Updated Task' })

      expect(mockPut).toHaveBeenCalledWith('/api/tasks/1', { title: 'Updated Task' })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      mockDelete.mockResolvedValue(null)

      await taskService.deleteTask('1')

      expect(mockDelete).toHaveBeenCalledWith('/api/tasks/1')
    })
  })
})

