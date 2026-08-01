import { useState, useEffect } from 'react'
import { ReportMap } from '@/components/map/ReportMap'
import { DroneMap } from '@/components/map/DroneMap'
import { useDroneStore } from '@/store/droneStore'
import { droneService } from '@/services/droneService'

export function MapPage() {
  const [mode, setMode] = useState<'reports' | 'drones' | 'both'>('both')
  const { drones, setDrones, setError } = useDroneStore()

  useEffect(() => {
    droneService
      .list()
      .then(setDrones)
      .catch((err) => setError(err.message))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">交互式地图</h1>
        <div className="flex gap-2">
          {(['reports', 'drones', 'both'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {m === 'reports' ? '举报点' : m === 'drones' ? '无人机' : '综合视图'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {(mode === 'reports' || mode === 'both') && (
          <div>
            {mode === 'both' && <h2 className="text-sm font-medium text-gray-500 mb-2">垃圾举报点位</h2>}
            <ReportMap />
          </div>
        )}
        {(mode === 'drones' || mode === 'both') && (
          <div>
            {mode === 'both' && <h2 className="text-sm font-medium text-gray-500 mb-2 mt-4">无人机实时位置</h2>}
            <DroneMap drones={drones} />
          </div>
        )}
      </div>
    </div>
  )
}