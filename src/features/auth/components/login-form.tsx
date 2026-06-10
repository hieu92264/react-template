import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loading } from '@/components/ui/loading'
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/login.schema'
import { useLogin } from '@/features/auth/hooks/use-login'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: login, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormValues) => {
    login(data)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Đăng nhập
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Nhập thông tin tài khoản của bạn để tiếp tục
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Username */}
        <div className="space-y-1.5">
          <label
            htmlFor="login-username"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Tên đăng nhập
          </label>
          <Input
            id="login-username"
            type="text"
            placeholder="Nhập tên đăng nhập"
            autoComplete="username"
            aria-invalid={!!errors.username}
            className="h-9 rounded-lg border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-primary/70"
            {...register('username')}
          />
          {errors.username && (
            <p className="text-xs text-destructive">{errors.username.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Mật khẩu
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-primary transition-opacity hover:opacity-75"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              className="h-9 rounded-lg border-slate-200 bg-white pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-primary/70"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          id="login-submit"
          disabled={isPending}
          className="mt-2 h-9 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? (
            <Loading size="sm" label="Đang đăng nhập..." />
          ) : (
            'Đăng nhập'
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        <span className="text-xs text-slate-400">hoặc</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>

      {/* Register */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Chưa có tài khoản?{' '}
        <Link
          to="/register"
          className="font-medium text-primary transition-opacity hover:opacity-75"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  )
}
