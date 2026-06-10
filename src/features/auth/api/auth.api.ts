import type { LoginFormValues } from '@/features/auth/schemas/login.schema'
import type {
  AuthPayload,
  LoginRequest,
  RegisterRequest,
  User,
} from '@/features/auth/types/auth.type'
import { httpService } from '@/shared/api/http.service'

export const AUTH_API = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
} as const

export const AuthService = {
  login(data: LoginFormValues) {
    return httpService.post<AuthPayload, LoginRequest>(AUTH_API.LOGIN, data)
  },

  me() {
    return httpService.get<User>(AUTH_API.ME)
  },

  refreshToken() {
    return httpService.post<AuthPayload>(AUTH_API.REFRESH)
  },

  register(data: RegisterRequest) {
    return httpService.post<User, RegisterRequest>(AUTH_API.REGISTER, data)
  },

  logout() {
    return httpService.post<void>(AUTH_API.LOGOUT)
  },

  forgotPassword(email: string) {
    return httpService.post<void, { email: string }>(AUTH_API.FORGOT_PASSWORD, { email })
  },
}
