import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Card } from '@/components/ui/Card'
import { useReportStore } from '@/store/reportStore'
import { reportService } from '@/services/reportService'
import { parseMapCenter, parseMapZoom, parseTileURL, categoryIcon } from '@/utils/map'
import { statusLabel, statusColor } from '@/utils/format'


// 自定义 Marker 图标（SVG 方式避免加载默认图片）
function createMarkerIcon(status: string): L.DivIcon {
  const colorMap: Record<string, string> = {
    pending: '#f59e0b',
    processing: '#3b82f6',
    resolved: '#10b981',
    rejected: '#ef4444',
  }
  const color = colorMap[status] || '#6b7280'
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 28px; height: 28px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px;
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  })
}

function MapController() {
  const map = useMap()
  const allReports = useReportStore((s) => s.allReports)

  useEffect(() => {
    if (allReports.length > 0) {
      const bounds = L.latLngBounds(
        allReports.map((r) => [r.location.lat, r.location.lng] as L.LatLngTuple),
      )
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
      }
    }
  }, [allReports, map])

  return null
}

export function ReportMap() {
  const { allReports, setAllReports, isMapLoading, setMapLoading, setError } = useReportStore()

  useEffect(() => {
    if (allReports.length === 0) {
      setMapLoading(true)
      reportService
        .getAll()
        .then(setAllReports)
        .catch((err) => setError(err.message))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const center = parseMapCenter()
  const zoom = parseMapZoom()
  const tileURL = parseTileURL()

  return (
    <Card padding="none" className="overflow-hidden">
      {isMapLoading && (
        <div className="absolute inset-0 z-[1000] bg-white/60 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-brand-600 border-t-transparent rounded-full" />
        </div>
      )}
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-[500px] w-full"
        scrollWheelZoom
      >
        <TileLayer url={tileURL} attribution="&copy; OpenStreetMap contributors" />
        <MapController />
        {allReports.map((report) => (
          <Marker
            key={report.id}
            position={[report.location.lat, report.location.lng]}
            icon={createMarkerIcon(report.status)}
          >
            <Popup>
              <div className="text-sm min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <span>{categoryIcon(report.category)}</span>
                  <strong className="text-gray-900">{report.title}</strong>
                </div>
                <p className="text-gray-500 text-xs mb-2">{report.location.address}</p>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColor(report.status)}`}>
                  {statusLabel(report.status)}
                </span>
                <p className="text-gray-400 text-xs mt-2">{report.createdAt}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  )
}