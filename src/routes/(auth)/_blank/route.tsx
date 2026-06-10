import { BlankLayout } from '@/components/layouts/BlankLayout'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { createFileRoute, Outlet, useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/(auth)/_blank')({
  component: AuthBlankRoute,
})

function AuthBlankRoute() {
  const token = useAuthStore((state) => state.accessToken)
  const navigate = useNavigate()
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      return
    }

    if (window.history.length > 1) {
      router.history.back()
      return
    }

    void navigate({ to: '/', replace: true })
  }, [navigate, router, token])

  if (token) {
    return null
  }

  return (
    <BlankLayout>
      <Outlet />
    </BlankLayout>
  )
}
