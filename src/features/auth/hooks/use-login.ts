import { AuthService } from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import type { LoginRequest } from '@/features/auth/types/auth.type'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

export const useLogin = () => {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: (payload) => {
      setSession(payload)
      void navigate({ to: '/', replace: true })
    },
  })
}
