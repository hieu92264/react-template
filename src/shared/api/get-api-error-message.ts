import type { ApiResponse } from '@/shared/api/api-response.type'
import { isAxiosError } from 'axios'

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<ApiResponse>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
