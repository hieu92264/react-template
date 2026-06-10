import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loading } from '@/components/ui/loading'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/schemas/forgot-password.schema'
import { useForgotPassword } from '@/features/auth/hooks/use-forgot-password'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, CheckCircle, MailOpen } from 'lucide-react'
import { useForm } from 'react-hook-form'

export const ForgotPasswordForm: React.FC = () => {
  const { mutate: forgotPassword, isPending, isSuccess } = useForgotPassword()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPassword(data.email)
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
          Kiểm tra email của bạn
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến
        </p>
        <p className="mt-1 font-medium text-primary">{getValues('email')}</p>

        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left dark:border-amber-900/30 dark:bg-amber-950/20">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            💡 Không nhận được email? Kiểm tra thư mục spam hoặc{' '}
            <button
              type="button"
              onClick={() => handleSubmit(onSubmit)()}
              className="font-medium underline underline-offset-2"
            >
              gửi lại
            </button>
            .
          </p>
        </div>

        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại đăng nhập
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <MailOpen className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Quên mật khẩu?
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Nhập email để nhận hướng dẫn đặt lại mật khẩu
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="forgot-email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Địa chỉ email
          </label>
          <Input
            id="forgot-email"
            type="email"
            placeholder="example@email.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className="h-9 rounded-lg border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          id="forgot-password-submit"
          disabled={isPending}
          className="h-9 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? (
            <Loading size="sm" label="Đang gửi..." />
          ) : (
            'Gửi hướng dẫn đặt lại mật khẩu'
          )}
        </Button>
      </form>

      {/* Back to login */}
      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  )
}
