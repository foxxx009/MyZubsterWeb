import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { droneService } from '@/services/droneService'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { DroneMap } from '@/components/map/DroneMap'
import {
  droneStatusLabel, batteryColor, formatDateTime, missionStatusLabel,
} from '@/utils/format'
import type { Drone, Mission, FlightTrajectoryPoint } from '@/types'

export function DroneDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [drone, setDrone] = useState<Drone | null>(null)
  const [mission, setMission] = useState<Mission | null>(null)
  const [trajectory, setTrajectory] = useState<FlightTrajectoryPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      droneService.getById(id),
      droneService.getCurrentMission(id),
      droneService.getTrajectory(id),
    ])
      .then(([d, m, t]) => {
        setDrone(d)
        setMission(m)
        setTrajectory(t)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Spinner size="lg" className="mx-auto mt-16" />
  if (error || !drone) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">{error || '无人机不存在'}</p>
        <Button variant="outline" onClick={() => navigate('/drones')}>返回编队</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={() => navigate('/drones')}>← 返回</Button>
        <h1 className="text-xl font-bold text-gray-900">{drone.name}</h1>
        <Badge
          dot
          dotColor={drone.status === 'flying' ? '#2563eb' : '#6b7280'}
          label={droneStatusLabel(drone.status)}
          className="bg-gray-100 text-gray-700"
        />
      </div>

      {/* 实时状态 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatusStat label="电量" value={`${drone.battery}%`} color={batteryColor(drone.battery)} />
        <StatusStat label="速度" value={`${drone.speed.toFixed(1)} m/s`} />
        <StatusStat label="航向" value={`${drone.heading}°`} />
        <StatusStat label="信号" value={`${drone.signalStrength}%`} />
        <StatusStat label="海拔" value={`${drone.location.alt.toFixed(1)} m`} />
        <StatusStat label="摄像机" value={drone.cameraStatus === 'online' ? '在线' : '离线'} />
        <StatusStat label="基地" value={drone.homeBase} />
        <StatusStat label="最近维护" value={formatDateTime(drone.lastMaintenance)} />
      </div>

      {/* 地图 */}
      <Card padding="none" className="overflow-hidden">
        <CardHeader title="实时位置" className="px-5 pt-5" />
        <DroneMap drones={[drone]} />
      </Card>

      {/* 当前任务 */}
      {mission && (
        <Card>
          <CardHeader title="当前任务" />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge label={missionStatusLabel(mission.status)} className="bg-blue-100 text-blue-700" />
              <span className="text-sm text-gray-500">{mission.type}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>进度:</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all"
                  style={{ width: `${mission.progress}%` }}
                />
              </div>
              <span className="text-xs font-medium">{mission.progress}%</span>
            </div>
            <p className="text-xs text-gray-400">
              开始: {formatDateTime(mission.startedAt)} | 预估: {mission.estimatedDuration} 分钟
            </p>
          </div>
        </Card>
      )}

      {/* 轨迹 */}
      {trajectory.length > 0 && (
        <Card>
          <CardHeader title="飞行轨迹" subtitle={`最近 ${trajectory.length} 个记录点`} />
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-gray-600">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3">时间</th>
                  <th className="text-left py-2 px-3">纬度</th>
                  <th className="text-left py-2 px-3">经度</th>
                  <th className="text-left py-2 px-3">海拔</th>
                  <th className="text-left py-2 px-3">速度</th>
                  <th className="text-left py-2 px-3">电量</th>
                </tr>
              </thead>
              <tbody>
                {trajectory.map((p, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3">{new Date(p.timestamp).toLocaleTimeString()}</td>
                    <td className="py-2 px-3">{p.lat.toFixed(4)}</td>
                    <td className="py-2 px-3">{p.lng.toFixed(4)}</td>
                    <td className="py-2 px-3">{p.alt.toFixed(1)}m</td>
                    <td className="py-2 px-3">{p.speed.toFixed(1)} m/s</td>
                    <td className="py-2 px-3">{p.battery}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

function StatusStat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-base font-semibold ${color || 'text-gray-900'}`}>{value}</p>
    </div>
  )
}