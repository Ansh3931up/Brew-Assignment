/**
 * Utility functions for API client
 */

/**
 * Get the base URL for API requests
 * Uses NEXT_PUBLIC_API_URL environment variable or defaults to localhost:3001
 * Removes trailing slashes to prevent URL issues
 */
export const getBaseURL = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  // Remove trailing slash if present
  return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
};
