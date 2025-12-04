import * as Sentry from '@sentry/nextjs'
import type { NextWebVitalsMetric } from 'next/app'

export function reportWebVitals(metric: NextWebVitalsMetric) {
  Sentry.captureMessage('Web Vital', {
    level: 'info',
    extra: metric
  })
}
