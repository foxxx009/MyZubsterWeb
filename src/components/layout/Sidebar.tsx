import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { useAppStore } from '@/store/appStore'

const navItems = [
  { to: '/', label: '仪表盘', icon: '📊' },
  { to: '/reports', label: '举报管理', icon: '📋' },
  { to: '/map', label: '地图视图', icon: '🗺️' },
  { to: '/drones', label: '无人机编队', icon: '🚁' },
  { to: '/export', label: '数据导出', icon: '📥' },
]

export function Sidebar() {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed)

  return (
    <aside
      className={clsx(
        'bg-white border-r border-gray-200 flex flex-col transition-all duration-200',
        sidebarCollapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-200">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
          MZ
        </div>
        {!sidebarCollapsed && (
          <span className="font-semibold text-gray-900 truncate">MyZubster</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )
            }
          >
            <span className="text-lg shrink-0">{item.icon}</span>
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-gray-200">
        {!sidebarCollapsed && (
          <p className="text-xs text-gray-400">市政管理平台 v0.1</p>
        )}
      </div>
    </aside>
  )
}