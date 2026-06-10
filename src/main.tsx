import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { router } from '@/app/router'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/app/query-client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { setupAxiosInterceptors } from '@/shared/api/axios'
import { AppErrorBoundary } from '@/features/errors/NextErrorBoundary'

// Initialize Axios interceptors for handling authentication and API requests
setupAxiosInterceptors()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      </QueryClientProvider>
    </AppErrorBoundary>
  </StrictMode>,
)
