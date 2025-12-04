// Simple validation without Zod to avoid Server Component issues
// Zod validation can be done at build time via a separate script if needed

export type Env = {
  NEXT_PUBLIC_API_URL: string
  NEXT_PUBLIC_APP_ENV: 'development' | 'production'
  NEXT_PUBLIC_CLARITY_ID?: string
}

// Normalize APP_ENV value
const normalizeAppEnv = (val: string | undefined): 'development' | 'production' => {
  if (!val) return 'development'
  // Handle case where value might be "development|production" (documentation format)
  if (val.includes('|')) {
    return 'development'
  }
  if (val === 'development' || val === 'production') {
    return val
  }
  return 'development'
}

// Validate URL format
const validateUrl = (url: string | undefined): string => {
  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL is required')
  }
  try {
    new URL(url)
    return url
  } catch {
    throw new Error(`NEXT_PUBLIC_API_URL must be a valid URL. Got: ${url}`)
  }
}

// Lazy getters to avoid execution at module evaluation time
let _apiUrl: string | undefined
let _appEnv: 'development' | 'production' | undefined
let _clarityId: string | undefined

export const env: Env = {
  get NEXT_PUBLIC_API_URL() {
    if (!_apiUrl) {
      _apiUrl = validateUrl(process.env.NEXT_PUBLIC_API_URL)
    }
    return _apiUrl
  },
  get NEXT_PUBLIC_APP_ENV() {
    if (!_appEnv) {
      _appEnv = normalizeAppEnv(process.env.NEXT_PUBLIC_APP_ENV)
    }
    return _appEnv
  },
  get NEXT_PUBLIC_CLARITY_ID() {
    if (_clarityId === undefined) {
      _clarityId = process.env.NEXT_PUBLIC_CLARITY_ID || undefined
    }
    return _clarityId
  }
} as Env
