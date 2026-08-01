/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly VITE_WS_URL: string
  readonly VITE_MAP_CENTER: string
  readonly VITE_MAP_ZOOM: string
  readonly VITE_TILE_URL: string
  readonly VITE_POLL_INTERVAL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}