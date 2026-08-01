import { useEffect, useState } from 'react'
import { StatCard } from '@/components/dashboard/StatCard'
import { CategoryPie } from '@/components/dashboard/CategoryPie'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { statsService } from '@/services/statsService'
import type { DashboardStats, CategoryStat, TrendDataPoint } from '@/types'

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [categories, setCategories] = useState<CategoryStat[]>([])
  const [trend, setTrend] = useState<TrendDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      statsService.getDashboard(),
      statsService.getByCategory(),
      statsService.getTrend(),
    ])
      .then(([s, c, t]) => {
        setStats(s)
        setCategories(c)
        setTrend(t)
      })
      .catch(() => {
        // 后端不可用时使用模拟数据展示 UI
        setStats({
          totalReports: 0, pendingCount: 0, processingCount: 0,
          resolvedCount: 0, rejectedCount: 0, averageResolutionTime: 0,
          reportsToday: 0, reportsThisWeek: 0, activeDrones: 0,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">仪表盘概览</h1>

      {/* 概览卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="举报总数"
          value={stats?.totalReports ?? '-'}
          subtitle="累计举报量"
          icon="📋"
          color="blue"
        />
        <StatCard
          title="待受理"
          value={stats?.pendingCount ?? '-'}
          subtitle="等待处理"
          icon="⏳"
          color="yellow"
        />
        <StatCard
          title="处理中"
          value={stats?.processingCount ?? '-'}
          subtitle="正在进行"
          icon="🔄"
          color="blue"
        />
        <StatCard
          title="已解决"
          value={stats?.resolvedCount ?? '-'}
          subtitle="已完成"
          icon="✅"
          color="green"
        />
        <StatCard
          title="今日新增"
          value={stats?.reportsToday ?? '-'}
          subtitle="今日举报"
          icon="📈"
          color="blue"
        />
        <StatCard
          title="本周新增"
          value={stats?.reportsThisWeek ?? '-'}
          subtitle="本周数据"
          icon="📊"
          color="blue"
        />
        <StatCard
          title="平均处理时长"
          value={stats?.averageResolutionTime != null ? `${stats.averageResolutionTime}h` : '-'}
          subtitle="从受理到解决"
          icon="⏱️"
          color="gray"
        />
        <StatCard
          title="活跃无人机"
          value={stats?.activeDrones ?? '-'}
          subtitle="飞行中"
          icon="🚁"
          color="blue"
        />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPie data={categories} loading={loading} />
        <TrendChart data={trend} loading={loading} />
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin h-6 w-6 border-2 border-brand-600 border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  )
}