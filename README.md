# MyZubster 市政管理平台

市政部门与运营商使用的垃圾举报与无人机作业管理 Web 仪表盘。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite 5
- **路由**: React Router v6
- **状态**: Zustand + TanStack React Query
- **地图**: Leaflet / React-Leaflet
- **图表**: Recharts
- **样式**: Tailwind CSS 3
- **认证**: JWT (Bearer Token)

## 功能

1. **实时举报展示** — 列表 + 地图双视图，支持状态筛选与分页
2. **统计仪表盘** — 举报总数、待受理、处理中、已解决、平均处理时长、按类别/区域分布
3. **数据导出** — CSV / GeoJSON 一键下载（支持服务端导出与客户端降级）
4. **状态流转管理** — 待受理 → 处理中 → 已解决 / 已拒绝，附带操作备注与审计日志
5. **无人机编队可视化** — 实时位置、电量、任务状态、飞行轨迹回放
6. **交互式地图** — Leaflet 地图，举报点聚合标记、无人机图标、图层切换
7. **管理员 API 对接** — 复用 `/api/admin/*` 接口

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发（默认端口 5173）
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview

# 代码检查
npm run lint

# TypeScript 类型检查
npm run typecheck
```

## 环境变量

复制 `.env.example` 为 `.env` 并修改：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `VITE_API_BASE` | API 基础地址 | `http://localhost:8080` |
| `VITE_WS_URL` | WebSocket 地址 | `ws://localhost:8080/ws` |
| `VITE_MAP_CENTER` | 地图初始中心 | `39.9042,116.4074` |
| `VITE_MAP_ZOOM` | 地图初始缩放 | `12` |
| `VITE_TILE_URL` | 瓦片图源 URL | OpenStreetMap 默认 |
| `VITE_POLL_INTERVAL` | 轮询间隔(ms) | `15000` |

## 项目结构

```
src/
├── main.tsx              # 入口
├── App.tsx               # 路由 & 全局 Provider
├── index.css             # Tailwind + 全局样式
├── types/                # TypeScript 类型定义
│   ├── index.ts
│   ├── report.ts         # 举报相关类型
│   ├── drone.ts          # 无人机相关类型
│   └── stats.ts          # 统计相关类型
├── services/             # API 服务层
│   ├── api.ts            # 基础 HTTP 客户端
│   ├── authService.ts    # 认证服务
│   ├── reportService.ts  # 举报服务
│   ├── droneService.ts   # 无人机服务
│   ├── statsService.ts   # 统计服务
│   └── exportService.ts  # 导出服务
├── hooks/                # 自定义 Hooks
│   ├── useAuth.ts        # 认证状态 (Zustand store)
│   ├── useWebSocket.ts   # WebSocket 连接
│   └── usePolling.ts     # 轮询
├── store/                # Zustand 状态管理
│   ├── appStore.ts       # 全局 UI 状态
│   ├── reportStore.ts    # 举报数据状态
│   └── droneStore.ts     # 无人机数据状态
├── utils/                # 工具函数
│   ├── format.ts         # 格式化/标签/颜色
│   ├── map.ts            # 地图工具
│   └── export.ts         # 导出工具
├── components/
│   ├── auth/             # 认证组件
│   ├── layout/           # 布局 (Sidebar/Header/Layout)
│   ├── ui/               # UI 基础组件 (Button/Card/Badge/Modal 等)
│   ├── dashboard/        # 仪表盘组件 (StatCard/CategoryPie/TrendChart)
│   ├── report/           # 举报组件 (ReportList/StatusActions)
│   ├── drone/            # 无人机组件 (DroneList)
│   ├── map/              # 地图组件 (ReportMap/DroneMap)
│   └── export/           # 导出组件 (ExportPanel)
└── pages/                # 页面
    ├── Login.tsx
    ├── Dashboard.tsx
    ├── Reports.tsx
    ├── ReportDetailPage.tsx
    ├── MapPage.tsx
    ├── Drones.tsx
    ├── DroneDetailPage.tsx
    └── Export.tsx
```

## 后端 API 约定

本前端预期后端提供以下 RESTful API：

### 认证
- `POST /auth/login` — 登录获取 JWT
- `GET /auth/profile` — 获取当前用户信息

### 举报管理 `/api/admin/reports`
- `GET /reports` — 分页列表（支持 status/category/priority/search/sort 参数）
- `GET /reports/all` — 全量数据（用于地图）
- `GET /reports/:id` — 详情
- `POST /reports/:id/transition` — 状态流转

### 无人机 `/api/admin/drones`
- `GET /drones` — 编队列表
- `GET /drones/summary` — 编队概览统计
- `GET /drones/:id` — 详情
- `GET /drones/:id/trajectory` — 飞行轨迹
- `GET /drones/:id/mission` — 当前任务

### 统计 `/api/admin/stats`
- `GET /stats/dashboard` — 仪表盘概览
- `GET /stats/by-category` — 类别分布
- `GET /stats/by-region` — 区域分布
- `GET /stats/trend` — 趋势数据
- `GET /stats/sla` — SLA 统计

### 导出 `/api/admin/export`
- `GET /export/csv` — 导出 CSV
- `GET /export/geojson` — 导出 GeoJSON

## 许可

MIT