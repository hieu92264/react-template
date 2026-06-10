import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas/register.schema'
import { useRegister } from '@/features/auth/hooks/use-register'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { mutate: register, isPending, error } = useRegister()

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const passwordValue = watch('password', '')

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, label: '', color: '' }
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++
    if (score <= 1) return { level: score, label: 'Yếu', color: 'bg-red-500' }
    if (score === 2) return { level: score, label: 'Trung bình', color: 'bg-amber-500' }
    if (score === 3) return { level: score, label: 'Mạnh', color: 'bg-blue-500' }
    return { level: score, label: 'Rất mạnh', color: 'bg-green-500' }
  }

  const strength = getPasswordStrength(passwordValue)

  const onSubmit = (data: RegisterFormValues) => {
    register(data)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Tạo tài khoản
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Điền thông tin để tạo tài khoản mới
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/40 dark:bg-red-950/30">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-600 dark:text-red-400">
            {(error as any)?.response?.data?.message ?? 'Đăng ký thất bại. Vui lòng thử lại.'}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Username */}
        <div className="space-y-1.5">
          <label htmlFor="register-username" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Tên đăng nhập
          </label>
          <Input
            id="register-username"
            type="text"
            placeholder="Nhập tên đăng nhập"
            autoComplete="username"
            aria-invalid={!!errors.username}
            className="h-9 rounded-lg border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
            {...registerField('username')}
          />
          {errors.username && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="register-email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>
          <Input
            id="register-email"
            type="email"
            placeholder="example@email.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className="h-9 rounded-lg border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
            {...registerField('email')}
          />
          {errors.email && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="register-password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Mật khẩu
          </label>
          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Tối thiểu 8 ký tự"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              className="h-9 rounded-lg border-slate-200 bg-white pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
              {...registerField('password')}
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

          {/* Password strength */}
          {passwordValue && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= strength.level ? strength.color : 'bg-slate-200 dark:bg-white/10'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs ${
                strength.level <= 1 ? 'text-red-500' :
                strength.level === 2 ? 'text-amber-500' :
                strength.level === 3 ? 'text-blue-500' : 'text-green-500'
              }`}>
                Độ mạnh mật khẩu: {strength.label}
              </p>
            </div>
          )}

          {errors.password && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="register-confirm-password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <Input
              id="register-confirm-password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
              aria-invalid={!!errors.confirm_password}
              className="h-9 rounded-lg border-slate-200 bg-white pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
              {...registerField('confirm_password')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.confirm_password.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          id="register-submit"
          disabled={isPending}
          className="mt-2 h-9 w-full rounded-lg bg-indigo-600 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang tạo tài khoản...
            </>
          ) : (
            'Tạo tài khoản'
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        <span className="text-xs text-slate-400">hoặc</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>

      {/* Login link */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Đã có tài khoản?{' '}
        <Link
          to="/login"
          className="font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}
