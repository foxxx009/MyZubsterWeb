import { clsx } from 'clsx'

interface Tab {
  key: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  active: string
  onChange: (key: string) => void
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex border-b border-gray-200 gap-0">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={clsx(
            'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
            active === tab.key
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={clsx(
                'ml-2 rounded-full px-2 py-0.5 text-xs',
                active === tab.key
                  ? 'bg-brand-100 text-brand-700'
                  : 'bg-gray-100 text-gray-600',
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}