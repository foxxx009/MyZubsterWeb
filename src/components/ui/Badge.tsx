import { clsx } from 'clsx'

interface BadgeProps {
  label: string
  className?: string
  dot?: boolean
  dotColor?: string
}

export function Badge({ label, className, dot, dotColor }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        className,
      )}
    >
      {dot && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={dotColor ? { backgroundColor: dotColor } : undefined}
        />
      )}
      {label}
    </span>
  )
}