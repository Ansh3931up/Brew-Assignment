'use client'
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { getBaseURL } from './utils'

// Lazy API client - don't access env at module evaluation time
// This prevents Server Component errors even when imported from Server Components
let _api: AxiosInstance | null = null

function createApiClient(): AxiosInstance {
  if (!_api) {
    // Use getBaseURL helper to ensure consistent base URL across all requests
    const baseURL = getBaseURL()

    _api = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    _api.interceptors.request.use(
      (config) => {
        // Add auth token from localStorage
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token')
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    _api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        // Handle 401 - Unauthorized (token expired or invalid)
        if (error?.response?.status === 401) {
          // Clear token and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('current_user')
            window.location.href = '/login'
          }
        }

        const message = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'API Error'
        return Promise.reject(new Error(message))
      }
    )
  }
  return _api
}

// Simple lazy getter function - avoids Proxy and Object.defineProperty deprecation warnings
function getApiClient(): AxiosInstance {
  return createApiClient()
}

// Typed API wrapper - the interceptor extracts response.data, so we return T directly
export const api = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return getApiClient().get<T>(url, config) as Promise<T>
  },
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return getApiClient().post<T>(url, data, config) as Promise<T>
  },
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return getApiClient().put<T>(url, data, config) as Promise<T>
  },
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return getApiClient().delete<T>(url, config) as Promise<T>
  },
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return getApiClient().patch<T>(url, data, config) as Promise<T>
  },
  request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    return getApiClient().request<T>(config) as Promise<T>
  }
}
