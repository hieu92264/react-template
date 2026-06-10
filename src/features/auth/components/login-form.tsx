import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/login.schema'
import { useLogin } from '@/features/auth/hooks/use-login'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: login, isPending, error } = useLogin()

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

      {/* Error Alert */}
      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/40 dark:bg-red-950/30">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-600 dark:text-red-400">
            {(error as any)?.response?.data?.message ?? 'Tên đăng nhập hoặc mật khẩu không đúng.'}
          </p>
        </div>
      )}

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
            className="h-9 rounded-lg border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-indigo-500/70"
            {...register('username')}
          />
          {errors.username && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.username.message}</p>
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
              className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
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
              className="h-9 rounded-lg border-slate-200 bg-white pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-indigo-500/70"
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
            <p className="text-xs text-red-500 dark:text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          id="login-submit"
          disabled={isPending}
          className="mt-2 h-9 w-full rounded-lg bg-indigo-600 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-500"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang đăng nhập...
            </>
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
          className="font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  )
}
