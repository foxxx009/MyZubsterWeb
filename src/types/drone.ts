/** 无人机状态 */
export type DroneStatus =
  | 'idle'          // 待命
  | 'flying'        // 飞行中
  | 'returning'     // 返航
  | 'charging'      // 充电中
  | 'maintenance'   // 维护中
  | 'offline'       // 离线

/** 无人机编队数据 */
export interface Drone {
  id: string
  name: string
  model: string
  status: DroneStatus
  battery: number           // 0-100 百分比
  location: {
    lat: number
    lng: number
    alt: number             // 海拔 米
  }
  speed: number             // m/s
  heading: number           // 航向角 0-360
  homeBase: string
  currentMission?: Mission
  lastMaintenance: string
  cameraStatus: 'online' | 'offline' | 'error'
  signalStrength: number    // 0-100
}

/** 任务状态 */
export type MissionStatus =
  | 'pending'
  | 'en_route'
  | 'surveying'
  | 'sampling'
  | 'returning'
  | 'completed'
  | 'aborted'

/** 无人机任务 */
export interface Mission {
  id: string
  droneId: string
  type: 'inspection' | 'survey' | 'sample_collection' | 'patrol'
  status: MissionStatus
  targetReportId?: string
  waypoints: Waypoint[]
  startedAt: string
  completedAt?: string
  estimatedDuration: number   // 分钟
  progress: number            // 0-100
}

/** 航点 */
export interface Waypoint {
  lat: number
  lng: number
  alt: number
  order: number
  action?: 'hover' | 'photo' | 'sample' | 'land'
}

/** 历史轨迹点 */
export interface FlightTrajectoryPoint {
  lat: number
  lng: number
  alt: number
  speed: number
  battery: number
  timestamp: string
}

/** 编队概要统计 */
export interface FleetSummary {
  total: number
  flying: number
  idle: number
  charging: number
  maintenance: number
  offline: number
  averageBattery: number
}