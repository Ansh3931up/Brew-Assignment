import { describe, it, expect, jest, beforeEach } from '@jest/globals'

// Create mock functions that return promises
const mockPost = jest.fn()
const mockGet = jest.fn()

// Mock axios completely
const mockAxiosInstance = {
  post: mockPost,
  get: mockGet,
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  request: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(() => {
        // Store and use the success handler
        return 0
      }),
    },
    response: {
      use: jest.fn(() => {
        // The success handler extracts response.data
        // We'll apply this in our mock
        return 1
      }),
    },
  },
}

// Mock axios module
jest.mock('axios', () => ({
  default: {
    create: jest.fn(() => mockAxiosInstance),
  },
}))

// Now we need to mock the clients module
// But we need to make sure it uses our mocked axios
// The tricky part is the api object uses getters
jest.mock('@/lib/api/clients', () => {
  // Apply the response interceptor logic manually in our mock
  // The interceptor returns response.data
  const createMockApiMethod = (method: jest.Mock) => {
    return (...args: unknown[]) => {
      return (method(...args) as Promise<{ data?: unknown }>).then((response: { data?: unknown }) => {
        // Simulate the interceptor: return response.data
        return response.data || response
      })
    }
  }
  
  return {
    api: {
      get post() {
        return createMockApiMethod(mockPost)
      },
      get get() {
        return createMockApiMethod(mockGet)
      },
      get put() {
        return jest.fn()
      },
      get delete() {
        return jest.fn()
      },
      get patch() {
        return jest.fn()
      },
      get request() {
        return jest.fn()
      },
    },
  }
})

// Import after mocks
import { authService } from '@/lib/api/authService'

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPost.mockClear()
    mockGet.mockClear()
  })

  describe('register', () => {
    it('should call register API with correct data', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@example.com' },
        token: 'mock-token',
      }
      
      // Return response object, interceptor will extract .data
      mockPost.mockResolvedValue({ data: mockResponse })

      const result = await authService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })

      expect(mockPost).toHaveBeenCalledWith('/api/auth/register', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('login', () => {
    it('should call login API with correct credentials', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@example.com' },
        token: 'mock-token',
      }
      
      mockPost.mockResolvedValue({ data: mockResponse })

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(mockPost).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result).toEqual(mockResponse)
    })
  })
})

