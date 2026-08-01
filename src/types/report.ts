/** 举报状态枚举 */
export type ReportStatus =
  | 'pending'       // 待受理
  | 'processing'    // 处理中
  | 'resolved'      // 已解决
  | 'rejected'      // 已拒绝

/** 垃圾类别 */
export type WasteCategory =
  | 'mixed_waste'
  | 'construction'
  | 'hazardous'
  | 'recyclable'
  | 'organic'
  | 'bulky'
  | 'electronic'
  | 'other'

/** 举报数据 */
export interface Report {
  id: string
  title: string
  description: string
  category: WasteCategory
  status: ReportStatus
  priority: 'low' | 'medium' | 'high' | 'urgent'
  location: {
    lat: number
    lng: number
    address: string
  }
  images: string[]
  reporterName: string
  reporterContact: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  assignedDroneId?: string
  assignedTeam?: string
  auditLog: AuditEntry[]
}

/** 状态变更审计条目 */
export interface AuditEntry {
  id: string
  fromStatus: ReportStatus | null
  toStatus: ReportStatus
  operator: string
  operatorRole: 'admin' | 'operator'
  comment: string
  timestamp: string
}

/** 状态流转请求 */
export interface StatusTransitionRequest {
  reportId: string
  toStatus: ReportStatus
  comment?: string
}

/** 举报列表查询参数 */
export interface ReportQueryParams {
  page?: number
  pageSize?: number
  status?: ReportStatus
  category?: WasteCategory
  priority?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}