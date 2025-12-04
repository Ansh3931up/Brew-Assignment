'use client'

import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { RootState } from '@/lib/store'
import { TaskManagerLayout } from '@/components/task-manager/task-manager-layout'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!isAuthenticated || !user || Object.keys(user).length === 0) {
      router.push('/login')
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || !user || Object.keys(user).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <TaskManagerLayout />
}

