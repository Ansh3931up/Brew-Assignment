'use client'

import { useEffect } from 'react'
import { useTheme } from '@/providers/theme-provider'
import { toastService } from '@/lib/utils/toast'

export function useKeyboardNavigation() {
  const { toggle } = useTheme()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + T - Toggle theme
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault()
        toggle()
        toastService.info('Theme toggled!')
      }

      // Ctrl/Cmd + / - Show keyboard shortcuts help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        toastService.info(
          'Keyboard Shortcuts: Ctrl+Shift+T (Theme), Ctrl+/ (Help), Escape (Close)'
        )
      }

      // Escape key - can be used to close modals/dropdowns
      if (e.key === 'Escape') {
        // Add custom escape handlers here if needed
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggle])
}
