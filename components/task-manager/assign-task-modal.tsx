'use client'

import { useState, useEffect } from 'react'
import { UserPlus, X, Users, Search } from 'lucide-react'
import type { Friend } from '@/lib/interface/task'
import { logger } from '@/lib/utils/logger'

interface AssignTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (friendId: string, friendEmail: string) => Promise<void>
  friends: Friend[]
  isLoading?: boolean
  taskTitle?: string
}

export function AssignTaskModal({
  isOpen,
  onClose,
  onAssign,
  friends,
  isLoading = false,
  taskTitle,
}: AssignTaskModalProps) {
  const [selectedFriendId, setSelectedFriendId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setSelectedFriendId('')
      setSearchQuery('')
    }
  }, [isOpen])

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAssign = async () => {
    if (!selectedFriendId) return

    const selectedFriend = friends.find((f) => f.id === selectedFriendId)
    if (!selectedFriend) return

    try {
      await onAssign(selectedFriend.id, selectedFriend.email)
      setSelectedFriendId('')
      setSearchQuery('')
      onClose()
    } catch (error) {
      // Error handling is done by parent component
      logger.error('Failed to assign task:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-background dark:bg-background-cardDark border-2 border-border dark:border-border-darkMode rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border dark:border-border-darkMode shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground dark:text-text-primaryDark">
                Assign Task
              </h2>
              {taskTitle && (
                <p className="text-sm text-muted-foreground dark:text-text-mutedDark mt-0.5 truncate max-w-[200px]">
                  {taskTitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-background-overlayDark dark:hover:bg-background-overlayDark rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-foreground dark:text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {friends.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground dark:text-text-mutedDark mx-auto mb-3" />
              <p className="text-foreground dark:text-text-primaryDark font-medium mb-1">
                No Friends Yet
              </p>
              <p className="text-sm text-muted-foreground dark:text-text-mutedDark">
                Add friends first to assign tasks to them.
              </p>
            </div>
          ) : (
            <>
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-text-mutedDark" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Search friends..."
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Friends List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredFriends.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground dark:text-text-mutedDark py-4">
                    No friends found matching &quot;{searchQuery}&quot;
                  </p>
                ) : (
                  filteredFriends.map((friend) => (
                    <button
                      key={friend.id}
                      onClick={() => setSelectedFriendId(friend.id)}
                      disabled={isLoading}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        selectedFriendId === friend.id
                          ? 'border-primary bg-primary/10 dark:bg-primary/20'
                          : 'border-border dark:border-border-darkMode hover:border-primary/50 hover:bg-background-overlayDark dark:hover:bg-background-overlayDark'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          {friend.avatar ? (
                            <img
                              src={friend.avatar}
                              alt={friend.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-primary">
                              {friend.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground dark:text-text-primaryDark truncate">
                            {friend.name}
                          </p>
                          <p className="text-xs text-muted-foreground dark:text-text-mutedDark truncate">
                            {friend.email}
                          </p>
                        </div>
                        {selectedFriendId === friend.id && (
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <div className="h-2 w-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 sm:p-6 border-t border-border dark:border-border-darkMode shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-background-cardDark dark:bg-background-cardDark border border-border dark:border-border-darkMode rounded-lg text-foreground dark:text-foreground hover:bg-background-overlayDark dark:hover:bg-background-overlayDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAssign}
              disabled={isLoading || !selectedFriendId || friends.length === 0}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Assigning...' : 'Assign Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

