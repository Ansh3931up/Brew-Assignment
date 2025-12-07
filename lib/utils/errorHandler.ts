/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object') {
    const err = error as { message?: string; error?: string; response?: { data?: { message?: string; error?: string } } };
    return err.response?.data?.message || 
           err.response?.data?.error || 
           err.message || 
           err.error || 
           'An unexpected error occurred';
  }
  return 'An unexpected error occurred';
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes('rate limit') || 
         message.includes('too many requests') || 
         message.includes('429');
}
