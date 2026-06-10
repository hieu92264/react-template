import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { PageProgress } from '@/components/ui/progress'

export const Route = createRootRoute({
  component: () => (
    <>
      <PageProgress />
      <Outlet />
      <Toaster theme="system" position="top-right" closeButton richColors />
      <TanStackRouterDevtools />
    </>
  ),
})
