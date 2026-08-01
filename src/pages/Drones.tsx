import { DroneList } from '@/components/drone/DroneList'

export function DronesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">无人机编队管理</h1>
      <DroneList />
    </div>
  )
}