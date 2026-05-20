import { useState, useCallback } from 'react'

export function useFormModal<FormData, Entity = never>(
  initialFormData: FormData
) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Entity | null>(null)
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const openCreate = useCallback(() => {
    setSelectedItem(null)
    setFormData(initialFormData)
    setIsOpen(true)
  }, [initialFormData])

  const openEdit = useCallback((item: Entity) => {
    setSelectedItem(item)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setSelectedItem(null)
  }, [])

  return {
    isOpen,
    selectedItem,
    formData,
    setFormData,
    openCreate,
    openEdit,
    close,
  }
}
