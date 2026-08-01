import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface AppState {
  sidebarCollapsed: boolean
  theme: Theme
  globalLoading: boolean

  toggleSidebar: () => void
  setTheme: (t: Theme) => void
  setGlobalLoading: (v: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  theme: 'light',
  globalLoading: false,

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setTheme: (t) => set({ theme: t }),
  setGlobalLoading: (v) => set({ globalLoading: v }),
}))

export default useAppStore