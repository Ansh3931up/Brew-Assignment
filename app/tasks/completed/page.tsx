'use client';

import React from 'react';
import { TaskPageLayout } from '@/components/tasks/TaskPageLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { useCompletedTasks } from '@/hooks/useTaskFilters';
import type { Task } from '@/types/task';
import { useTaskStore } from '@/stores/TaskStore';

interface CompletedPageProps {
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  searchQuery?: string;
}

export default function CompletedPage(props: CompletedPageProps) {
  const { onDelete, searchQuery = '' } = props;
  const { deleteTask } = useTaskStore();
  const tasks = useCompletedTasks(searchQuery);

  const handleDelete = async (task: Task) => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      await deleteTask(task.id);
    }
  };

  return (
    <TaskPageLayout title="Completed Tasks">
      <TaskList
        tasks={tasks}
        onEdit={props.onEdit}
        onDelete={onDelete || handleDelete}
        emptyMessage="No completed tasks yet. Complete some tasks to see them here!"
      />
    </TaskPageLayout>
  );
}
