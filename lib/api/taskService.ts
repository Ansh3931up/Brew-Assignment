import { api } from './clients';
import { logger } from '@/lib/utils/logger';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'active' | 'completed';
  flagged: boolean;
  assignedBy?: string;
  assignedByEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  status?: 'todo' | 'active' | 'completed';
  search?: string;
  priority?: 'low' | 'medium' | 'high';
  flagged?: boolean;
  all?: boolean;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'todo' | 'active' | 'completed';
  flagged?: boolean;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'todo' | 'active' | 'completed';
  flagged?: boolean;
}

// API Response wrapper type
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export const taskService = {
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    logger.info('[taskService.getTasks] Called with filters:', filters);
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.flagged !== undefined) params.append('flagged', String(filters.flagged));
    if (filters?.all) params.append('all', 'true');

    const queryString = params.toString();
    const url = queryString ? `/api/tasks?${queryString}` : '/api/tasks';
    logger.info('[taskService.getTasks] Making API call to:', url);
    const response = await api.get<ApiResponse<Task[]>>(url);
    logger.info('[taskService.getTasks] Received response:', response);
    
    // Handle response structure - could be ApiResponse or direct array
    if (!response) {
      logger.error('getTasks: No response received');
      return [];
    }
    
    // If response is already an array, return it directly
    if (Array.isArray(response)) {
      return response;
    }
    
    // If response has data property, use it
    if (response.data) {
      if (Array.isArray(response.data)) {
        return response.data;
      }
      logger.error('getTasks: Response data is not an array', response.data);
      return [];
    }
    
    logger.error('getTasks: Unexpected response structure', response);
    return [];
  },

  async getAssignedTasks(): Promise<Task[]> {
    logger.info('[taskService.getAssignedTasks] Making API call');
    const response = await api.get<ApiResponse<Task[]>>('/api/tasks/assigned');
    logger.info('[taskService.getAssignedTasks] Received response:', response);
    
    if (!response) {
      logger.error('getAssignedTasks: No response received');
      return [];
    }
    
    // If response is already an array, return it directly
    if (Array.isArray(response)) {
      return response;
    }
    
    // If response has data property, use it
    if (response.data) {
      if (Array.isArray(response.data)) {
        return response.data;
      }
      logger.error('getAssignedTasks: Response data is not an array', response.data);
      return [];
    }
    
    logger.error('getAssignedTasks: Unexpected response structure', response);
    return [];
  },

  async getCompletedTasks(search?: string): Promise<Task[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const queryString = params.toString();
    const url = queryString ? `/api/tasks/completed?${queryString}` : '/api/tasks/completed';
    const response = await api.get<ApiResponse<Task[]>>(url);
    
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    
    logger.error('getCompletedTasks: Invalid response', response);
    return [];
  },

  async getScheduledTasks(search?: string): Promise<Task[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const queryString = params.toString();
    const url = queryString ? `/api/tasks/scheduled?${queryString}` : '/api/tasks/scheduled';
    const response = await api.get<ApiResponse<Task[]>>(url);
    
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    
    logger.error('getScheduledTasks: Invalid response', response);
    return [];
  },

  async getFlaggedTasks(search?: string): Promise<Task[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const queryString = params.toString();
    const url = queryString ? `/api/tasks/flagged?${queryString}` : '/api/tasks/flagged';
    const response = await api.get<ApiResponse<Task[]>>(url);
    
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    
    logger.error('getFlaggedTasks: Invalid response', response);
    return [];
  },

  async getTodayTasks(search?: string): Promise<Task[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const queryString = params.toString();
    const url = queryString ? `/api/tasks/today?${queryString}` : '/api/tasks/today';
    const response = await api.get<ApiResponse<Task[]>>(url);
    
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    
    logger.error('getTodayTasks: Invalid response', response);
    return [];
  },

  async getMissedTasks(search?: string): Promise<Task[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const queryString = params.toString();
    const url = queryString ? `/api/tasks/missed?${queryString}` : '/api/tasks/missed';
    const response = await api.get<ApiResponse<Task[]>>(url);
    
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    
    logger.error('getMissedTasks: Invalid response', response);
    return [];
  },

  async getTaskById(id: string): Promise<Task> {
    const response = await api.get<ApiResponse<Task>>(`/api/tasks/${id}`);
    if (!response?.data) {
      throw new Error('Task not found');
    }
    return response.data;
  },

  async createTask(data: CreateTaskData): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>('/api/tasks', data);
    if (!response?.data) {
      throw new Error('Failed to create task');
    }
    return response.data;
  },

  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    const response = await api.put<ApiResponse<Task>>(`/api/tasks/${id}`, data);
    if (!response?.data) {
      throw new Error('Failed to update task');
    }
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/api/tasks/${id}`);
  },

  async assignTaskToFriend(taskId: string, friendId: string): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>(`/api/tasks/${taskId}/assign`, { friendId });
    if (!response?.data) {
      throw new Error('Failed to assign task');
    }
    return response.data;
  },
  async searchAllTasks(query: string): Promise<Task[]> {
    const response = await api.get<ApiResponse<Task[]>>('/api/tasks/search', {
      params: { search: query },
    });
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    logger.error('searchAllTasks: Invalid response', response);
    return [];
  },
};

export interface DashboardStats {
  all: number;
  today: number;
  scheduled: number;
  flagged: number;
  completed: number;
  friends: number;
  missed: number;
}

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<ApiResponse<DashboardStats>>('/api/dashboard/stats');
    if (!response?.data) {
      throw new Error('Failed to fetch dashboard stats');
    }
    return response.data;
  },
};


