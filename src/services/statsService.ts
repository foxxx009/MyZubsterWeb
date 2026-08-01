import api from './api'
import type { DashboardStats, CategoryStat, RegionStat, TrendDataPoint, SLAStat } from '@/types'

const BASE = '/admin/stats'

export const statsService = {
  /** 仪表盘概览 */
  getDashboard() {
    return api.get<DashboardStats>(`${BASE}/dashboard`)
  },

  /** 按类别分布 */
  getByCategory() {
    return api.get<CategoryStat[]>(`${BASE}/by-category`)
  },

  /** 按区域分布 */
  getByRegion() {
    return api.get<RegionStat[]>(`${BASE}/by-region`)
  },

  /** 趋势（近30天） */
  getTrend(days = 30) {
    return api.get<TrendDataPoint[]>(`${BASE}/trend`, { days: String(days) })
  },

  /** SLA 统计 */
  getSLA() {
    return api.get<SLAStat[]>(`${BASE}/sla`)
  },
}

export default statsService