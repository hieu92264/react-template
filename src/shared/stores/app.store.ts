import { create } from 'zustand'

type AppState = {
  lang: string
  isPageLoading: boolean
  setLang: (lang: string) => void
  startPageLoading: () => void
  finishPageLoading: () => void
}

export const useAppStore = create<AppState>((set) => ({
  lang: 'vi',
  isPageLoading: false,
  setLang: (lang) => set({ lang }),
  startPageLoading: () => set({ isPageLoading: true }),
  finishPageLoading: () => set({ isPageLoading: false }),
}))
