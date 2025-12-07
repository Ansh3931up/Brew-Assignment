'use client'

import { useState } from 'react'
import { Mail, Check, X as XIcon, Clock, UserPlus } from 'lucide-react'
import { logger } from '@/lib/utils/logger'

export interface FriendRequest {
  id: string
  fromEmail: string
  fromName?: string
  toEmail: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

interface FriendRequestsListProps {
  requests: FriendRequest[]
  onAccept: (requestId: string) => Promise<void>
  onReject: (requestId: string) => Promise<void>
  isLoading?: boolean
  currentUserEmail?: string
}

export function FriendRequestsList({
  requests,
  onAccept,
  onReject,
  isLoading = false,
  currentUserEmail,
}: FriendRequestsListProps) {
  const [processingId, setProcessingId] = useState<string | null>(null)

  const pendingRequests = requests.filter((req) => req.status === 'pending')

  const handleAccept = async (requestId: string) => {
    setProcessingId(requestId)
    try {
      await onAccept(requestId)
    } catch (error) {
      logger.error('Failed to accept friend request:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId)
    try {
      await onReject(requestId)
    } catch (error) {
      logger.error('Failed to reject friend request:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <Mail className="h-12 w-12 text-muted-foreground dark:text-text-mutedDark mx-auto mb-3" />
        <p className="text-foreground dark:text-text-primaryDark font-medium mb-1">
          No Pending Requests
        </p>
        <p className="text-sm text-muted-foreground dark:text-text-mutedDark">
          You don&apos;t have any pending friend requests.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {pendingRequests.map((request) => {
        const isProcessing = processingId === request.id
        const isIncoming = request.toEmail === currentUserEmail
        const displayEmail = isIncoming ? request.fromEmail : request.toEmail
        const displayName = isIncoming ? request.fromName : undefined

        return (
          <div
            key={request.id}
            className="bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg p-4 hover:bg-background-overlayDark dark:hover:bg-background-overlayDark transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground dark:text-text-primaryDark truncate">
                      {displayName || displayEmail}
                    </p>
                    {isIncoming && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-500 rounded-full">
                        Incoming
                      </span>
                    )}
                    {!isIncoming && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500/10 text-yellow-500 rounded-full">
                        Sent
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground dark:text-text-mutedDark truncate">
                    {displayEmail}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Clock className="h-3 w-3 text-muted-foreground dark:text-text-mutedDark" />
                    <span className="text-xs text-muted-foreground dark:text-text-mutedDark">
                      {formatDate(request.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {isIncoming && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleAccept(request.id)}
                    disabled={isLoading || isProcessing}
                    className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Accept request"
                    title="Accept"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    disabled={isLoading || isProcessing}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Reject request"
                    title="Reject"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

