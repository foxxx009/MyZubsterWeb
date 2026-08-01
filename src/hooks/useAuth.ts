import { create } from 'zustand'
import type { UserProfile } from '@/services/authService'
import authService from '@/services/authService'

interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  restoreSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (username, password) => {
    set({ isLoading: true })
    try {
      const res = await authService.login({ username, password })
      set({
        user: res.user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  logout: () => {
    authService.logout()
    set({ user: null, isAuthenticated: false })
  },

  restoreSession: () => {
    const stored = authService.getStoredUser()
    if (stored && authService.isAuthenticated()) {
      set({ user: stored, isAuthenticated: true })
    }
  },
}))

export default useAuthStore