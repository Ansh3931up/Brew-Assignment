'use client';

import React, { useState } from 'react';
import { TaskPageLayout } from '@/components/tasks/TaskPageLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import type { Task } from '@/types/task';
import { useTaskStore } from '@/stores/TaskStore';

interface TasksPageProps {
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  searchQuery?: string;
}

export default function TasksPage(props: TasksPageProps) {
  const { onDelete, searchQuery = '' } = props;
  const { deleteTask } = useTaskStore();
  const tasks = useTaskFilters({ search: searchQuery });

  const handleDelete = async (task: Task) => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      await deleteTask(task.id);
    }
  };

  return (
    <TaskPageLayout title="All Tasks">
      <TaskList
        tasks={tasks}
        onEdit={props.onEdit}
        onDelete={onDelete || handleDelete}
        emptyMessage="No tasks found. Create your first task!"
      />
    </TaskPageLayout>
  );
}
