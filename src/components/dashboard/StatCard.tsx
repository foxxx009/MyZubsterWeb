import { Card } from '@/components/ui/Card'
import { clsx } from 'clsx'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: string
  trend?: { value: number; positive: boolean }
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray'
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  red: 'bg-red-50 text-red-600',
  gray: 'bg-gray-50 text-gray-600',
}

export function StatCard({ title, value, subtitle, icon, trend, color = 'blue' }: StatCardProps) {
  return (
    <Card className="flex items-start gap-4">
      <div className={clsx('w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0', colorMap[color])}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        <div className="flex items-center gap-2 mt-1">
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          {trend && (
            <span className={clsx('text-xs font-medium', trend.positive ? 'text-green-600' : 'text-red-600')}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}