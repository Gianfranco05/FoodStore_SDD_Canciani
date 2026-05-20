import { type ReactNode, useState } from 'react'
import { cn } from '../../lib/utils'
import { Button } from './Button'

interface PageContainerProps {
  title: string
  description?: string
  helpContent?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function PageContainer({ title, description, helpContent, actions, children, className }: PageContainerProps) {
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <div className={cn('p-6 space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {helpContent && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHelpOpen(!helpOpen)}
                aria-label="Ayuda"
                className="rounded-full w-8 h-8 p-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
              </Button>
              {helpOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setHelpOpen(false)} />
                  <div className="absolute left-0 top-full mt-2 z-50 w-72 bg-card border border-border rounded-xl shadow-lg p-4 text-sm text-foreground">
                    <div className="space-y-3">{helpContent}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHelpOpen(false)}
                      className="mt-2 w-full"
                    >
                      Cerrar
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>

      {/* Content */}
      {children}
    </div>
  )
}
