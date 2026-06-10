import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_blank/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
