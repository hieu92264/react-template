import { BlankLayout } from '@/components/layouts/BlankLayout'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_blank')({
  component: () => (
    <BlankLayout>
      <Outlet />
    </BlankLayout>
  ),
})
