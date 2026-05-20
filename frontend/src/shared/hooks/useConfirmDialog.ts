import { useState, useCallback } from 'react'

export function useConfirmDialog<Entity>() {
  const [isOpen, setIsOpen] = useState(false)
  const [item, setItem] = useState<Entity | null>(null)

  const open = useCallback((entity: Entity) => {
    setItem(entity)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setItem(null)
  }, [])

  return {
    isOpen,
    item,
    open,
    close,
  }
}
