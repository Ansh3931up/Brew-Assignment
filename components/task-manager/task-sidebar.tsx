'use client'

import { useState, useEffect, startTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { CheckCircle2, Calendar, Users, Search, UserPlus, X, List, Flag } from 'lucide-react'
import type { RootState } from '@/lib/store'
import { mockFriendsService } from '@/lib/utils/mockFriends'
import type { Friend } from '@/lib/interface/task'
import { toastService } from '@/lib/utils/toast'
import { logger } from '@/lib/utils/logger'

interface TaskSidebarProps {
  selectedCategory: string | null
  isOpen?: boolean
  onClose?: () => void
  isDesktopOpen?: boolean
  taskCounts?: {
    all?: number
    today?: number
    scheduled?: number
    flagged?: number
    completed?: number
    friends?: number
  }
}

const smartLists = [
  { id: 'today', label: 'Today', icon: Calendar, color: 'bg-blue-500' },
  { id: 'scheduled', label: 'Scheduled', icon: Calendar, color: 'bg-red-500' },
  { id: 'all', label: 'All', icon: List, color: 'bg-gray-500' },
  { id: 'flagged', label: 'Flagged', icon: Flag, color: 'bg-orange-500' },
  { id: 'completed', label: 'Completed', icon: CheckCircle2, color: 'bg-gray-400' },
]

export function TaskSidebar({ selectedCategory, isOpen = true, onClose, isDesktopOpen = true, taskCounts = {} }: TaskSidebarProps) {
  const { user } = useSelector((state: RootState) => state.auth)
  const [friends, setFriends] = useState<Friend[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Friend[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  const loadFriends = async () => {
    if (!user?.id) return
    try {
      const friendsList = await mockFriendsService.getFriends(user.id)
      startTransition(() => {
        setFriends(friendsList)
      })
    } catch (error) {
      logger.error('Failed to load friends:', error)
    }
  }

  useEffect(() => {
    if (user?.id) {
      loadFriends()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim().length > 0 && user?.id) {
      try {
        const results = await mockFriendsService.searchUsers(query, user.id)
        setSearchResults(results)
        setShowSearchResults(true)
      } catch (error) {
        logger.error('Failed to search users:', error)
      }
    } else {
      setShowSearchResults(false)
    }
  }

  const handleAddFriend = async (friend: Friend) => {
    if (!user?.id) return
    try {
      await mockFriendsService.addFriend(user.id, friend)
      toastService.success(`Added ${friend.name} as a friend!`)
      setSearchQuery('')
      setShowSearchResults(false)
      loadFriends()
    } catch (error: unknown) {
      toastService.error((error as Error)?.message || 'Failed to add friend')
    }
  }

  return (
    <>
      {/* Desktop Sidebar - Only render when open, takes up space in layout */}
      {isDesktopOpen && (
        <div
          className="hidden md:flex glass mt-1 mb-1 ml-1 mr-2 h-full flex-col overflow-hidden w-full shrink-0 rounded-[24px] shadow-lg"
          style={{
            maxHeight: 'calc(100vh - 0.5rem)',
          }}
        >
          <SidebarContent
            selectedCategory={selectedCategory}
            onClose={onClose}
            taskCounts={taskCounts}
            friends={friends}
            searchQuery={searchQuery}
            searchResults={searchResults}
            showSearchResults={showSearchResults}
            onSearch={handleSearch}
            onAddFriend={handleAddFriend}
          />
        </div>
      )}

      {/* Mobile Sidebar - Fixed overlay, doesn't affect layout, only on mobile */}
      <div
        className={`md:hidden fixed glass mt-1 mb-1 ml-1 mr-0 inset-y-0 left-0 z-50 w-[280px] sm:w-[300px] flex flex-col overflow-hidden transform transition-all duration-300 ease-out rounded-r-[24px] shadow-2xl ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
        }`}
        style={{
          maxHeight: 'calc(100vh - 0.5rem)',
          top: '0.25rem',
          bottom: '0.25rem',
        }}
      >
        <SidebarContent
          selectedCategory={selectedCategory}
          onClose={onClose}
          taskCounts={taskCounts}
          friends={friends}
          searchQuery={searchQuery}
          searchResults={searchResults}
          showSearchResults={showSearchResults}
          onSearch={handleSearch}
          onAddFriend={handleAddFriend}
        />
      </div>
    </>
  )
}

function SidebarContent({
  selectedCategory,
  onClose,
  taskCounts,
  friends,
  searchQuery,
  searchResults,
  showSearchResults,
  onSearch,
  onAddFriend,
}: {
  selectedCategory: string | null
  onClose?: () => void
  taskCounts: {
    all?: number
    today?: number
    scheduled?: number
    flagged?: number
    completed?: number
    friends?: number
  }
  friends: Friend[]
  searchQuery: string
  searchResults: Friend[]
  showSearchResults: boolean
  onSearch: (query: string) => void
  onAddFriend: (friend: Friend) => void
}) {
  const router = useRouter()
  const pathname = usePathname()

  // Helper function to get route for category
  const getRouteForCategory = (categoryId: string) => {
    if (categoryId === 'all') return '/dashboard'
    return `/dashboard/${categoryId}`
  }

  // Helper function to check if category is selected based on pathname
  const isCategorySelected = (categoryId: string) => {
    if (categoryId === 'all') return pathname === '/dashboard'
    return pathname === `/dashboard/${categoryId}`
  }

  return (
      <div className="h-full flex flex-col overflow-hidden relative">
      {/* Shiny overlay for body - reduced whitish tone */}
      <div className="absolute inset-0 pointer-events-none z-0 rounded-[24px] overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-white/10 via-white/2 to-transparent dark:from-white/5 dark:via-white/1" />
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent dark:via-white/2" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-linear-to-b from-white/8 to-transparent dark:from-white/4" />
      </div>
      
      {/* Close Button - Only on mobile (desktop uses header toggle) */}
      {onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="md:hidden absolute top-3 right-4 p-2 bg-background-cardDark/80 dark:bg-background-cardDark/80 backdrop-blur-sm hover:bg-background-overlayDark dark:hover:bg-background-overlayDark border border-border/50 dark:border-border-darkMode/50 rounded-full transition-all duration-200 z-50 pointer-events-auto shadow-lg hover:scale-105 active:scale-95"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4 text-foreground dark:text-[#cbd5e1]" />
        </button>
      )}

      {/* Smart Lists - Grid Layout */}
      <div className="p-2 sm:p-3 pt-12 sm:pt-16 md:pt-3 relative z-10">
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          {smartLists.map((list) => {
            const Icon = list.icon
            const isSelected = isCategorySelected(list.id)
            const count = taskCounts[list.id as keyof typeof taskCounts] || 0
            
            return (
              <button
                key={list.id}
                onClick={() => {
                  router.push(getRouteForCategory(list.id))
                  if (onClose) onClose()
                }}
                className={`flex ${list.color} flex-col items-start gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all text-xs sm:text-sm ${
                  isSelected
                    ? 'bg-primary/20 dark:bg-primary/30 border-2 border-primary/50 text-foreground dark:text-foreground'
                    : 'border-2 border-white/10 dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/30 hover:bg-white/5 dark:hover:bg-white/5 text-foreground dark:text-foreground'
                }`}
              >
                <div className={`w-6 h-6 sm:w-8 sm:h-8 font-extrabold rounded-lg flex items-center justify-center`}>
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-white font-extrabold" />
                </div>
                <div className="flex flex-row w-full justify-between items-center gap-0.5">
                  <span className="font-medium text-xs sm:text-sm text-center truncate">{list.label}</span>
                  <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-foreground dark:text-foreground' : 'text-muted-foreground dark:text-muted-foreground'}`}>
                    {count}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* My Lists Section - macOS Reminders Style */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 border-t border-white/20 dark:border-white/10 mt-3">
        <div className="px-2.5 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground uppercase tracking-wider px-2.5">
            My Lists
          </h3>
        </div>
        
        {/* Friends Task List */}
        <div className="px-2.5 pb-2">
          <button
            onClick={() => {
              router.push('/dashboard/friends')
              if (onClose) onClose()
            }}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-all text-sm ${
              isCategorySelected('friends')
                ? 'bg-primary/20 dark:bg-primary/30 text-foreground dark:text-foreground'
                : 'hover:bg-white/10 dark:hover:bg-white/5 text-foreground dark:text-foreground'
            }`}
          >
            <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center shrink-0">
              <Users className="h-3 w-3 text-white" />
            </div>
            <span className="flex-1 text-left font-medium text-sm">Friends Tasks</span>
            <span className={`text-xs font-normal ${selectedCategory === 'friends' ? 'text-foreground dark:text-foreground' : 'text-muted-foreground dark:text-muted-foreground'}`}>
              {taskCounts.friends || 0}
            </span>
          </button>
        </div>

        {/* Friends Search */}
        <div className="px-2.5 pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground dark:text-[#cbd5e1]" />
            <input
              type="text"
              placeholder="Search for friends"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white/20 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-md text-xs text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 backdrop-blur-sm"
            />
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 glass border border-white/30 dark:border-white/10 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => onAddFriend(result)}
                    className="w-full px-4 py-2 text-left hover:bg-white/20 dark:hover:bg-white/10 flex items-center gap-3 border-b border-white/20 dark:border-white/10 last:border-0 text-foreground dark:text-foreground transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserPlus className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{result.name}</p>
                      <p className="text-xs text-muted-foreground dark:text-[#cbd5e1] truncate">{result.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto px-2.5 pb-3">
          {friends.length === 0 ? (
            <p className="text-xs text-muted-foreground dark:text-[#cbd5e1] text-center py-4 px-2.5">
              No friends yet
            </p>
          ) : (
            <div className="space-y-0.5">
              {friends.map((friend) => (
                <button
                  key={friend.id}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-white/10 dark:hover:bg-white/5 transition-all text-sm"
                >
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-primary">
                      {friend.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate text-foreground dark:text-[#f1f5f9]">{friend.name}</p>
                    <p className="text-xs text-muted-foreground dark:text-[#cbd5e1] truncate">{friend.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

