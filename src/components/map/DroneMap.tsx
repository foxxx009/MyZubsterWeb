import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Card } from '@/components/ui/Card'
import type { Drone } from '@/types'
import { parseMapCenter, parseMapZoom, parseTileURL, droneStatusIconColor } from '@/utils/map'
import { droneStatusLabel, batteryColor } from '@/utils/format'

function createDroneIcon(status: string): L.DivIcon {
  const color = droneStatusIconColor(status)
  return L.divIcon({
    className: 'drone-marker',
    html: `<div style="
      width: 32px; height: 32px;
      background: ${color};
      border: 2px solid white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
      transform: rotate(45deg);
    ">🚁</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  })
}

interface DroneMapProps {
  drones: Drone[]
  onSelectDrone?: (drone: Drone) => void
}

export function DroneMap({ drones, onSelectDrone }: DroneMapProps) {
  const center = parseMapCenter()
  const zoom = parseMapZoom()
  const tileURL = parseTileURL()

  return (
    <Card padding="none" className="overflow-hidden">
      <MapContainer center={center} zoom={zoom} className="h-[400px] w-full" scrollWheelZoom>
        <TileLayer url={tileURL} attribution="&copy; OpenStreetMap contributors" />
        {drones.map((drone) => (
          <Marker
            key={drone.id}
            position={[drone.location.lat, drone.location.lng]}
            icon={createDroneIcon(drone.status)}
            eventHandlers={{
              click: () => onSelectDrone?.(drone),
            }}
          >
            <Popup>
              <div className="text-sm min-w-[180px]">
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-gray-900">{drone.name}</strong>
                  <span className={`text-xs font-medium ${batteryColor(drone.battery)}`}>
                    🔋 {drone.battery}%
                  </span>
                </div>
                <p className="text-gray-500 text-xs mb-1">{drone.model}</p>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>{droneStatusLabel(drone.status)}</span>
                  <span>|</span>
                  <span>{drone.speed.toFixed(1)} m/s</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  )
}