'use client'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/lib/api/clients'

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }) => {
    const res = await api.post('auth/login', payload)
    return res.data
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {},
    loading: false,
    error: ''
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action?.payload?.user
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'login failed'
      })
  }
})
export default authSlice.reducer
