import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReportStore } from '@/store/reportStore'
import { reportService } from '@/services/reportService'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { categoryLabel, statusLabel, statusColor, relativeTime, priorityLabel, priorityColor } from '@/utils/format'
import type { Report, ReportStatus } from '@/types'

const statusTabs = [
  { key: '', label: '全部' },
  { key: 'pending', label: '待受理' },
  { key: 'processing', label: '处理中' },
  { key: 'resolved', label: '已解决' },
  { key: 'rejected', label: '已拒绝' },
]

const columns: TableColumn<Report>[] = [
  {
    key: 'title',
    header: '标题',
    render: (r) => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-900 truncate max-w-[200px]">{r.title}</span>
        <Badge className={priorityColor(r.priority)} label={priorityLabel(r.priority)} />
      </div>
    ),
  },
  {
    key: 'category',
    header: '类别',
    render: (r) => <span className="text-gray-600">{categoryLabel(r.category)}</span>,
  },
  {
    key: 'status',
    header: '状态',
    render: (r) => <Badge className={statusColor(r.status)} label={statusLabel(r.status)} />,
  },
  {
    key: 'location',
    header: '地址',
    render: (r) => <span className="text-gray-500 text-xs truncate max-w-[180px]">{r.location.address}</span>,
  },
  {
    key: 'createdAt',
    header: '时间',
    render: (r) => <span className="text-gray-500 text-xs">{relativeTime(r.createdAt)}</span>,
  },
]

export function ReportList() {
  const navigate = useNavigate()
  const { reports, total, page, totalPages, params, isLoading, setReports, setParams, setLoading, setError } = useReportStore()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await reportService.list(params)
      setReports(res)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '加载失败')
    }
  }, [params, setReports, setLoading, setError])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleStatusChange = (key: string) => {
    setParams({ status: (key || undefined) as ReportStatus | undefined, page: 1 })
  }

  return (
    <div className="space-y-4">
      <Tabs tabs={statusTabs} active={params.status || ''} onChange={handleStatusChange} />

      <Card>
        <CardHeader
          title={`举报列表（${total} 条）`}
          action={
            <Button variant="outline" size="sm" onClick={fetchData}>
              刷新
            </Button>
          }
        />
        <Table
          columns={columns}
          data={reports}
          keyExtractor={(r) => r.id}
          onRowClick={(r) => navigate(`/reports/${r.id}`)}
          loading={isLoading}
          emptyText="暂无举报数据"
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
            <span className="text-sm text-gray-500">
              第 {page} / {totalPages} 页
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setParams({ page: Math.max(1, page - 1) })}
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setParams({ page: Math.min(totalPages, page + 1) })}
              >
                下一页
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}