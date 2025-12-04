'use client'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { mockAuthService } from '@/lib/utils/mockAuth'
import type { User } from '@/lib/interface/user'
import type { MockUser } from '@/lib/utils/mockAuth'

// Helper to convert MockUser to User
const mockUserToUser = (mockUser: MockUser | null): User | null => {
  if (!mockUser) return null
  return {
    id: mockUser.id,
    name: mockUser.name,
    email: mockUser.email,
    role: 'user' as const, // Default role for mock users
  }
}

// Mock authentication thunks - using localStorage instead of API
export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }) => {
    const response = await mockAuthService.login(payload)
    mockAuthService.setCurrentUser(response.user, response.token)
    return { user: response.user, token: response.token }
  }
)

export const signup = createAsyncThunk(
  'auth/signup',
  async (payload: { name: string; email: string; password: string }) => {
    const response = await mockAuthService.signup(payload)
    mockAuthService.setCurrentUser(response.user, response.token)
    return { user: response.user, token: response.token }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    mockAuthService.logout()
    return null
  }
)

// Initialize auth state from localStorage
export const initAuth = createAsyncThunk(
  'auth/init',
  async () => {
    const user = mockAuthService.getCurrentUser()
    return user ? { user } : { user: null }
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
        state.user = mockUserToUser(action?.payload?.user || null)
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
        state.user = mockUserToUser(action?.payload?.user || null)
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
      // Init auth (load from localStorage)
      .addCase(initAuth.fulfilled, (state, action) => {
        state.user = mockUserToUser(action.payload.user || null)
        state.isAuthenticated = !!action.payload.user
      })
  }
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
