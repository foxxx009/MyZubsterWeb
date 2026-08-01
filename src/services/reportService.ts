import api from './api'
import type { Report, ReportQueryParams, PaginatedResponse, StatusTransitionRequest } from '@/types'

const BASE = '/admin/reports'

export const reportService = {
  /** 获取分页列表 */
  list(params?: ReportQueryParams) {
    const query: Record<string, string> = {}
    if (params?.page) query.page = String(params.page)
    if (params?.pageSize) query.pageSize = String(params.pageSize)
    if (params?.status) query.status = params.status
    if (params?.category) query.category = params.category
    if (params?.priority) query.priority = params.priority
    if (params?.search) query.search = params.search
    if (params?.sortBy) query.sortBy = params.sortBy
    if (params?.sortOrder) query.sortOrder = params.sortOrder
    return api.get<PaginatedResponse<Report>>(BASE, query)
  },

  /** 获取单个详情 */
  getById(id: string) {
    return api.get<Report>(`${BASE}/${id}`)
  },

  /** 状态流转 */
  transition(req: StatusTransitionRequest) {
    return api.post<Report>(`${BASE}/${req.reportId}/transition`, {
      toStatus: req.toStatus,
      comment: req.comment,
    })
  },

  /** 获取所有举报（用于地图全量加载） */
  getAll() {
    return api.get<Report[]>(`${BASE}/all`)
  },
}

export default reportService