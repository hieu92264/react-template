import { AuthService } from '@/features/auth/api/auth.api'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/components/ui/sonner'

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => AuthService.forgotPassword(email),
    onError: (error: any) => {
      toast.error('Gửi email thất bại', {
        description:
          error?.response?.data?.message ?? 'Có lỗi xảy ra. Vui lòng thử lại.',
      })
    },
  })
}
