export const logger = {
  info: (...msg: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[INFO]', ...msg)
    }
  },
  error: (...msg: unknown[]) => {
    console.error('[ERROR]', ...msg)
  }
}
