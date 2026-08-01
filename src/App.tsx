import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from '@/components/layout/Layout'
import { PrivateRoute } from '@/components/auth/PrivateRoute'
import { LoginPage } from '@/pages/Login'
import { DashboardPage } from '@/pages/Dashboard'
import { ReportsPage } from '@/pages/Reports'
import { ReportDetailPage } from '@/pages/ReportDetailPage'
import { MapPage } from '@/pages/MapPage'
import { DronesPage } from '@/pages/Drones'
import { DroneDetailPage } from '@/pages/DroneDetailPage'
import { ExportPage } from '@/pages/Export'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* 需要认证的路由 */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/reports/:id" element={<ReportDetailPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/drones" element={<DronesPage />} />
              <Route path="/drones/:id" element={<DroneDetailPage />} />
              <Route path="/export" element={<ExportPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}