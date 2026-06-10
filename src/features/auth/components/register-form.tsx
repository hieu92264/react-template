import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loading } from '@/components/ui/loading'
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas/register.schema'
import { useRegister } from '@/features/auth/hooks/use-register'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { mutate: register, isPending } = useRegister()

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
            className="h-9 rounded-lg border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
            {...registerField('username')}
          />
          {errors.username && (
            <p className="text-xs text-destructive">{errors.username.message}</p>
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
            className="h-9 rounded-lg border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
            {...registerField('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
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
              className="h-9 rounded-lg border-slate-200 bg-white pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
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
            <p className="text-xs text-destructive">{errors.password.message}</p>
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
              className="h-9 rounded-lg border-slate-200 bg-white pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
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
            <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          id="register-submit"
          disabled={isPending}
          className="mt-2 h-9 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? (
            <Loading size="sm" label="Đang tạo tài khoản..." />
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
          className="font-medium text-primary transition-opacity hover:opacity-75"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}
