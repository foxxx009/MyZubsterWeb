import { useState } from 'react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { exportService } from '@/services/exportService'
import { useReportStore } from '@/store/reportStore'


const categoryOptions = [
  { value: '', label: '全部类别' },
  { value: 'mixed_waste', label: '混合垃圾' },
  { value: 'construction', label: '建筑垃圾' },
  { value: 'hazardous', label: '有害垃圾' },
  { value: 'recyclable', label: '可回收物' },
  { value: 'organic', label: '厨余垃圾' },
  { value: 'bulky', label: '大件垃圾' },
  { value: 'electronic', label: '电子垃圾' },
  { value: 'other', label: '其他' },
]

const statusOptions = [
  { value: '', label: '全部状态' },
  { value: 'pending', label: '待受理' },
  { value: 'processing', label: '处理中' },
  { value: 'resolved', label: '已解决' },
  { value: 'rejected', label: '已拒绝' },
]

export function ExportPanel() {
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState<'csv' | 'geojson' | null>(null)
  const allReports = useReportStore((s) => s.allReports)

  const handleExport = async (format: 'csv' | 'geojson') => {
    setLoading(format)
    try {
      const params: { status?: string; category?: string } = {}
      if (status) params.status = status
      if (category) params.category = category

      if (format === 'csv') {
        // 优先尝试服务端导出，降级到客户端
        try {
          const blob = await exportService.downloadCSV(params)
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `reports_${Date.now()}.csv`
          a.click()
          URL.revokeObjectURL(url)
        } catch {
          // 客户端降级
          exportService.clientSideCSV(allReports)
        }
      } else {
        try {
          const blob = await exportService.downloadGeoJSON(params)
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `reports_${Date.now()}.geojson`
          a.click()
          URL.revokeObjectURL(url)
        } catch {
          exportService.clientSideGeoJSON(allReports)
        }
      }
    } catch (err) {
      console.error('导出失败:', err)
      alert('导出失败，请重试')
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card>
      <CardHeader title="数据导出" subtitle="下载举报数据为 CSV 或 GeoJSON 格式" />
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">按类别过滤</label>
            <Select
              options={categoryOptions}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">按状态过滤</label>
            <Select
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            loading={loading === 'csv'}
            disabled={loading !== null}
          >
            导出 CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('geojson')}
            loading={loading === 'geojson'}
            disabled={loading !== null}
          >
            导出 GeoJSON
          </Button>
        </div>

        <p className="text-xs text-gray-400">
          提示：优先通过服务端 API 导出，若后端不可用则自动降级为客户端导出
        </p>
      </div>
    </Card>
  )
}