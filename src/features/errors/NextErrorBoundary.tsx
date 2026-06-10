import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Home, RefreshCcw, TriangleAlert } from 'lucide-react'
import {
  Component,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react'

type ErrorWithDigest = Error & {
  digest?: string
}

type NextErrorFallbackProps = {
  error: unknown
  info?: {
    componentStack?: string | null
  }
  reset?: () => void
  className?: string
}

type AppErrorBoundaryProps = {
  children: ReactNode
}

type AppErrorBoundaryState = {
  error: Error | null
  info?: ErrorInfo
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  if (typeof error === 'string' && error.trim()) {
    return error
  }

  return 'An unexpected application error occurred.'
}

const getErrorStack = (error: unknown) => {
  if (error instanceof Error) {
    return error.stack
  }

  return undefined
}

const getErrorDigest = (error: unknown) => {
  if (error instanceof Error) {
    return (error as ErrorWithDigest).digest
  }

  return undefined
}

export function NextErrorFallback({
  error,
  info,
  reset,
  className,
}: NextErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(import.meta.env.DEV)
  const message = getErrorMessage(error)
  const stack = getErrorStack(error)
  const digest = getErrorDigest(error)
  const componentStack = info?.componentStack
  const hasDetails = Boolean(message || stack || digest || componentStack)

  return (
    <main
      className={cn(
        'flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <div className="mb-6 flex size-12 items-center justify-center rounded-full border border-destructive/25 bg-destructive/10 text-destructive">
          <TriangleAlert className="size-5" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
          Something went wrong!
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          The application hit an unexpected error while rendering this page.
          Try again, or return home and continue from there.
        </p>

        {digest ? (
          <p className="mt-4 rounded-md border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
            Digest: {digest}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {reset ? (
            <Button onClick={reset}>
              <RefreshCcw data-icon="inline-start" />
              Try again
            </Button>
          ) : null}

          <a
            className={buttonVariants({ variant: 'outline' })}
            href="/"
          >
            <Home data-icon="inline-start" />
            Go home
          </a>
        </div>

        {import.meta.env.DEV && hasDetails ? (
          <div className="mt-8 w-full text-left">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDetails((value) => !value)}
            >
              {showDetails ? (
                <EyeOff data-icon="inline-start" />
              ) : (
                <Eye data-icon="inline-start" />
              )}
              {showDetails ? 'Hide error' : 'Show error'}
            </Button>

            {showDetails ? (
              <pre className="mt-3 max-h-72 overflow-auto rounded-lg border border-destructive/25 bg-destructive/5 p-4 text-xs leading-5 text-destructive">
                <code>
                  {[
                    message,
                    stack,
                    componentStack ? `Component stack:\n${componentStack}` : null,
                  ]
                    .filter(Boolean)
                    .join('\n\n')}
                </code>
              </pre>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  )
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    error: null,
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application error:', error, info)
    this.setState({ info })
  }

  reset = () => {
    this.setState({ error: null, info: undefined })
  }

  render() {
    if (this.state.error) {
      return (
        <NextErrorFallback
          error={this.state.error}
          info={this.state.info}
          reset={this.reset}
        />
      )
    }

    return this.props.children
  }
}
