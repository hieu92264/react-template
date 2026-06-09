import { useAuthStore } from '@/features/auth/stores/auth.store'
import type { AuthPayload } from '@/features/auth/types/auth.type'
import type { ApiResponse } from '@/shared/api/api-response.type'
import { env } from '@/shared/config/env'
import { useAppStore } from '@/shared/stores/app.store'
import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios'

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
} as const

export const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
})

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

let installed = false
let refreshTokenPromise: Promise<AuthPayload | undefined> | null = null

export function setupAxiosInterceptors() {
  if (installed) return

  installed = true

  apiClient.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState()
    const { lang } = useAppStore.getState()
    const headers = AxiosHeaders.from(config.headers)

    headers.set('Accept', 'application/json')
    headers.set('X-Locale', lang)

    if (config.data) headers.set('Content-Type', 'application/json')

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    } else {
      headers.delete('Authorization')
    }

    config.headers = headers

    return config
  })

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiResponse>) => {
      const originalRequest = error.config as RetryableRequestConfig

      const shouldSkipRefresh =
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        originalRequest.url?.includes(AUTH_ENDPOINTS.LOGIN) ||
        originalRequest.url?.includes(AUTH_ENDPOINTS.REFRESH)

      if (shouldSkipRefresh) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      refreshTokenPromise ??= apiClient
        .post<ApiResponse<AuthPayload>>(AUTH_ENDPOINTS.REFRESH)
        .then((response) => {
          const payload = response.data.metadata

          if (payload) {
            useAuthStore.getState().setSession(payload)
          }

          return payload
        })
        .catch(() => {
          useAuthStore.getState().clearSession()
          return undefined
        })
        .finally(() => {
          refreshTokenPromise = null
        })

      const payload = await refreshTokenPromise

      if (!payload?.access_token) {
        return Promise.reject(error)
      }

      const headers = AxiosHeaders.from(originalRequest.headers)
      headers.set('Authorization', `Bearer ${payload.access_token}`)
      originalRequest.headers = headers

      return apiClient(originalRequest)
    },
  )
}
