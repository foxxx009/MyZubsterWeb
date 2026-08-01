import api from './api'
import type { Drone, Mission, FleetSummary, FlightTrajectoryPoint } from '@/types'

const BASE = '/admin/drones'

export const droneService = {
  /** 获取编队列表 */
  list() {
    return api.get<Drone[]>(BASE)
  },

  /** 获取单个无人机详情 */
  getById(id: string) {
    return api.get<Drone>(`${BASE}/${id}`)
  },

  /** 获取编队概要统计 */
  getFleetSummary() {
    return api.get<FleetSummary>(`${BASE}/summary`)
  },

  /** 获取飞行轨迹 */
  getTrajectory(droneId: string, from?: string, to?: string) {
    const params: Record<string, string> = {}
    if (from) params.from = from
    if (to) params.to = to
    return api.get<FlightTrajectoryPoint[]>(`${BASE}/${droneId}/trajectory`, params)
  },

  /** 获取当前任务 */
  getCurrentMission(droneId: string) {
    return api.get<Mission | null>(`${BASE}/${droneId}/mission`)
  },
}

export default droneService