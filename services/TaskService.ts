import type { Task, CreateTaskData, UpdateTaskData } from '@/types/task';

const STORAGE_KEY = 'task_manager_tasks';

// Helper to serialize/deserialize dates
const serializeTask = (task: Task): string => {
  return JSON.stringify({
    ...task,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  });
};

const deserializeTask = (data: {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate: string | null;
  isFlagged: boolean;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}): Task => {
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    priority: data.priority as Task['priority'],
    status: data.status as Task['status'],
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    isFlagged: data.isFlagged,
    assignedTo: data.assignedTo,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
};

const loadTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const tasks = JSON.parse(stored);
    return tasks.map(deserializeTask);
  } catch {
    return [];
  }
};

const saveTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const serialized = tasks.map(serializeTask);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch {
    // Silently fail if localStorage is not available
  }
};

export class TaskService {
  private static instance: TaskService;
  private tasks: Task[] = [];

  private constructor() {
    this.tasks = loadTasks();
  }

  static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  getTaskById(id: string): Task | null {
    return this.tasks.find(task => task.id === id) || null;
  }

  createTask(data: CreateTaskData): Task {
    // Validation
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Title is required');
    }

    const now = new Date();
    const task: Task = {
      id: crypto.randomUUID(),
      title: data.title.trim(),
      description: data.description?.trim() || '',
      priority: data.priority || 'medium',
      status: data.status || 'todo',
      dueDate: data.dueDate || null,
      isFlagged: data.isFlagged || false,
      assignedTo: data.assignedTo || null,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.push(task);
    saveTasks(this.tasks);
    return task;
  }

  updateTask(data: UpdateTaskData): Task {
    const task = this.getTaskById(data.id);
    if (!task) {
      throw new Error(`Task with id ${data.id} not found`);
    }

    // Validation
    if (data.title !== undefined && data.title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }

    const updated: Task = {
      ...task,
      ...(data.title !== undefined && { title: data.title.trim() }),
      ...(data.description !== undefined && { description: data.description.trim() }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
      ...(data.isFlagged !== undefined && { isFlagged: data.isFlagged }),
      ...(data.assignedTo !== undefined && { assignedTo: data.assignedTo }),
      updatedAt: new Date(),
    };

    const index = this.tasks.findIndex(t => t.id === data.id);
    this.tasks[index] = updated;
    saveTasks(this.tasks);
    return updated;
  }

  deleteTask(id: string): void {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }

    this.tasks.splice(index, 1);
    saveTasks(this.tasks);
  }

  // Helper methods
  toggleTaskStatus(id: string): Task {
    const task = this.getTaskById(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    const newStatus: Task['status'] = 
      task.status === 'completed' ? 'todo' : 
      task.status === 'todo' ? 'in-progress' : 
      'completed';

    return this.updateTask({ id, status: newStatus });
  }

  toggleFlag(id: string): Task {
    const task = this.getTaskById(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    return this.updateTask({ id, isFlagged: !task.isFlagged });
  }

  // Clear all tasks (useful for testing)
  clearAll(): void {
    this.tasks = [];
    saveTasks(this.tasks);
  }
}

export const taskService = TaskService.getInstance();
