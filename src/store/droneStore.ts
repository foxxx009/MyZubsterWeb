import { create } from 'zustand'
import type { Drone, FleetSummary, Mission, FlightTrajectoryPoint } from '@/types'

interface DroneState {
  drones: Drone[]
  selectedDrone: Drone | null
  fleetSummary: FleetSummary | null
  missions: Mission[]
  trajectory: FlightTrajectoryPoint[]
  isLoading: boolean
  error: string | null

  setDrones: (drones: Drone[]) => void
  setSelectedDrone: (drone: Drone | null) => void
  updateDrone: (id: string, updates: Partial<Drone>) => void
  setFleetSummary: (summary: FleetSummary) => void
  setMissions: (missions: Mission[]) => void
  setTrajectory: (points: FlightTrajectoryPoint[]) => void
  setLoading: (v: boolean) => void
  setError: (err: string | null) => void
}

export const useDroneStore = create<DroneState>((set) => ({
  drones: [],
  selectedDrone: null,
  fleetSummary: null,
  missions: [],
  trajectory: [],
  isLoading: false,
  error: null,

  setDrones: (drones) => set({ drones, isLoading: false, error: null }),
  setSelectedDrone: (drone) => set({ selectedDrone: drone }),
  updateDrone: (id, updates) =>
    set((state) => ({
      drones: state.drones.map((d) => (d.id === id ? { ...d, ...updates } : d)),
      selectedDrone:
        state.selectedDrone?.id === id
          ? { ...state.selectedDrone, ...updates }
          : state.selectedDrone,
    })),
  setFleetSummary: (summary) => set({ fleetSummary: summary }),
  setMissions: (missions) => set({ missions }),
  setTrajectory: (points) => set({ trajectory: points }),
  setLoading: (v) => set({ isLoading: v }),
  setError: (err) => set({ error: err, isLoading: false }),
}))

export default useDroneStore