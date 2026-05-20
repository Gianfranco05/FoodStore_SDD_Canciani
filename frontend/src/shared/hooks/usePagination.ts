import { useState, useMemo } from 'react'

export function usePagination<T>(sortedItems: T[], itemsPerPage = 20) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalItems = sortedItems.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedItems.slice(start, start + itemsPerPage)
  }, [sortedItems, currentPage, itemsPerPage])

  // Clamp current page if it exceeds total pages
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages)
  }

  return {
    paginatedItems,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    setCurrentPage,
  }
}
