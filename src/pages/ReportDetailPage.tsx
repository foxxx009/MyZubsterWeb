import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { reportService } from '@/services/reportService'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StatusActions } from '@/components/report/StatusActions'
import {
  categoryLabel, statusLabel, statusColor, priorityLabel, priorityColor,
  formatDateTime,
} from '@/utils/format'
import { categoryIcon } from '@/utils/map'
import type { Report } from '@/types'

export function ReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    reportService.getById(id)
      .then(setReport)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-brand-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">{error || '举报不存在'}</p>
        <Button variant="outline" onClick={() => navigate('/reports')}>返回列表</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={() => navigate('/reports')}>← 返回</Button>
        <h1 className="text-xl font-bold text-gray-900">举报详情</h1>
      </div>

      {/* 基本信息 */}
      <Card>
        <CardHeader title={report.title} subtitle={`ID: ${report.id}`} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{categoryIcon(report.category)}</span>
              <div>
                <p className="text-sm text-gray-500">类别</p>
                <p className="text-sm font-medium">{categoryLabel(report.category)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">状态</p>
              <Badge className={statusColor(report.status)} label={statusLabel(report.status)} />
            </div>
            <div>
              <p className="text-sm text-gray-500">优先级</p>
              <Badge className={priorityColor(report.priority)} label={priorityLabel(report.priority)} />
            </div>
            <div>
              <p className="text-sm text-gray-500">举报人</p>
              <p className="text-sm">{report.reporterName}</p>
              <p className="text-xs text-gray-400">{report.reporterContact}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">地址</p>
              <p className="text-sm">{report.location.address}</p>
              <p className="text-xs text-gray-400">
                {report.location.lat.toFixed(6)}, {report.location.lng.toFixed(6)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">创建时间</p>
              <p className="text-sm">{formatDateTime(report.createdAt)}</p>
            </div>
            {report.resolvedAt && (
              <div>
                <p className="text-sm text-gray-500">解决时间</p>
                <p className="text-sm">{formatDateTime(report.resolvedAt)}</p>
              </div>
            )}
            {report.assignedDroneId && (
              <div>
                <p className="text-sm text-gray-500">指派无人机</p>
                <p className="text-sm">{report.assignedDroneId}</p>
              </div>
            )}
          </div>
        </div>
        {report.description && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-1">描述</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{report.description}</p>
          </div>
        )}
      </Card>

      {/* 状态流转 */}
      <Card>
        <CardHeader title="状态变更" subtitle="操作当前举报的状态" />
        <StatusActions report={report} />
      </Card>

      {/* 审计日志 */}
      <Card>
        <CardHeader title="操作审计" subtitle="所有状态变更记录" />
        {report.auditLog.length === 0 ? (
          <p className="text-sm text-gray-400">暂无审计记录</p>
        ) : (
          <div className="space-y-3">
            {report.auditLog.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 text-sm pb-3 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{entry.operator}</span>
                    <span className="text-gray-400 text-xs">{entry.operatorRole === 'admin' ? '管理员' : '操作员'}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {entry.fromStatus ? `${statusLabel(entry.fromStatus)} → ${statusLabel(entry.toStatus)}` : statusLabel(entry.toStatus)}
                  </p>
                  {entry.comment && <p className="text-gray-600 mt-1">{entry.comment}</p>}
                  <p className="text-gray-400 text-xs mt-1">{formatDateTime(entry.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}