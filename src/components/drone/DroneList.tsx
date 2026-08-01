import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDroneStore } from '@/store/droneStore'
import { droneService } from '@/services/droneService'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { droneStatusLabel, batteryColor } from '@/utils/format'
import type { Drone } from '@/types'

export function DroneList() {
  const navigate = useNavigate()
  const { drones, fleetSummary, isLoading, setDrones, setFleetSummary, setLoading, setError } = useDroneStore()

  useEffect(() => {
    setLoading(true)
    Promise.all([
      droneService.list(),
      droneService.getFleetSummary(),
    ])
      .then(([dronesList, summary]) => {
        setDrones(dronesList)
        setFleetSummary(summary)
      })
      .catch((err) => setError(err.message))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6">
      {fleetSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <StatBox label="总数" value={fleetSummary.total} color="text-gray-900" />
          <StatBox label="飞行中" value={fleetSummary.flying} color="text-blue-600" />
          <StatBox label="待命中" value={fleetSummary.idle} color="text-gray-600" />
          <StatBox label="充电中" value={fleetSummary.charging} color="text-green-600" />
          <StatBox label="维护中" value={fleetSummary.maintenance} color="text-yellow-600" />
          <StatBox label="离线" value={fleetSummary.offline} color="text-red-600" />
          <StatBox label="平均电量" value={`${fleetSummary.averageBattery}%`} color={batteryColor(fleetSummary.averageBattery)} />
        </div>
      )}

      <Card>
        <CardHeader title="无人机编队" action={<Button variant="outline" size="sm" onClick={() => window.location.reload()}>刷新</Button>} />
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-6 w-6 border-2 border-brand-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drones.map((drone) => (
              <DroneCard key={drone.id} drone={drone} onClick={() => navigate(`/drones/${drone.id}`)} />
            ))}
          </div>
        )}
        {!isLoading && drones.length === 0 && (
          <div className="text-center py-12 text-gray-500">暂无无人机数据</div>
        )}
      </Card>
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-semibold ${color}`}>{value}</p>
    </div>
  )
}

function DroneCard({ drone, onClick }: { drone: Drone; onClick: () => void }) {
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-900">{drone.name}</h4>
          <p className="text-xs text-gray-500">{drone.model}</p>
        </div>
        <Badge
          dot
          dotColor={drone.status === 'flying' ? '#2563eb' : drone.status === 'idle' ? '#6b7280' : '#f59e0b'}
          label={droneStatusLabel(drone.status)}
          className="bg-gray-100 text-gray-700"
        />
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
        <div>
          <span className="block text-gray-400">电量</span>
          <span className={batteryColor(drone.battery)}>{drone.battery}%</span>
        </div>
        <div>
          <span className="block text-gray-400">速度</span>
          <span>{drone.speed.toFixed(1)} m/s</span>
        </div>
        <div>
          <span className="block text-gray-400">信号</span>
          <span>{drone.signalStrength}%</span>
        </div>
      </div>
    </div>
  )
}