import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

export const dynamic = 'force-dynamic'

class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message)
    this.name = 'SentryExampleAPIError'
  }
}

// A faulty API route to test Sentry's error monitoring
export async function GET() {
  try {
    // Capture the error with Sentry before throwing
    const error = new SentryExampleAPIError(
      'This error is raised on the backend called by the example page.'
    )

    // Capture exception with Sentry
    Sentry.captureException(error, {
      tags: {
        section: 'sentry-example-api',
        type: 'test-error'
      }
    })

    // Return error response instead of throwing to prevent console spam
    return NextResponse.json(
      {
        error: 'SentryExampleAPIError',
        message: error.message,
        sentToSentry: true
      },
      { status: 500 }
    )
  } catch (error) {
    // Fallback error handling
    Sentry.captureException(error)
    return NextResponse.json(
      { error: 'Internal Server Error', sentToSentry: true },
      { status: 500 }
    )
  }
}
