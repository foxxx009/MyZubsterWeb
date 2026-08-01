import { useAppStore } from '@/store/appStore'
import { useAuthStore } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)
  const { user, logout, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          title="切换侧栏"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          <span>系统运行中</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-medium text-sm">
                {user.displayName?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                <p className="text-xs text-gray-500">{user.role === 'admin' ? '管理员' : '操作员'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              退出
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>未登录</span>
          </div>
        )}
      </div>
    </header>
  )
}