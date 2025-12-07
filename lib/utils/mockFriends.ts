/**
 * Mock Friends Service
 * Uses localStorage to simulate friend management
 */

import type { Friend } from '@/lib/interface/task'

interface UserData {
  user?: {
    id: string
    name: string
    email?: string
  }
  password?: string
}

const FRIENDS_STORAGE_KEY = 'mock_friends'
const FRIEND_REQUESTS_STORAGE_KEY = 'mock_friend_requests'
const ALL_USERS_STORAGE_KEY = 'mock_users' // Shared with mockAuth

export interface FriendRequest {
  id: string
  fromUserId: string
  fromEmail: string
  fromName?: string
  toUserId: string
  toEmail: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

// Simulate network delay
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockFriendsService = {
  /**
   * Get user's friends list
   */
  async getFriends(userId: string): Promise<Friend[]> {
    await delay()
    
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(`${FRIENDS_STORAGE_KEY}_${userId}`)
    if (stored) {
      return JSON.parse(stored)
    }
    return []
  },

  /**
   * Search for users to add as friends
   */
  async searchUsers(query: string, currentUserId: string): Promise<Friend[]> {
    await delay()
    
    if (typeof window === 'undefined') return []
    
    // Get all registered users from mockAuth storage
    const stored = localStorage.getItem(ALL_USERS_STORAGE_KEY)
    if (!stored) return []
    
    const usersData = JSON.parse(stored)
    const currentUserFriends = await this.getFriends(currentUserId)
    const friendIds = new Set(currentUserFriends.map((f) => f.id))
    
    // Get pending friend requests to exclude users with pending requests
    const allRequests = await this.getAllFriendRequests()
    const pendingRequestUserIds = new Set(
      allRequests
        .filter((r) => r.status === 'pending' && (r.fromUserId === currentUserId || r.toUserId === currentUserId))
        .map((r) => r.fromUserId === currentUserId ? r.toUserId : r.fromUserId)
    )
    
    // Convert to Friend format and filter
    const allUsers: Friend[] = Object.entries(usersData as Record<string, UserData>)
      .map(([email, data]) => ({
        id: data.user?.id || email,
        name: data.user?.name || email.split('@')[0],
        email: email,
      }))
      .filter(
        (user) =>
          user.id !== currentUserId &&
          !friendIds.has(user.id) &&
          !pendingRequestUserIds.has(user.id) &&
          (user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase()))
      )
    
    return allUsers
  },

  /**
   * Add a friend
   */
  async addFriend(userId: string, friend: Friend): Promise<void> {
    await delay()
    
    if (typeof window === 'undefined') {
      throw new Error('localStorage is not available')
    }

    const friends = await this.getFriends(userId)
    
    // Check if already friends
    if (friends.some((f) => f.id === friend.id)) {
      throw new Error('Already friends with this user')
    }

    friends.push(friend)
    localStorage.setItem(`${FRIENDS_STORAGE_KEY}_${userId}`, JSON.stringify(friends))
    
    // Also add reverse friendship
    const friendFriends = await this.getFriends(friend.id)
    const currentUser = await this.getCurrentUserData(userId)
    if (currentUser && !friendFriends.some((f) => f.id === userId)) {
      friendFriends.push({
        id: userId,
        name: currentUser.name,
        email: currentUser.email,
      })
      localStorage.setItem(`${FRIENDS_STORAGE_KEY}_${friend.id}`, JSON.stringify(friendFriends))
    }
  },

  /**
   * Remove a friend
   */
  async removeFriend(userId: string, friendId: string): Promise<void> {
    await delay()
    
    if (typeof window === 'undefined') {
      throw new Error('localStorage is not available')
    }

    const friends = await this.getFriends(userId)
    const updatedFriends = friends.filter((f) => f.id !== friendId)
    localStorage.setItem(`${FRIENDS_STORAGE_KEY}_${userId}`, JSON.stringify(updatedFriends))
    
    // Also remove reverse friendship
    const friendFriends = await this.getFriends(friendId)
    const updatedFriendFriends = friendFriends.filter((f) => f.id !== userId)
    localStorage.setItem(`${FRIENDS_STORAGE_KEY}_${friendId}`, JSON.stringify(updatedFriendFriends))
  },

