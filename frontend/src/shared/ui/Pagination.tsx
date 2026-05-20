import { Button } from './Button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex items-center justify-between pt-4 border-t border-border">
      <p className="text-sm text-muted-foreground">
        Mostrando <span className="font-medium">{startItem}</span>–<span className="font-medium">{endItem}</span> de{' '}
        <span className="font-medium">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="bg-muted hover:bg-muted/80"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Página anterior"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Anterior
        </Button>
        <span className="px-3 text-sm text-muted-foreground">
          Pág. {currentPage} de {totalPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="bg-muted hover:bg-muted/80"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Página siguiente"
        >
          Siguiente
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
