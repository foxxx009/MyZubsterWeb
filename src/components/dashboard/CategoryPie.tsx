import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card } from '@/components/ui/Card'
import type { CategoryStat } from '@/types'

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6', '#6b7280']

interface CategoryPieProps {
  data: CategoryStat[]
  loading?: boolean
}

export function CategoryPie({ data, loading }: CategoryPieProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    // 只取前 7 类 + 其他
    const sorted = [...data].sort((a, b) => b.count - a.count)
    if (sorted.length <= 7) return sorted
    const top = sorted.slice(0, 6)
    const others = sorted.slice(6).reduce((acc, cur) => ({
      category: '其他',
      count: acc.count + cur.count,
      percentage: acc.percentage + cur.percentage,
    }), { category: '其他', count: 0, percentage: 0 })
    return [...top, others]
  }, [data])

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse h-64 bg-gray-100 rounded-lg" />
      </Card>
    )
  }

  return (
    <Card>
      <h3 className="text-base font-semibold text-gray-900 mb-4">举报类别分布</h3>
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">暂无数据</div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={2}
            >
              {chartData.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value} 件`, name]}
            />
            <Legend
              formatter={(value: string) => <span className="text-sm text-gray-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}