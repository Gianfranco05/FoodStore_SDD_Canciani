import { useState, type ReactNode } from 'react'
import { Button } from './Button'

interface HelpButtonProps {
  title: string
  content: ReactNode
  size?: 'sm' | 'md'
}

export function HelpButton({ title, content, size = 'sm' }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="inline-flex items-center gap-2">
      <Button
        variant="ghost"
        size={size}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Ayuda: ${title}`}
        className="rounded-full w-7 h-7 p-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
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
      <span className="text-sm text-muted-foreground">Ayuda</span>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 w-72 bg-card border border-border rounded-xl shadow-lg p-4 text-sm text-foreground">
            <div className="space-y-3">{content}</div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="mt-2 w-full">
              Cerrar
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
