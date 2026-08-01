import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { reportService } from '@/services/reportService'
import { useReportStore } from '@/store/reportStore'
import type { Report, ReportStatus } from '@/types'

interface StatusActionsProps {
  report: Report
}

/** 可流转的目标状态映射 */
const transitions: Record<ReportStatus, { label: string; to: ReportStatus; variant: 'primary' | 'danger' | 'secondary' }[]> = {
  pending: [
    { label: '受理 → 处理中', to: 'processing', variant: 'primary' },
    { label: '拒绝', to: 'rejected', variant: 'danger' },
  ],
  processing: [
    { label: '标记已解决', to: 'resolved', variant: 'primary' },
    { label: '拒绝', to: 'rejected', variant: 'danger' },
  ],
  resolved: [],
  rejected: [
    { label: '重新受理', to: 'pending', variant: 'secondary' },
  ],
}

export function StatusActions({ report }: StatusActionsProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [targetStatus, setTargetStatus] = useState<ReportStatus | null>(null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const updateReport = useReportStore((s) => s.updateReport)

  const availActions = transitions[report.status] || []

  const handleTransition = async () => {
    if (!targetStatus) return
    setLoading(true)
    try {
      const updated = await reportService.transition({
        reportId: report.id,
        toStatus: targetStatus,
        comment: comment || undefined,
      })
      updateReport(report.id, updated)
      setModalOpen(false)
      setComment('')
    } catch (err) {
      console.error('状态流转失败:', err)
      alert('状态流转失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const openModal = (to: ReportStatus) => {
    setTargetStatus(to)
    setModalOpen(true)
  }

  if (availActions.length === 0) {
    return <span className="text-xs text-gray-400">无可用操作</span>
  }

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {availActions.map((action) => (
          <Button
            key={action.to}
            variant={action.variant}
            size="sm"
            onClick={() => openModal(action.to)}
          >
            {action.label}
          </Button>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="确认状态变更"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>取消</Button>
            <Button variant="primary" onClick={handleTransition} loading={loading}>确认</Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            将举报 <strong>{report.title}</strong> 的状态变更为 <strong>{targetStatus}</strong>？
          </p>
          <div>
            <label className="block text-sm text-gray-600 mb-1">备注（可选）</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              rows={3}
              placeholder="输入操作备注…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}