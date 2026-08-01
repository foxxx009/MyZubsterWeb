import type { Report } from '@/types'

/** 解析地图中心坐标 */
export function parseMapCenter(): [number, number] {
  const raw = import.meta.env.VITE_MAP_CENTER || '39.9042,116.4074'
  const parts = raw.split(',').map(Number)
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts as [number, number]
  }
  return [39.9042, 116.4074]
}

/** 默认缩放级 */
export function parseMapZoom(): number {
  const raw = import.meta.env.VITE_MAP_ZOOM || '12'
  const n = Number(raw)
  return isNaN(n) ? 12 : n
}

/** 默认瓦片图源 */
export function parseTileURL(): string {
  return import.meta.env.VITE_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}

/** 无人机图标颜色映射 */
export function droneStatusIconColor(status: string): string {
  const map: Record<string, string> = {
    idle: '#6b7280',
    flying: '#2563eb',
    returning: '#f59e0b',
    charging: '#10b981',
    maintenance: '#ef4444',
    offline: '#9ca3af',
  }
  return map[status] || '#6b7280'
}

/** 举报类别图标映射 */
export function categoryIcon(cat: string): string {
  const map: Record<string, string> = {
    mixed_waste: '🗑️',
    construction: '🏗️',
    hazardous: '☣️',
    recyclable: '♻️',
    organic: '🍂',
    bulky: '📦',
    electronic: '💻',
    other: '📌',
  }
  return map[cat] || '📌'
}

/** 将举报数据转为 GeoJSON FeatureCollection */
export function reportsToGeoJSON(reports: Report[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: reports.map(r => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [r.location.lng, r.location.lat],
      },
      properties: {
        id: r.id,
        title: r.title,
        category: r.category,
        status: r.status,
        priority: r.priority,
        address: r.location.address,
        createdAt: r.createdAt,
      },
    })),
  }
}