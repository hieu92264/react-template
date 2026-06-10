import type { RegisterRequest } from '@/features/auth/types/auth.type'
import { AuthService } from '@/features/auth/api/auth.api'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

export const useRegister = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterRequest) => AuthService.register(data),
    onSuccess: () => {
      void navigate({ to: '/login', replace: true })
    },
  })
}
