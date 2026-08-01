import { format, formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

/** 格式化日期时间 */
export function formatDateTime(iso: string): string {
  return format(new Date(iso), 'yyyy-MM-dd HH:mm', { locale: zhCN })
}

/** 相对时间（"3 分钟前"） */
export function relativeTime(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: zhCN })
}

/** 类别 → 中文标签 */
export function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    mixed_waste: '混合垃圾',
    construction: '建筑垃圾',
    hazardous: '有害垃圾',
    recyclable: '可回收物',
    organic: '厨余垃圾',
    bulky: '大件垃圾',
    electronic: '电子垃圾',
    other: '其他',
  }
  return map[cat] || cat
}

/** 状态 → 中文标签 */
export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: '待受理',
    processing: '处理中',
    resolved: '已解决',
    rejected: '已拒绝',
  }
  return map[status] || status
}

/** 状态 → Tailwind 颜色类 */
export function statusColor(status: string): string {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }
  return map[status] || 'bg-gray-100 text-gray-800'
}

/** 优先级 → 中文 */
export function priorityLabel(p: string): string {
  const map: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急',
  }
  return map[p] || p
}

/** 优先级 → 颜色 */
export function priorityColor(p: string): string {
  const map: Record<string, string> = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  }
  return map[p] || 'bg-gray-100 text-gray-600'
}

/** 无人机状态 → 中文 */
export function droneStatusLabel(s: string): string {
  const map: Record<string, string> = {
    idle: '待命',
    flying: '飞行中',
    returning: '返航',
    charging: '充电中',
    maintenance: '维护中',
    offline: '离线',
  }
  return map[s] || s
}

/** 电池色标 */
export function batteryColor(pct: number): string {
  if (pct > 60) return 'text-green-600'
  if (pct > 20) return 'text-yellow-600'
  return 'text-red-600'
}

/** 签名度 → 中文 */
export function missionStatusLabel(s: string): string {
  const map: Record<string, string> = {
    pending: '等待中',
    en_route: '前往中',
    surveying: '勘测中',
    sampling: '采样中',
    returning: '返航中',
    completed: '已完成',
    aborted: '已中止',
  }
  return map[s] || s
}