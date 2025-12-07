'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { TaskEditor } from './TaskEditor';
import { FloatingAddButton } from './FloatingAddButton';
import type { Task } from '@/types/task';

interface TaskPageLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function TaskPageLayout({ children, title }: TaskPageLayoutProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTask = () => {
    setEditingTask(null);
    setIsEditorOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditorOpen(true);
  };

  const handleDeleteTask = async (task: Task) => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      // This will be handled by the page component
    }
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          onAddTask={handleAddTask}
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {title && (
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {title}
            </h1>
          )}
          {React.cloneElement(children as React.ReactElement, {
            onEdit: handleEditTask,
            onDelete: handleDeleteTask,
            searchQuery,
          })}
        </main>
      </div>

      <TaskEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        task={editingTask}
      />

      <FloatingAddButton onClick={handleAddTask} />
    </div>
  );
}
