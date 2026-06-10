import type { RegisterRequest } from '@/features/auth/types/auth.type'
import { AuthService } from '@/features/auth/api/auth.api'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from '@/components/ui/sonner'

export const useRegister = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterRequest) => AuthService.register(data),
    onSuccess: () => {
      toast.success('Tạo tài khoản thành công', {
        description: 'Vui lòng đăng nhập để tiếp tục.',
      })
      void navigate({ to: '/login', replace: true })
    },
    onError: (error: any) => {
      toast.error('Đăng ký thất bại', {
        description:
          error?.response?.data?.message ?? 'Có lỗi xảy ra. Vui lòng thử lại.',
      })
    },
  })
}
