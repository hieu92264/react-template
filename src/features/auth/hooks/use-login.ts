import { AuthService } from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import type { LoginRequest } from '@/features/auth/types/auth.type'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from '@/components/ui/sonner'

export const useLogin = () => {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: (payload) => {
      setSession(payload)
      toast.success('Đăng nhập thành công', {
        description: `Chào mừng trở lại, ${payload.user.username}!`,
      })
      void navigate({ to: '/', replace: true })
    },
    onError: (error: any) => {
      toast.error('Đăng nhập thất bại', {
        description:
          error?.response?.data?.message ?? 'Tên đăng nhập hoặc mật khẩu không đúng.',
      })
    },
  })
}
