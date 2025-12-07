'use client';

import React from 'react';
import { TaskPageLayout } from '@/components/tasks/TaskPageLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { useFlaggedTasks } from '@/hooks/useTaskFilters';
import type { Task } from '@/types/task';
import { useTaskStore } from '@/stores/TaskStore';

interface FlaggedPageProps {
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  searchQuery?: string;
}

export default function FlaggedPage(props: FlaggedPageProps) {
  const { onDelete, searchQuery = '' } = props;
  const { deleteTask } = useTaskStore();
  const tasks = useFlaggedTasks(searchQuery);

  const handleDelete = async (task: Task) => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      await deleteTask(task.id);
    }
  };

  return (
    <TaskPageLayout title="Flagged Tasks">
      <TaskList
        tasks={tasks}
        onEdit={props.onEdit}
        onDelete={onDelete || handleDelete}
        emptyMessage="No flagged tasks. Flag important tasks to see them here!"
      />
    </TaskPageLayout>
  );
}
