import { LoginForm } from '@/features/auth/components/login-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_blank/login')({
  component: LoginPage,
})

function LoginPage() {
  return <LoginForm />
}
