import { useAppStore } from '@/shared/stores/app.store'
import { cn } from '@/lib/utils'

/**
 * PageProgress — thin top progress bar (like vue-template `app.store.isPageLoading`)
 * Renders a looping shimmer bar at the top of the page when `isPageLoading` is true.
 */
export function PageProgress() {
  const isPageLoading = useAppStore((s) => s.isPageLoading)

  if (!isPageLoading) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden">
      <div className="page-progress-bar h-full w-full origin-left bg-primary" />
    </div>
  )
}

/**
 * Inline progress bar — shadcn style, used for data loading inside pages.
 */
type ProgressProps = {
  value?: number // 0–100, undefined = indeterminate
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
}

export function Progress({ value, className, size = 'md' }: ProgressProps) {
  const isIndeterminate = value === undefined

  return (
    <div
      role="progressbar"
      aria-valuenow={isIndeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        'relative w-full overflow-hidden rounded-full bg-primary/20',
        sizeMap[size],
        className,
      )}
    >
      {isIndeterminate ? (
        <div className="progress-indeterminate absolute inset-y-0 w-1/2 rounded-full bg-primary" />
      ) : (
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      )}
    </div>
  )
}