  /**
   * Send a friend request
   */
  async sendFriendRequest(fromUserId: string, toEmail: string): Promise<void> {
    await delay()
    
    if (typeof window === 'undefined') {
      throw new Error('localStorage is not available')
    }

    // Get current user data
    const currentUser = await this.getCurrentUserData(fromUserId)
    if (!currentUser) {
      throw new Error('Current user not found')
    }

    // Find target user by email
    const stored = localStorage.getItem(ALL_USERS_STORAGE_KEY)
    if (!stored) {
      throw new Error('User not found')
    }

    const usersData = JSON.parse(stored) as Record<string, UserData>
    const targetUserData = usersData[toEmail.toLowerCase()]
    if (!targetUserData || !targetUserData.user) {
      throw new Error('User not found')
    }

    const toUserId = targetUserData.user.id

    // Check if already friends
    const friends = await this.getFriends(fromUserId)
    if (friends.some((f) => f.id === toUserId)) {
      throw new Error('Already friends with this user')
    }

    // Check if request already exists
    const existingRequests = await this.getFriendRequests(toUserId)
    if (existingRequests.some((r) => r.fromUserId === fromUserId && r.status === 'pending')) {
      throw new Error('Friend request already sent')
    }

    // Create request
    const request: FriendRequest = {
      id: `${fromUserId}_${toUserId}_${Date.now()}`,
      fromUserId,
      fromEmail: currentUser.email,
      fromName: currentUser.name,
      toUserId,
      toEmail: toEmail.toLowerCase(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    // Store request
    const allRequests = await this.getAllFriendRequests()
    allRequests.push(request)
    localStorage.setItem(FRIEND_REQUESTS_STORAGE_KEY, JSON.stringify(allRequests))
  },

  /**
   * Get all friend requests (for a specific user - incoming and outgoing)
   */
  async getFriendRequests(userId: string): Promise<FriendRequest[]> {
    await delay()
    
    if (typeof window === 'undefined') return []
    
    const allRequests = await this.getAllFriendRequests()
    return allRequests.filter(
      (r) => (r.fromUserId === userId || r.toUserId === userId) && r.status === 'pending'
    )
  },

  /**
   * Get all friend requests (internal helper)
   */
  async getAllFriendRequests(): Promise<FriendRequest[]> {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(FRIEND_REQUESTS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  },

  /**
   * Accept a friend request
   */
  async acceptFriendRequest(requestId: string, userId: string): Promise<void> {
    await delay()
    
    if (typeof window === 'undefined') {
      throw new Error('localStorage is not available')
    }

    const allRequests = await this.getAllFriendRequests()
    const request = allRequests.find((r) => r.id === requestId && r.status === 'pending')
    
    if (!request) {
      throw new Error('Friend request not found')
    }

    // Verify user is the recipient
    if (request.toUserId !== userId) {
      throw new Error('Unauthorized')
    }

    // Update request status
    request.status = 'accepted'
    localStorage.setItem(FRIEND_REQUESTS_STORAGE_KEY, JSON.stringify(allRequests))

    // Add as friends
    const fromUser = await this.getCurrentUserData(request.fromUserId)
    const toUser = await this.getCurrentUserData(request.toUserId)
    
    if (fromUser && toUser) {
      await this.addFriend(request.fromUserId, {
        id: toUser.id,
        name: toUser.name,
        email: toUser.email,
      })
      await this.addFriend(request.toUserId, {
        id: fromUser.id,
        name: fromUser.name,
        email: fromUser.email,
      })
    }
  },

  /**
   * Reject a friend request
   */
  async rejectFriendRequest(requestId: string, userId: string): Promise<void> {
    await delay()
    
    if (typeof window === 'undefined') {
      throw new Error('localStorage is not available')
    }

    const allRequests = await this.getAllFriendRequests()
    const request = allRequests.find((r) => r.id === requestId && r.status === 'pending')
    
    if (!request) {
      throw new Error('Friend request not found')
    }

    // Verify user is the recipient
    if (request.toUserId !== userId) {
      throw new Error('Unauthorized')
    }

    // Update request status
    request.status = 'rejected'
    localStorage.setItem(FRIEND_REQUESTS_STORAGE_KEY, JSON.stringify(allRequests))
  },

  /**
   * Get current user data
   */
  async getCurrentUserData(userId: string): Promise<{ id: string; name: string; email: string } | null> {
    if (typeof window === 'undefined') return null
    
    const stored = localStorage.getItem(ALL_USERS_STORAGE_KEY)
    if (!stored) return null
    
    const usersData = JSON.parse(stored) as Record<string, UserData>
    for (const [email, data] of Object.entries(usersData)) {
      if (data.user?.id === userId) {
        return {
          id: data.user.id,
          name: data.user.name,
          email: email,
        }
      }
    }
    return null
  },
}

