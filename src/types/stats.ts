/** 仪表盘概览统计 */
export interface DashboardStats {
  totalReports: number
  pendingCount: number
  processingCount: number
  resolvedCount: number
  rejectedCount: number
  averageResolutionTime: number // 小时
  reportsToday: number
  reportsThisWeek: number
  activeDrones: number
}

/** 按类别统计 */
export interface CategoryStat {
  category: string
  count: number
  percentage: number
}

/** 按区域/街道统计 */
export interface RegionStat {
  region: string
  count: number
  lat: number
  lng: number
}

/** 趋势数据点 */
export interface TrendDataPoint {
  date: string
  count: number
  resolved: number
}

/** 状态流转时间统计 */
export interface SLAStat {
  status: string
  averageHours: number
  medianHours: number
  p95Hours: number
}