import type React from 'react'
import { Sun, Moon, Globe } from 'lucide-react'
import { useState } from 'react'

type AuthLayoutProps = {
  children: React.ReactNode
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  )
  const [lang, setLang] = useState<'vi' | 'en'>('vi')

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-white dark:bg-[#141414]">
      {/* ─── Toolbar ──────────────────────────────────────── */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-0.5">
        <button
          onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
          title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          aria-label="Đổi ngôn ngữ"
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-white"
        >
          <Globe className="h-4 w-4" />
        </button>
        <button
          onClick={toggleTheme}
          aria-label="Đổi theme sáng/tối"
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-white"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      {/* ─── Left panel ───────────────────────────────────── */}
      <div className="relative hidden flex-col items-center justify-center overflow-hidden lg:flex lg:w-[480px] xl:w-[560px]">
        {/* Gradient bg — uses Vben blue (#1677ff) in light, teal (#36cfc9) accent in dark */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1677ff] via-[#4096ff] to-[#0958d9] dark:from-[#141414] dark:via-[#1a1b23] dark:to-[#0c2340]" />

        {/* Background image overlay */}
        <img
          src="/auth-bg.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-overlay"
        />

        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-white/8" />
        <div className="absolute top-1/3 right-8 h-40 w-40 rounded-full bg-white/5" />

        {/* Content */}
        <div className="relative z-10 px-12 text-center text-white">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <svg
                className="h-6 w-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="22" x2="12" y2="15.5" />
                <polyline points="22 8.5 12 15.5 2 8.5" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">Vben Admin</span>
          </div>

          <h2 className="mb-3 text-3xl font-bold leading-snug">
            Quản lý dự án{' '}
            <span className="text-blue-200 dark:text-[#36cfc9]">hiệu quả hơn</span>
          </h2>
          <p className="text-sm leading-relaxed text-blue-100/80">
            Nền tảng quản trị hiện đại, mạnh mẽ
            <br />
            và linh hoạt cho mọi quy mô doanh nghiệp.
          </p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['React 19', 'TypeScript', 'TanStack Router', 'Tailwind v4'].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* ─── Right form panel ──────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg
              className="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            </svg>
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">Vben Admin</span>
        </div>

        {/* Form wrapper */}
        <div className="w-full max-w-[380px]">{children}</div>

        {/* Footer */}
        <p className="mt-8 text-xs text-slate-400 dark:text-slate-600">
          © {new Date().getFullYear()} Vben Admin. All rights reserved.
        </p>
      </div>
    </div>
  )
}
