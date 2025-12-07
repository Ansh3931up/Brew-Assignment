'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Moon, Sun, Plus } from 'lucide-react';
import { useThemeStore } from '@/stores/ThemeStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onAddTask?: () => void;
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export function Navbar({ onAddTask, onSearchChange, searchQuery = '' }: NavbarProps) {
  const { mode, toggle } = useThemeStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <nav className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors',
              isSearchFocused
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-400 dark:text-gray-500'
            )}
          />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {mode === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Add Task Button */}
        {onAddTask && (
          <Button onClick={onAddTask} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        )}
      </div>
    </nav>
  );
}
