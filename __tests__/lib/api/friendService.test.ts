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

import { friendService } from '@/lib/api/friendService'

describe('FriendService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('searchUsers', () => {
    it('should search users by email', async () => {
      const mockResponse = [
        { id: '1', name: 'User 1', email: 'user1@example.com' },
      ]
      mockGet.mockResolvedValue(mockResponse)

      const result = await friendService.searchUsers('user1@example.com')

      expect(mockGet).toHaveBeenCalledWith('/api/friends/search?email=user1@example.com')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('sendFriendRequest', () => {
    it('should send friend request', async () => {
      const mockResponse = {
        id: 'req1',
        requester: { id: '1', name: 'User' },
        recipient: { id: '2', name: 'Friend' },
        status: 'pending',
      }
      mockPost.mockResolvedValue(mockResponse)

      const result = await friendService.sendFriendRequest('friendId123')

      expect(mockPost).toHaveBeenCalledWith('/api/friends/requests', {
        recipientId: 'friendId123',
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getFriends', () => {
    it('should get friends list', async () => {
      const mockResponse = [
        { id: '1', name: 'Friend 1', email: 'friend1@example.com' },
      ]
      mockGet.mockResolvedValue(mockResponse)

      const result = await friendService.getFriends()

      expect(mockGet).toHaveBeenCalledWith('/api/friends')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('acceptFriendRequest', () => {
    it('should accept friend request', async () => {
      const mockResponse = {
        id: 'req1',
        status: 'accepted',
      }
      mockPut.mockResolvedValue(mockResponse)

      const result = await friendService.acceptFriendRequest('req1')

      expect(mockPut).toHaveBeenCalledWith('/api/friends/requests/req1/accept')
      expect(result).toEqual(mockResponse)
    })
  })
})

