import { api } from './clients';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface FriendRequest {
  id: string;
  requester: User;
  recipient: User;
  status: 'pending' | 'accepted' | 'rejected';
  isSent: boolean;
  createdAt: string;
}

export interface Friend {
  id: string;
  name: string;
  email: string;
  friendshipId: string;
  createdAt: string;
}

// API Response wrapper type
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export const friendService = {
  async searchUsers(email: string): Promise<User[]> {
    const response = await api.get<ApiResponse<User[]>>(`/api/friends/search?email=${encodeURIComponent(email)}`);
    return response.data || [];
  },

  async sendFriendRequest(recipientId: string): Promise<FriendRequest> {
    const response = await api.post<ApiResponse<FriendRequest>>('/api/friends/requests', { recipientId });
    return response.data;
  },

  async getFriendRequests(type?: 'sent' | 'received'): Promise<FriendRequest[]> {
    const url = type
      ? `/api/friends/requests?type=${type}`
      : '/api/friends/requests';
    const response = await api.get<ApiResponse<FriendRequest[]>>(url);
    return response.data || [];
  },

  async acceptFriendRequest(requestId: string): Promise<FriendRequest> {
    const response = await api.put<ApiResponse<FriendRequest>>(`/api/friends/requests/${requestId}/accept`);
    return response.data;
  },

  async rejectFriendRequest(requestId: string): Promise<void> {
    await api.put<ApiResponse<void>>(`/api/friends/requests/${requestId}/reject`);
  },

  async getFriends(): Promise<Friend[]> {
    const response = await api.get<ApiResponse<Friend[]>>('/api/friends');
    return response.data || [];
  },

  async removeFriend(friendshipId: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/api/friends/${friendshipId}`);
  },
};


