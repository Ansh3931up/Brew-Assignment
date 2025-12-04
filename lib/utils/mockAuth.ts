/**
 * Mock Authentication Service
 * Uses localStorage to simulate backend authentication
 * This allows UI development without a real API
 */

export interface MockUser {
  id: string
  name: string
  email: string
  createdAt: string
}

interface MockAuthResponse {
  user: MockUser
  token: string
}

const STORAGE_KEY = 'mock_users'
const AUTH_TOKEN_KEY = 'auth_token'
const CURRENT_USER_KEY = 'current_user'

// Initialize with a demo user for testing
const initializeMockUsers = (): Map<string, { password: string; user: MockUser }> => {
  if (typeof window === 'undefined') {
    return new Map()
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    const data = JSON.parse(stored)
    return new Map(Object.entries(data))
  }

  // Create a default demo user
  const demoUser = {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    createdAt: new Date().toISOString(),
  }
  
  const users = new Map()
  users.set('demo@example.com', {
    password: 'demo123', // In real app, this would be hashed
    user: demoUser,
  })
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(users)))
  return users
}

// Simulate network delay
const delay = (ms: number = 800) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockAuthService = {
  /**
   * Sign up a new user
   */
  async signup(payload: { name: string; email: string; password: string }): Promise<MockAuthResponse> {
    await delay()

    if (typeof window === 'undefined') {
      throw new Error('localStorage is not available')
    }

    const users = initializeMockUsers()

    // Check if user already exists
    if (users.has(payload.email.toLowerCase())) {
      throw new Error('User with this email already exists')
    }

    // Validate password
    if (payload.password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    // Create new user
    const newUser: MockUser = {
      id: Date.now().toString(),
      name: payload.name,
      email: payload.email.toLowerCase(),
      createdAt: new Date().toISOString(),
    }

    // Store user
    users.set(payload.email.toLowerCase(), {
      password: payload.password, // In real app, this would be hashed
      user: newUser,
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(users)))

    // Generate mock token
    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      user: newUser,
      token,
    }
  },

  /**
   * Log in a user
   */
  async login(payload: { email: string; password: string }): Promise<MockAuthResponse> {
    await delay()

    if (typeof window === 'undefined') {
      throw new Error('localStorage is not available')
    }

    const users = initializeMockUsers()
    const email = payload.email.toLowerCase()
    const userData = users.get(email)

    if (!userData) {
      throw new Error('Invalid email or password')
    }

    if (userData.password !== payload.password) {
      throw new Error('Invalid email or password')
    }

    // Generate mock token
    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      user: userData.user,
      token,
    }
  },

  /**
   * Log out the current user
   */
  logout(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(CURRENT_USER_KEY)
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): MockUser | null {
    if (typeof window === 'undefined') return null

    const stored = localStorage.getItem(CURRENT_USER_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    return null
  },

  /**
   * Set current user in localStorage
   */
  setCurrentUser(user: MockUser, token: string): void {
    if (typeof window === 'undefined') return

    localStorage.setItem(AUTH_TOKEN_KEY, token)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(AUTH_TOKEN_KEY) && !!localStorage.getItem(CURRENT_USER_KEY)
  },
}

