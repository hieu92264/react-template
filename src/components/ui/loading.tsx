import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

type LoadingProps = {
  /** Show as fullscreen overlay */
  overlay?: boolean
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Custom label below the spinner */
  label?: string
  /** Extra className */
  className?: string
}

const sizeMap = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
  xl: 'size-10',
}

/**
 * Loading — spinner component (matches vue-template loading style)
 *
 * Usage:
 *   <Loading />                          // inline spinner
 *   <Loading overlay />                  // fullscreen overlay
 *   <Loading overlay label="Đang tải" /> // with label
 *   <Loading size="lg" />
 */
export function Loading({ overlay = false, size = 'md', label, className }: LoadingProps) {
  if (overlay) {
    return (
      <div
        className={cn(
          'fixed inset-0 z-[200] flex flex-col items-center justify-center gap-3',
          'bg-background/70 backdrop-blur-sm',
          className,
        )}
        aria-busy="true"
        aria-label={label ?? 'Đang tải...'}
      >
        <Loader2 className={cn('animate-spin text-primary', sizeMap[size])} />
        {label && (
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
        )}
      </div>
    )
  }

  return (
    <span
      className={cn('inline-flex items-center gap-2', className)}
      aria-busy="true"
      aria-label={label ?? 'Đang tải...'}
    >
      <Loader2 className={cn('animate-spin text-primary', sizeMap[size])} />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </span>
  )
}

/**
 * PageLoading — full page centered loading state (for suspense/lazy pages)
 */
export function PageLoading({ label = 'Đang tải...' }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
