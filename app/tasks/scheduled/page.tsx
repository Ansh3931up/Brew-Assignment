'use client';

import React from 'react';
import { TaskPageLayout } from '@/components/tasks/TaskPageLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { useScheduledTasks } from '@/hooks/useTaskFilters';
import type { Task } from '@/types/task';
import { useTaskStore } from '@/stores/TaskStore';

interface ScheduledPageProps {
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  searchQuery?: string;
}

export default function ScheduledPage(props: ScheduledPageProps) {
  const { onDelete, searchQuery = '' } = props;
  const { deleteTask } = useTaskStore();
  const tasks = useScheduledTasks(searchQuery);

  const handleDelete = async (task: Task) => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      await deleteTask(task.id);
    }
  };

  return (
    <TaskPageLayout title="Scheduled Tasks">
      <TaskList
        tasks={tasks}
        onEdit={props.onEdit}
        onDelete={onDelete || handleDelete}
        emptyMessage="No scheduled tasks. Add a due date to schedule tasks!"
      />
    </TaskPageLayout>
  );
}
