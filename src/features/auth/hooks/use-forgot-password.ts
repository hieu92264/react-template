import { AuthService } from '@/features/auth/api/auth.api'
import { useMutation } from '@tanstack/react-query'

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => AuthService.forgotPassword(email),
  })
}
