import { queryClient } from '@/app/query-client'
import { ForbiddenPage } from '@/features/errors/ForbiddenPage'
import { MaintenancePage } from '@/features/errors/MaintenancePage'
import { NotFoundPage } from '@/features/errors/NotFoundPage'
import { ServerErrorPage } from '@/features/errors/ServerErrorPage'
import { routeTree } from '@/routeTree.gen'
import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'

export type RouterContext = {
  queryClient: QueryClient
}

type ErrorWithStatus = Error & {
  status?: number
  statusCode?: number
  response?: {
    status?: number
  }
}

const getErrorStatus = (error: unknown) => {
  if (!(error instanceof Error)) {
    return undefined
  }

  const errorWithStatus = error as ErrorWithStatus

  return (
    errorWithStatus.status ??
    errorWithStatus.statusCode ??
    errorWithStatus.response?.status
  )
}

function RouterErrorPage({ error }: { error: Error }) {
  console.error('Router error:', error)

  const status = getErrorStatus(error)

  if (status === 403) {
    return <ForbiddenPage />
  }

  if (status === 404) {
    return <NotFoundPage />
  }

  if (status === 503) {
    return <MaintenancePage />
  }

  return <ServerErrorPage />
}

export const createAppRouter = (queryClient: QueryClient) => {
  return createRouter({
    routeTree,
    context: {
      queryClient,
    } satisfies RouterContext,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    defaultErrorComponent: RouterErrorPage,
    defaultNotFoundComponent: NotFoundPage,
  })
}

export const router = createAppRouter(queryClient)

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
