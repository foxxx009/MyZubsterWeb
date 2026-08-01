import { ReportList } from '@/components/report/ReportList'
import { ReportMap } from '@/components/map/ReportMap'

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">举报管理</h1>

      {/* 地图概览 */}
      <div>
        <h2 className="text-sm font-medium text-gray-500 mb-2">地理位置分布</h2>
        <ReportMap />
      </div>

      {/* 列表 */}
      <ReportList />
    </div>
  )
}