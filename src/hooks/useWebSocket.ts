import { useEffect, useRef, useCallback, useState } from 'react'

type MessageHandler = (data: unknown) => void

interface UseWebSocketOptions {
  url: string
  onMessage?: MessageHandler
  onOpen?: () => void
  onClose?: () => void
  onError?: (err: Event) => void
  reconnectInterval?: number
  maxRetries?: number
}

interface UseWebSocketReturn {
  send: (data: string | ArrayBuffer) => void
  close: () => void
  isConnected: boolean
  retryCount: number
}

/**
 * WebSocket 连接 hook
 * 支持自动重连、心跳保活
 */
export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    url,
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectInterval = 5000,
    maxRetries = 10,
  } = options

  const wsRef = useRef<WebSocket | null>(null)
  const retryCountRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const [isConnected, setIsConnected] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      setIsConnected(true)
      retryCountRef.current = 0
      setRetryCount(0)
      onOpen?.()
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage?.(data)
      } catch {
        onMessage?.(event.data)
      }
    }

    ws.onclose = () => {
      setIsConnected(false)
      wsRef.current = null
      onClose?.()

      // 自动重连
      if (retryCountRef.current < maxRetries) {
        timerRef.current = setTimeout(() => {
          retryCountRef.current++
          setRetryCount(retryCountRef.current)
          connect()
        }, reconnectInterval)
      }
    }

    ws.onerror = (err) => {
      onError?.(err)
      ws.close()
    }
  }, [url, onMessage, onOpen, onClose, onError, reconnectInterval, maxRetries])

  useEffect(() => {
    connect()
    return () => {
      clearTimeout(timerRef.current)
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [connect])

  const send = useCallback((data: string | ArrayBuffer) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data)
    }
  }, [])

  const close = useCallback(() => {
    clearTimeout(timerRef.current)
    retryCountRef.current = maxRetries // 阻止重连
    wsRef.current?.close()
    wsRef.current = null
  }, [maxRetries])

  return { send, close, isConnected, retryCount }
}

export default useWebSocket