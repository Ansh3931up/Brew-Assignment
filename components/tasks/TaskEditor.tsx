'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Task, CreateTaskData, TaskPriority, TaskStatus } from '@/types/task';
import { useTaskStore } from '@/stores/TaskStore';
import { useFriendStore } from '@/stores/FriendStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';

interface TaskEditorProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

export function TaskEditor({ isOpen, onClose, task }: TaskEditorProps) {
  const { createTask, updateTask } = useTaskStore();
  const { friends } = useFriendStore();

  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: null,
    isFlagged: false,
    assignedTo: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
        isFlagged: task.isFlagged,
        assignedTo: task.assignedTo,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: null,
        isFlagged: false,
        assignedTo: null,
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (task) {
        await updateTask({ id: task.id, ...formData });
      } else {
        await createTask(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save task' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateTaskData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const friendOptions = [
    { value: '', label: 'None' },
    ...friends.map(friend => ({ value: friend.id, label: friend.name })),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {task ? 'Edit Task' : 'Create New Task'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {/* Title */}
                  <Input
                    label="Title *"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    error={errors.title}
                    placeholder="Enter task title"
                    autoFocus
                  />

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Enter task description"
                    />
                  </div>

                  {/* Priority and Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Priority"
                      value={formData.priority}
                      onChange={(e) => handleChange('priority', e.target.value as TaskPriority)}
                      options={priorityOptions}
                    />

                    <Select
                      label="Status"
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value as TaskStatus)}
                      options={statusOptions}
                    />
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : null;
                        handleChange('dueDate', date);
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>

                  {/* Assigned To */}
                  <Select
                    label="Assign To"
                    value={formData.assignedTo || ''}
                    onChange={(e) => handleChange('assignedTo', e.target.value || null)}
                    options={friendOptions}
                  />

                  {/* Flagged */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="flagged"
                      checked={formData.isFlagged}
                      onChange={(e) => handleChange('isFlagged', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label htmlFor="flagged" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Flag this task
                    </label>
                  </div>

                  {errors.submit && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
                    </div>
                  )}
                </div>
              </form>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {task ? 'Update Task' : 'Create Task'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
