export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date | null;
  isFlagged: boolean;
  assignedTo: string | null; // friend userId
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date | null;
  isFlagged?: boolean;
  assignedTo?: string | null;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: string;
}

export interface TaskFilters {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  isFlagged?: boolean;
  assignedTo?: string | null;
  search?: string;
  dueDate?: 'today' | 'scheduled' | 'all';
}

export interface TaskSortOption {
  field: 'dueDate' | 'priority' | 'createdAt' | 'title';
  direction: 'asc' | 'desc';
}
