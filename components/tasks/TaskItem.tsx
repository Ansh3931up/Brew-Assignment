'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Flag, Calendar, User } from 'lucide-react';
import type { Task } from '@/types/task';
import { useTaskStore } from '@/stores/TaskStore';
import { useFriendStore } from '@/stores/FriendStore';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const { toggleTaskStatus, toggleFlag } = useTaskStore();
  const { getFriendById } = useFriendStore();

  const assignedFriend = task.assignedTo ? getFriendById(task.assignedTo) : null;

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() === today.getTime()) {
      return 'Today';
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (taskDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    }

    return taskDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: taskDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleTaskStatus(task.id);
  };

  const handleToggleFlag = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFlag(task.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative p-4 rounded-lg border transition-all duration-200',
        'bg-white dark:bg-gray-800',
        'border-gray-200 dark:border-gray-700',
        'hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600',
        task.status === 'completed' && 'opacity-60',
        task.isFlagged && 'border-orange-300 dark:border-orange-600'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggleStatus}
          className={cn(
            'mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all',
            task.status === 'completed'
              ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
          )}
        >
          {task.status === 'completed' && (
            <CheckCircle2 className="w-full h-full text-white" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  'text-base font-semibold text-gray-900 dark:text-gray-100',
                  task.status === 'completed' && 'line-through'
                )}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            {/* Flag button */}
            <button
              onClick={handleToggleFlag}
              className={cn(
                'flex-shrink-0 p-1 rounded transition-colors',
                task.isFlagged
                  ? 'text-orange-500 hover:text-orange-600'
                  : 'text-gray-400 hover:text-orange-500'
              )}
            >
              <Flag className={cn('w-4 h-4', task.isFlagged && 'fill-current')} />
            </button>
          </div>

          {/* Metadata */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {/* Priority */}
            <span
              className={cn(
                'px-2 py-0.5 rounded-full font-medium',
                priorityColors[task.priority]
              )}
            >
              {task.priority}
            </span>

            {/* Status */}
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 font-medium">
              {task.status.replace('-', ' ')}
            </span>

            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}

            {/* Assigned To */}
            {assignedFriend && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{assignedFriend.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
              title="Edit task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task)}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
