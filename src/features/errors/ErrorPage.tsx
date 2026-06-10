import { buttonVariants } from '@/components/ui/button-variants'
import { Link } from '@tanstack/react-router'

type ErrorPageProps = {
  code: string
  title: string
  description: string
  actionLabel?: string
  actionTo?: string
}

export function ErrorPage({
  code,
  title,
  description,
  actionLabel = 'Về trang chủ',
  actionTo = '/',
}: ErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="mx-auto max-w-md text-center">
        <p className="text-sm font-medium text-muted-foreground">{code}</p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">{title}</h1>

        <p className="mt-4 text-muted-foreground">{description}</p>

        <Link className={buttonVariants({ className: 'mt-8' })} to={actionTo}>
          {actionLabel}
        </Link>
      </div>
    </main>
  )
}
