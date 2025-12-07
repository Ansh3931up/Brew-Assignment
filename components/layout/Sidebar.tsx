'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  CheckCircle2,
  Flag,
  List,
  Users,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/stores/TaskStore';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: 'all', label: 'All Tasks', href: '/tasks', icon: List },
  { id: 'today', label: 'Today', href: '/today', icon: Calendar },
  { id: 'scheduled', label: 'Scheduled', href: '/scheduled', icon: Clock },
  { id: 'flagged', label: 'Flagged', href: '/flagged', icon: Flag },
  { id: 'completed', label: 'Completed', href: '/completed', icon: CheckCircle2 },
  { id: 'friends', label: 'Friends', href: '/friends', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { tasks } = useTaskStore();

  const getTaskCount = (itemId: string): number => {
    switch (itemId) {
      case 'all':
        return tasks.length;
      case 'today': {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return tasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        }).length;
      }
      case 'scheduled': {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return tasks.filter(task => {
          if (!task.dueDate) return false;
          return new Date(task.dueDate) > today;
        }).length;
      }
      case 'flagged':
        return tasks.filter(task => task.isFlagged).length;
      case 'completed':
        return tasks.filter(task => task.status === 'completed').length;
      case 'friends':
        return tasks.filter(task => task.assignedTo !== null).length;
      default:
        return 0;
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Task Manager
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/tasks' && pathname === '/');
            const count = getTaskCount(item.id);

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-lg transition-colors',
                    'text-gray-700 dark:text-gray-300',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    isActive && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {count > 0 && (
                    <span
                      className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full',
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      )}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
