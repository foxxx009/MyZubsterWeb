import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card } from '@/components/ui/Card'
import type { TrendDataPoint } from '@/types'

interface TrendChartProps {
  data: TrendDataPoint[]
  loading?: boolean
}

export function TrendChart({ data, loading }: TrendChartProps) {
  if (loading) {
    return (
      <Card>
        <div className="animate-pulse h-64 bg-gray-100 rounded-lg" />
      </Card>
    )
  }

  return (
    <Card>
      <h3 className="text-base font-semibold text-gray-900 mb-4">举报趋势（近30天）</h3>
      {!data || data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">暂无数据</div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="count"
              name="新增举报"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="resolved"
              name="已解决"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}