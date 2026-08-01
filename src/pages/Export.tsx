import { useEffect } from 'react'
import { ExportPanel } from '@/components/export/ExportPanel'
import { useReportStore } from '@/store/reportStore'
import { reportService } from '@/services/reportService'

export function ExportPage() {
  const { allReports, setAllReports, setMapLoading, setError } = useReportStore()

  useEffect(() => {
    if (allReports.length === 0) {
      setMapLoading(true)
      reportService
        .getAll()
        .then(setAllReports)
        .catch((err) => setError(err.message))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-gray-900">数据导出</h1>
      <ExportPanel />
    </div>
  )
}