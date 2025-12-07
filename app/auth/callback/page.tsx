'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { initAuth } from '@/lib/slices/authSlice'
import type { AppDispatch } from '@/lib/store'
import { toastService } from '@/lib/utils/toast'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const token = searchParams.get('token')
    const userStr = searchParams.get('user')

    if (token && userStr) {
      try {
        // Store token and user
        localStorage.setItem('auth_token', token)
        localStorage.setItem('current_user', userStr)

        // Initialize auth state
        dispatch(initAuth())

        toastService.success('Login successful!')
        router.push('/dashboard')
      } catch {
        toastService.error('Failed to process authentication')
        router.push('/login')
      }
    } else {
      toastService.error('Authentication failed')
      router.push('/login')
    }
  }, [searchParams, router, dispatch])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}


