import type { ApiResponse } from '@/shared/api/api-response.type'
import { apiClient } from '@/shared/api/axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

type RequestBody = unknown

async function unwrapMetadata<TMetadata>(
  request: Promise<AxiosResponse<ApiResponse<TMetadata>>>,
): Promise<TMetadata> {
  const response = await request
  return response.data.metadata as TMetadata
}

async function unwrapApiResponse<TMetadata>(
  request: Promise<AxiosResponse<ApiResponse<TMetadata>>>,
): Promise<ApiResponse<TMetadata>> {
  const response = await request
  return response.data
}

export const httpService = {
  get<TMetadata>(url: string, config?: AxiosRequestConfig) {
    return unwrapMetadata<TMetadata>(
      apiClient.get<ApiResponse<TMetadata>>(url, config),
    )
  },

  post<TMetadata, TBody = RequestBody>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) {
    return unwrapMetadata<TMetadata>(
      apiClient.post<ApiResponse<TMetadata>>(url, body, config),
    )
  },

  put<TMetadata, TBody = RequestBody>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) {
    return unwrapMetadata<TMetadata>(
      apiClient.put<ApiResponse<TMetadata>>(url, body, config),
    )
  },

  patch<TMetadata, TBody = RequestBody>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) {
    return unwrapMetadata<TMetadata>(
      apiClient.patch<ApiResponse<TMetadata>>(url, body, config),
    )
  },

  delete<TMetadata>(url: string, config?: AxiosRequestConfig) {
    return unwrapMetadata<TMetadata>(
      apiClient.delete<ApiResponse<TMetadata>>(url, config),
    )
  },

  getApiResponse<TMetadata>(url: string, config?: AxiosRequestConfig) {
    return unwrapApiResponse<TMetadata>(
      apiClient.get<ApiResponse<TMetadata>>(url, config),
    )
  },

  postApiResponse<TMetadata, TBody = RequestBody>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) {
    return unwrapApiResponse<TMetadata>(
      apiClient.post<ApiResponse<TMetadata>>(url, body, config),
    )
  },

  putApiResponse<TMetadata, TBody = RequestBody>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) {
    return unwrapApiResponse<TMetadata>(
      apiClient.put<ApiResponse<TMetadata>>(url, body, config),
    )
  },

  patchApiResponse<TMetadata, TBody = RequestBody>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) {
    return unwrapApiResponse<TMetadata>(
      apiClient.patch<ApiResponse<TMetadata>>(url, body, config),
    )
  },

  deleteApiResponse<TMetadata>(url: string, config?: AxiosRequestConfig) {
    return unwrapApiResponse<TMetadata>(
      apiClient.delete<ApiResponse<TMetadata>>(url, config),
    )
  },
}
