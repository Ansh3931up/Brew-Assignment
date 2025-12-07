import { useMemo } from 'react';
import type { Task, TaskFilters, TaskSortOption } from '@/types/task';
import { useTaskStore } from '@/stores/TaskStore';

export function useTaskFilters(filters: TaskFilters, sort?: TaskSortOption) {
  const { tasks } = useTaskStore();

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      result = result.filter(task => task.status === filters.status);
    }

    if (filters.priority && filters.priority !== 'all') {
      result = result.filter(task => task.priority === filters.priority);
    }

    if (filters.isFlagged !== undefined) {
      result = result.filter(task => task.isFlagged === filters.isFlagged);
    }

    if (filters.assignedTo !== undefined) {
      if (filters.assignedTo === null) {
        result = result.filter(task => task.assignedTo === null);
      } else {
        result = result.filter(task => task.assignedTo === filters.assignedTo);
      }
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        task =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by due date
    if (filters.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (filters.dueDate === 'today') {
        result = result.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
      } else if (filters.dueDate === 'scheduled') {
        result = result.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate > today;
        });
      }
    }

    // Apply sorting
    if (sort) {
      result.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sort.field) {
          case 'dueDate':
            aValue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
            bValue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
            break;
          case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            aValue = priorityOrder[a.priority];
            bValue = priorityOrder[b.priority];
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [tasks, filters, sort]);

  return filteredAndSortedTasks;
}

// Helper hook for specific views
export function useTodayTasks(search?: string) {
  return useTaskFilters({ dueDate: 'today', search });
}

export function useScheduledTasks(search?: string) {
  return useTaskFilters({ dueDate: 'scheduled', search });
}

export function useFlaggedTasks(search?: string) {
  return useTaskFilters({ isFlagged: true, search });
}

export function useCompletedTasks(search?: string) {
  return useTaskFilters({ status: 'completed', search });
}

export function useAssignedTasks(assignedTo: string, search?: string) {
  return useTaskFilters({ assignedTo, search });
}
