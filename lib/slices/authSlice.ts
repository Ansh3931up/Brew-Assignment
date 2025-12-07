'use client'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '@/lib/api/authService'
import type { User } from '@/lib/interface/user'

// Helper to convert API user to User
const apiUserToUser = (apiUser: { id: string; name: string; email: string } | null): User | null => {
  if (!apiUser) return null
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: 'user' as const,
  }
}

// Authentication thunks - using real API
export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }) => {
    const response = await authService.login(payload)
    // Extract data from API response structure: { success, data: { user, token }, message }
    const user = response.data.user
    const token = response.data.token
    
    // Store token and user in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('current_user', JSON.stringify(user))
    }
    return { user, token }
  }
)

export const signup = createAsyncThunk(
  'auth/signup',
  async (payload: { name: string; email: string; password: string }) => {
    const response = await authService.register(payload)
    // Extract data from API response structure: { success, data: { user, token }, message }
    const user = response.data.user
    const token = response.data.token
    
    // Store token and user in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('current_user', JSON.stringify(user))
    }
    return { user, token }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await authService.logout()
    } catch {
      // Ignore logout errors
    }
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('current_user')
    }
    return null
  }
)

// Initialize auth state from localStorage and verify with API
export const initAuth = createAsyncThunk(
  'auth/init',
  async () => {
    if (typeof window === 'undefined') {
      return { user: null }
    }

    const token = localStorage.getItem('auth_token')
    if (!token) {
      return { user: null }
    }

    try {
      // Verify token with API
      const response = await authService.getCurrentUser()
      // Extract user from API response structure: { success, data: { user }, message }
      const user = response.data?.user || null
      return { user }
    } catch {
      // Token invalid, clear storage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('current_user')
      return { user: null }
    }
  }
)

interface AuthState {
  user: User | null
  loading: boolean
  error: string
  isAuthenticated: boolean
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: '',
    isAuthenticated: false,
  } as AuthState,
  reducers: {
    clearError: (state) => {
      state.error = ''
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = apiUserToUser(action?.payload?.user || null)
        state.isAuthenticated = !!action?.payload?.user
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
        state.isAuthenticated = false
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false
        state.user = apiUserToUser(action?.payload?.user || null)
        state.isAuthenticated = !!action?.payload?.user
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Signup failed'
        state.isAuthenticated = false
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = ''
      })
      // Init auth (load from localStorage and verify with API)
      .addCase(initAuth.fulfilled, (state, action) => {
        state.user = apiUserToUser(action.payload.user || null)
        state.isAuthenticated = !!action.payload.user
      })
  }
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
