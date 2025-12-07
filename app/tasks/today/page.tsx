'use client';

import React from 'react';
import { TaskPageLayout } from '@/components/tasks/TaskPageLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { useTodayTasks } from '@/hooks/useTaskFilters';
import type { Task } from '@/types/task';
import { useTaskStore } from '@/stores/TaskStore';

interface TodayPageProps {
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  searchQuery?: string;
}

export default function TodayPage(props: TodayPageProps) {
  const { onDelete, searchQuery = '' } = props;
  const { deleteTask } = useTaskStore();
  const tasks = useTodayTasks(searchQuery);

  const handleDelete = async (task: Task) => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      await deleteTask(task.id);
    }
  };

  return (
    <TaskPageLayout title="Today's Tasks">
      <TaskList
        tasks={tasks}
        onEdit={props.onEdit}
        onDelete={onDelete || handleDelete}
        emptyMessage="No tasks due today. Great job!"
      />
    </TaskPageLayout>
  );
}
