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
const ALL_USERS_STORAGE_KEY = 'mock_users' // Shared with mockAuth

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

