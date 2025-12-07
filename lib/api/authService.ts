import { api } from './clients';
import { API_ENDPOINTS } from '../constants/urls';
import { getBaseURL } from './utils';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      createdAt: string;
    };
    token: string;
  };
  message?: string;
  timestamp?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface GetCurrentUserResponse {
  success: boolean;
  data: {
    user: UserResponse;
  };
  message?: string;
  timestamp?: string;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    return api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  async login(data: LoginData): Promise<AuthResponse> {
    return api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  async getCurrentUser(): Promise<GetCurrentUserResponse> {
    return api.get<GetCurrentUserResponse>(API_ENDPOINTS.AUTH.ME);
  },

  async logout(): Promise<{ message: string }> {
    return api.post<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT);
  },

  getGoogleAuthUrl(): string {
    const baseURL = getBaseURL();
    return `${baseURL}${API_ENDPOINTS.AUTH.GOOGLE}`;
  },

  async checkGoogleAuthStatus(): Promise<{ enabled: boolean }> {
    const baseURL = getBaseURL();
    const response = await fetch(`${baseURL}${API_ENDPOINTS.AUTH.GOOGLE_STATUS}`);
    if (!response.ok) {
      return { enabled: false };
    }
    return response.json();
  },
};


