export type RootState = {
  auth: {
    user: Record<string, unknown>
    loading: boolean
    error: string
  }
}
