import { STORAGE_KEYS } from '@/shared/constants/storage-key'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SidebarSate = {
  isCollapsed: boolean
  toggle: () => void
  setCollapsed: (collapsed: boolean) => void
}

export const useSidebarStore = create<SidebarSate>()(
  persist(
    (set) => ({
      isCollapsed: false as boolean,
      toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
    }),
    {
      name: STORAGE_KEYS.SIDEBAR,
    },
  ),
)
