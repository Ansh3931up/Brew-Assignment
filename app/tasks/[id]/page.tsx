'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTaskStore } from '@/stores/TaskStore';
import { useFriendStore } from '@/stores/FriendStore';
import { Button } from '@/components/ui/Button';
import { TaskEditor } from '@/components/tasks/TaskEditor';
import { motion } from 'framer-motion';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getTaskById } = useTaskStore();
  const { getFriendById } = useFriendStore();

  const taskId = params.id as string;
  const task = getTaskById(taskId);

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Task Not Found
          </h1>
          <Button onClick={() => router.push('/tasks')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tasks
          </Button>
        </div>
      </div>
    );
  }

  const assignedFriend = task.assignedTo ? getFriendById(task.assignedTo) : null;

  const formatDate = (date: Date | null): string => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/tasks')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tasks
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {task.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span className={`px-3 py-1 rounded-full ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {task.priority}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                  {task.status.replace('-', ' ')}
                </span>
                {task.isFlagged && (
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    Flagged
                  </span>
                )}
              </div>
            </div>
          </div>

          {task.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {task.dueDate && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Due Date
                </h3>
                <p className="text-gray-900 dark:text-gray-100">
                  {formatDate(task.dueDate)}
                </p>
              </div>
            )}

            {assignedFriend && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Assigned To
                </h3>
                <p className="text-gray-900 dark:text-gray-100">
                  {assignedFriend.name}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Created
              </h3>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Last Updated
              </h3>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(task.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
