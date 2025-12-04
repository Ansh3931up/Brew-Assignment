'use client'
import axios, { type AxiosInstance } from 'axios'

// Lazy API client - don't access env at module evaluation time
// This prevents Server Component errors even when imported from Server Components
let _api: AxiosInstance | null = null

function createApiClient(): AxiosInstance {
  if (!_api) {
    // Use process.env directly - safe in client components
    const url = process.env.NEXT_PUBLIC_API_URL
    if (!url) {
      throw new Error(
        'NEXT_PUBLIC_API_URL is required. Please set it in your .env.local file.'
      )
    }

    _api = axios.create({
      baseURL: url,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    _api.interceptors.request.use(
      (config) => {
        // Add auth token later if needed
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    _api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const message = error?.response?.data?.message || 'API Error'
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

// Export API methods as a simple object with lazy getters
export const api = {
  get get() {
    return getApiClient().get.bind(getApiClient())
  },
  get post() {
    return getApiClient().post.bind(getApiClient())
  },
  get put() {
    return getApiClient().put.bind(getApiClient())
  },
  get delete() {
    return getApiClient().delete.bind(getApiClient())
  },
  get patch() {
    return getApiClient().patch.bind(getApiClient())
  },
  get request() {
    return getApiClient().request.bind(getApiClient())
  }
} as Pick<AxiosInstance, 'get' | 'post' | 'put' | 'delete' | 'patch' | 'request'>
