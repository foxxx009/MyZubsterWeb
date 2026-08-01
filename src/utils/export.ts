/** 浏览器端触发文件下载 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

/** 生成 CSV 字符串 */
export function toCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: { key: keyof T; label: string }[],
): string {
  const header = columns.map(c => `"${c.label}"`).join(',')
  const rows = data.map(item =>
    columns
      .map(c => {
        const val = item[c.key]
        if (val == null) return ''
        const str = String(val)
        // 转义引号
        return `"${str.replace(/"/g, '""')}"`
      })
      .join(','),
  )
  return '\uFEFF' + [header, ...rows].join('\n')
}