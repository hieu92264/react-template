import type { BaseEntity } from '@/shared/types/common.type'

export type User = BaseEntity & {
  username: string
  email: string
  role: string
}

export type AuthPayload = {
  access_token: string
  token_type: string
  expires_in: number
  user: User
}

export type LoginRequest = {
  username: string
  password: string
}

export type RegisterRequest = {
  username: string
  email: string
  password: string
  confirm_password: string
}
