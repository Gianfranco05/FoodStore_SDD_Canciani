import { cn } from '../../lib/utils'

interface TableSkeletonProps {
  rows?: number
  columns?: number
  className?: string
}

export function TableSkeleton({ rows = 5, columns = 4, className }: TableSkeletonProps) {
  return (
    <div className={cn('animate-pulse', className)}>
      {/* Header */}
      <div className="flex gap-4 mb-3 pb-3 border-b border-border">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`h-${i}`} className="h-4 bg-muted rounded flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={`r-${r}`} className="flex gap-4 py-3 border-b border-border/50">
          {Array.from({ length: columns }).map((_, c) => (
            <div
              key={`c-${r}-${c}`}
              className="h-4 bg-muted rounded flex-1"
              style={{ opacity: 1 - (r * 0.1) }}
            />
          ))}
        </div>
      ))}
      <span className="sr-only">Cargando datos...</span>
    </div>
  )
}
