import { STORAGE_KEYS } from '@/shared/constants/storage-key'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AppTab = {
  key: string
  title: string
  to: string
  affix?: boolean
  closeable?: boolean
}

type TabState = {
  tabs: AppTab[]
  activeKey: string
  openTab: (tab: Omit<AppTab, 'closeable'>) => void
  closeTab: (key: string) => void
  closeOtherTabs: (key: string) => void
  closeAllTabs: () => void
  setActiveTab: (key: string) => void
}

export const useTabStore = create<TabState>()(
  persist(
    (set) => ({
      tabs: [],
      activeKey: '',

      openTab: (tab) => {
        set((state) => {
          const exists = state.tabs.some((item) => item.key === tab.key)

          return {
            tabs: exists
              ? state.tabs
              : [
                  ...state.tabs,
                  {
                    ...tab,
                    closable: !tab.affix,
                  },
                ],
            activeKey: tab.key,
          }
        })
      },

      closeTab: (key) => {
        set((state) => {
          const targetIndex = state.tabs.findIndex((tab) => tab.key === key)

          if (targetIndex === -1) return state

          const target = state.tabs[targetIndex]

          if (target?.affix) return state

          const nextTabs = state.tabs.filter((tab) => tab.key !== key)
          let nextActiveKey = state.activeKey

          if (state.activeKey === key) {
            const neighbor =
              state.tabs[targetIndex + 1] ?? state.tabs[targetIndex - 1]
            nextActiveKey = neighbor?.key ?? nextTabs[0]?.key ?? ''
          }

          return {
            tabs: nextTabs,
            activeKey: nextActiveKey,
          }
        })
      },

      closeOtherTabs: (key) => {
        set((state) => {
          const nextTabs = state.tabs.filter(
            (tab) => tab.key === key || tab.affix,
          )

          return {
            tabs: nextTabs,
            activeKey: nextTabs.some((tab) => tab.key === key)
              ? key
              : (nextTabs[0]?.key ?? ''),
          }
        })
      },

      closeAllTabs: () => {
        set((state) => {
          const affixedTabs = state.tabs.filter((tab) => tab.affix)

          return {
            tabs: affixedTabs,
            activeKey: affixedTabs[0]?.key ?? '',
          }
        })
      },

      setActiveTab: (key) => set({ activeKey: key }),
    }),
    {
      name: STORAGE_KEYS.TABS,
    },
  ),
)
