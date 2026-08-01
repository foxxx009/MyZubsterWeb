import { create } from 'zustand'
import type { Report, ReportQueryParams, PaginatedResponse } from '@/types'

interface ReportState {
  // 列表数据
  reports: Report[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  params: ReportQueryParams

  // 当前选中的举报
  selectedReport: Report | null

  // 地图全量数据
  allReports: Report[]

  // 加载状态
  isLoading: boolean
  isMapLoading: boolean
  error: string | null

  // Actions
  setReports: (res: PaginatedResponse<Report>) => void
  setAllReports: (reports: Report[]) => void
  setSelectedReport: (report: Report | null) => void
  setParams: (params: Partial<ReportQueryParams>) => void
  updateReport: (id: string, updates: Partial<Report>) => void
  removeReport: (id: string) => void
  setLoading: (v: boolean) => void
  setMapLoading: (v: boolean) => void
  setError: (err: string | null) => void
  reset: () => void
}

const initialParams: ReportQueryParams = {
  page: 1,
  pageSize: 20,
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  total: 0,
  page: 1,
  pageSize: 20,
  totalPages: 0,
  params: initialParams,
  selectedReport: null,
  allReports: [],
  isLoading: false,
  isMapLoading: false,
  error: null,

  setReports: (res) =>
    set({
      reports: res.data,
      total: res.total,
      page: res.page,
      pageSize: res.pageSize,
      totalPages: res.totalPages,
      isLoading: false,
      error: null,
    }),

  setAllReports: (reports) =>
    set({ allReports: reports, isMapLoading: false }),

  setSelectedReport: (report) => set({ selectedReport: report }),

  setParams: (params) =>
    set((state) => ({
      params: { ...state.params, ...params },
    })),

  updateReport: (id, updates) =>
    set((state) => ({
      reports: state.reports.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      allReports: state.allReports.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      selectedReport:
        state.selectedReport?.id === id
          ? { ...state.selectedReport, ...updates }
          : state.selectedReport,
    })),

  removeReport: (id) =>
    set((state) => ({
      reports: state.reports.filter((r) => r.id !== id),
      allReports: state.allReports.filter((r) => r.id !== id),
      selectedReport:
        state.selectedReport?.id === id ? null : state.selectedReport,
    })),

  setLoading: (v) => set({ isLoading: v }),
  setMapLoading: (v) => set({ isMapLoading: v }),
  setError: (err) => set({ error: err, isLoading: false }),
  reset: () =>
    set({
      reports: [],
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
      params: initialParams,
      selectedReport: null,
      allReports: [],
      isLoading: false,
      isMapLoading: false,
      error: null,
    }),
}))

export default useReportStore