'use client';

import React, { useState } from 'react';
import { TaskPageLayout } from '@/components/tasks/TaskPageLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { useFriendStore } from '@/stores/FriendStore';
import { useTaskStore } from '@/stores/TaskStore';
import { Select } from '@/components/ui/Select';
import type { Task } from '@/types/task';

interface FriendsPageProps {
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  searchQuery?: string;
}

export default function FriendsPage(props: FriendsPageProps) {
  const { onDelete, searchQuery = '' } = props;
  const { friends } = useFriendStore();
  const { deleteTask, tasks } = useTaskStore();
  const [selectedFriend, setSelectedFriend] = useState<string>('all');

  // Get all tasks assigned to friends or by friends
  const allAssignedTasks = tasks.filter(task => task.assignedTo !== null);
  const filteredTasks = selectedFriend === 'all'
    ? allAssignedTasks
    : allAssignedTasks.filter(task => task.assignedTo === selectedFriend);

  const friendOptions = [
    { value: 'all', label: 'All Friends' },
    ...friends.map(friend => ({ value: friend.id, label: friend.name })),
  ];

  const handleDelete = async (task: Task) => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      await deleteTask(task.id);
    }
  };

  return (
    <TaskPageLayout title="Friends Tasks">
      <div className="mb-6">
        <Select
          label="Filter by Friend"
          value={selectedFriend}
          onChange={(e) => setSelectedFriend(e.target.value)}
          options={friendOptions}
          className="max-w-xs"
        />
      </div>
      <TaskList
        tasks={filteredTasks}
        onEdit={props.onEdit}
        onDelete={onDelete || handleDelete}
        emptyMessage="No tasks assigned to friends. Assign tasks to collaborate!"
      />
    </TaskPageLayout>
  );
}
