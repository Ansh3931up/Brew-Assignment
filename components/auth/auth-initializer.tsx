'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initAuth } from '@/lib/slices/authSlice'
import type { AppDispatch } from '@/lib/store'

/**
 * Component to initialize authentication state from localStorage
 * Runs once on app mount
 */
export function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initAuth())
  }, [dispatch])

  return null
}

