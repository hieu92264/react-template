export type ApiDebug = {
  exception: string
  message: string
  file: string
  line: number
  trace: string[]
}

export type ApiResponse<TMetadata = unknown> = {
  message: string
  status_code: number
  metadata?: TMetadata
  path: string
  timestamp: string
  debug?: ApiDebug
  stack?: string
}
