export const logger = {
  info: (...msg: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.info('[INFO]', ...msg)
    }
  },
  error: (...msg: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[ERROR]', ...msg)
    }
    // In production, you can send to error tracking service here
  },
  warn: (...msg: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[WARN]', ...msg)
    }
  },
  debug: (...msg: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[DEBUG]', ...msg)
    }
  }
}
