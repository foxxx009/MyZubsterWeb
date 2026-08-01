import React from 'react'
import { clsx } from 'clsx'

export interface TableColumn<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  className?: string
  sortable?: boolean
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor: (row: T) => string | number
  onRowClick?: (row: T) => void
  emptyText?: string
  loading?: boolean
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyText = '暂无数据',
  loading = false,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="animate-spin h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 text-sm">{emptyText}</div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={clsx(onRowClick && 'cursor-pointer hover:bg-gray-50')}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={clsx('px-4 py-3 text-sm text-gray-700 whitespace-nowrap', col.className)}
                >
                  {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}