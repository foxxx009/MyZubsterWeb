/**
 * 基础 API 客户端
 * 封装 fetch，自动携带 JWT Bearer Token，统一错误处理
 */

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

function getToken(): string | null {
  // 优先从 localStorage 读取（开发调试），生产环境下使用 HttpOnly Cookie
  return localStorage.getItem('auth_token')
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const url = `${API_BASE}${endpoint}`
  const res = await fetch(url, { ...options, headers })

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '')
    let errorMessage: string
    try {
      const parsed = JSON.parse(errorBody)
      errorMessage = parsed.message || parsed.error || `HTTP ${res.status}`
    } catch {
      errorMessage = `HTTP ${res.status}: ${res.statusText}`
    }
    throw new ApiError(res.status, errorMessage, errorBody)
  }

  // 204 No Content
  if (res.status === 204) return undefined as T

  return res.json()
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// --- 便捷方法 ---

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<T>(`${endpoint}${query}`)
  },
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}

export default api