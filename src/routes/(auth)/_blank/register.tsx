import { RegisterForm } from '@/features/auth/components/register-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_blank/register')({
  component: RegisterPage,
})

function RegisterPage() {
  return <RegisterForm />
}
