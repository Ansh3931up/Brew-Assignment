'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Task, CreateTaskData, UpdateTaskData } from '@/types/task';
import { taskService } from '@/services/TaskService';

interface TaskStoreContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  // Actions
  loadTasks: () => void;
  createTask: (data: CreateTaskData) => Promise<Task>;
  updateTask: (data: UpdateTaskData) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<Task>;
  toggleFlag: (id: string) => Promise<Task>;
  getTaskById: (id: string) => Task | null;
}

const TaskStoreContext = createContext<TaskStoreContextType | undefined>(undefined);

export function TaskStoreProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      const allTasks = taskService.getAllTasks();
      setTasks(allTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data: CreateTaskData): Promise<Task> => {
    setError(null);
    try {
      const newTask = taskService.createTask(data);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (data: UpdateTaskData): Promise<Task> => {
    setError(null);
    try {
      const updated = taskService.updateTask(data);
      setTasks(prev => prev.map(task => task.id === data.id ? updated : task));
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    setError(null);
    try {
      taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
      throw err;
    }
  }, []);

  const toggleTaskStatus = useCallback(async (id: string): Promise<Task> => {
    setError(null);
    try {
      const updated = taskService.toggleTaskStatus(id);
      setTasks(prev => prev.map(task => task.id === id ? updated : task));
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to toggle task status';
      setError(message);
      throw err;
    }
  }, []);

  const toggleFlag = useCallback(async (id: string): Promise<Task> => {
    setError(null);
    try {
      const updated = taskService.toggleFlag(id);
      setTasks(prev => prev.map(task => task.id === id ? updated : task));
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to toggle flag';
      setError(message);
      throw err;
    }
  }, []);

  const getTaskById = useCallback((id: string): Task | null => {
    return tasks.find(task => task.id === id) || null;
  }, [tasks]);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const value: TaskStoreContextType = {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    toggleFlag,
    getTaskById,
  };

  return (
    <TaskStoreContext.Provider value={value}>
      {children}
    </TaskStoreContext.Provider>
  );
}

export function useTaskStore() {
  const context = useContext(TaskStoreContext);
  if (context === undefined) {
    throw new Error('useTaskStore must be used within a TaskStoreProvider');
  }
  return context;
}
