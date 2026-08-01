import { useEffect, useRef } from 'react'

/**
 * 轮询 hook — 按间隔反复执行回调
 */
export function usePolling(
  callback: () => void,
  intervalMs: number,
  enabled = true,
) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled || intervalMs <= 0) return

    // 先立即执行一次
    savedCallback.current()

    const id = setInterval(() => savedCallback.current(), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, enabled])
}

export default usePolling