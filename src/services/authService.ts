import api from './api'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    username: string
    role: 'admin' | 'operator'
    displayName: string
  }
}

export interface UserProfile {
  id: string
  username: string
  role: 'admin' | 'operator'
  displayName: string
  avatar?: string
}

export const authService = {
  /** 登录 — 获取 JWT */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>('/auth/login', data)
    // 开发调试时将 token 存入 localStorage
    localStorage.setItem('auth_token', res.token)
    localStorage.setItem('user_info', JSON.stringify(res.user))
    return res
  },

  /** 退出登录 */
  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')
  },

  /** 获取当前用户信息 */
  getProfile() {
    return api.get<UserProfile>('/auth/profile')
  },

  /** 从 localStorage 恢复用户信息 */
  getStoredUser(): UserProfile | null {
    const raw = localStorage.getItem('user_info')
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },

  /** 是否已登录 */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token')
  },
}

export default authService