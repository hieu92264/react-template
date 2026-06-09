import type { AuthPayload, User } from '@/features/auth/types/auth.type'
import { STORAGE_KEYS } from '@/shared/constants/storage-key'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  accessToken: string | null
  user: User | null
  isAuthenticated: boolean
  setSession: (payload: AuthPayload) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null as string | null,
      user: null as User | null,
      isAuthenticated: false,

      setSession: (payload) => {
        set({
          accessToken: payload.access_token,
          user: payload.user,
          isAuthenticated: true,
        })
      },

      clearSession: () => {
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: STORAGE_KEYS.AUTH,
    },
  ),
)
