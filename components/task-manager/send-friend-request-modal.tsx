'use client'

import { useState } from 'react'
import { Mail, X, Send, AlertCircle } from 'lucide-react'
import { logger } from '@/lib/utils/logger'

interface SendFriendRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (email: string) => Promise<void>
  isLoading?: boolean
}

export function SendFriendRequestModal({
  isOpen,
  onClose,
  onSend,
  isLoading = false,
}: SendFriendRequestModalProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(emailValue)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address')
      return
    }

    try {
      await onSend(email.trim().toLowerCase())
      setEmail('')
      setError('')
      onClose()
    } catch (error) {
      // Error handling is done by parent component
      logger.error('Failed to send friend request:', error)
    }
  }

  const handleClose = () => {
    setEmail('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-background dark:bg-background-cardDark border-2 border-border dark:border-border-darkMode rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border dark:border-border-darkMode">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground dark:text-text-primaryDark">
              Send Friend Request
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 hover:bg-background-overlayDark dark:hover:bg-background-overlayDark rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-foreground dark:text-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="mb-4">
            <label htmlFor="friendEmail" className="block text-sm font-medium text-foreground dark:text-text-primaryDark mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-text-mutedDark" />
              <input
                id="friendEmail"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                className={`w-full pl-10 pr-3 py-2 bg-background-cardDark dark:bg-background-cardDark border ${
                  error
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-border dark:border-border-darkMode'
                } rounded-lg text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                placeholder="friend@example.com"
                disabled={isLoading}
                required
              />
            </div>
            {error && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
            <p className="mt-2 text-xs text-muted-foreground dark:text-text-mutedDark">
              We&apos;ll send a friend request to this email address. They&apos;ll receive a notification to accept or decline.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg text-foreground dark:text-foreground hover:bg-background-overlayDark dark:hover:bg-background-overlayDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Sending...'
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

