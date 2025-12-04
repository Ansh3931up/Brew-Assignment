import { toast } from 'react-toastify'
import { soundService } from './sound'

// Initialize sound service on first import
if (typeof window !== 'undefined') {
  soundService.init()
}

export const toastService = {
  success: (message: string) => {
    soundService.success()
    return toast.success(message)
  },
  error: (message: string) => {
    soundService.error()
    return toast.error(message)
  },
  info: (message: string) => {
    soundService.notification()
    return toast.info(message)
  },
  warning: (message: string) => {
    soundService.notification()
    return toast.warning(message)
  },
  default: (message: string) => {
    soundService.notification()
    return toast(message)
  }
}
