'use client'

import { useEffect } from 'react'

export function Clarity() {
  useEffect(() => {
    // Only load Clarity if ID is configured
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID
    if (!clarityId) {
      return
    }

    ;(function (c: Record<string, unknown>, l: Document, a: string, r: string) {
      const clarityFn = c[a] as ((...args: unknown[]) => void) | undefined
      c[a] =
        clarityFn ||
        function (...args: unknown[]) {
          const q = (c[a] as { q?: unknown[] }).q || []
          q.push(...args)
          ;(c[a] as { q: unknown[] }).q = q
        }
      const t = l.createElement(r) as HTMLScriptElement
      t.async = true
      t.src = `https://www.clarity.ms/tag/${clarityId}`
      const y = l.getElementsByTagName(r)[0]
      if (y?.parentNode) {
        y.parentNode.insertBefore(t, y)
      }
    })(window as unknown as Record<string, unknown>, document, 'clarity', 'script')
  }, [])

  return null
}
