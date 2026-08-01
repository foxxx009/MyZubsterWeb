import type { Report } from '@/types'

const BASE = '/admin/export'

export const exportService = {
  /** 导出 CSV */
  async downloadCSV(params?: { status?: string; category?: string }): Promise<Blob> {
    const token = localStorage.getItem('auth_token')
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    const res = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}${BASE}/csv${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) throw new Error(`CSV export failed: ${res.status}`)
    return res.blob()
  },

  /** 导出 GeoJSON */
  async downloadGeoJSON(params?: { status?: string; category?: string }): Promise<Blob> {
    const token = localStorage.getItem('auth_token')
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    const res = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}${BASE}/geojson${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) throw new Error(`GeoJSON export failed: ${res.status}`)
    return res.blob()
  },

  /** 客户端侧 CSV 导出（无需后端支持时的降级方案） */
  clientSideCSV(reports: Report[]): void {
    const headers = ['ID', '标题', '类别', '状态', '优先级', '纬度', '经度', '地址', '创建时间', '处理时间']
    const rows = reports.map(r => [
      r.id, r.title, r.category, r.status, r.priority,
      r.location.lat, r.location.lng,
      `"${r.location.address.replace(/"/g, '""')}"`,
      r.createdAt, r.resolvedAt || '',
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    downloadBlob(blob, 'reports.csv')
  },

  /** 客户端侧 GeoJSON 导出 */
  clientSideGeoJSON(reports: Report[]): void {
    const geojson = {
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
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' })
    downloadBlob(blob, 'reports.geojson')
  },
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default exportService