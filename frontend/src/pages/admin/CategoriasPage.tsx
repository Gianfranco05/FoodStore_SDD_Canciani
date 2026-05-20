import { useState, useEffect, useCallback, useActionState } from 'react'
import { api } from '../../lib/api'
import { Button, Card, PageContainer, Modal, ConfirmDialog } from '../../shared/ui'
import { HelpButton } from '../../shared/ui/HelpButton'
import { useFormModal } from '../../shared/hooks/useFormModal'
import { useConfirmDialog } from '../../shared/hooks/useConfirmDialog'
import { useUIStore } from '../../stores/uiStore'
import { handleError } from '../../shared/utils/logger'
import type { FormState } from '../../shared/types/form'
import { helpContent } from './helpContent'

interface Categoria {
  id: number
  nombre: string
  descripcion?: string | null
  slug: string
  imagen_url?: string | null
  activo: boolean
  padre_id?: number | null
  subcategorias: Categoria[]
}

interface CategoriaFormData {
  nombre: string
  descripcion: string
  slug: string
  imagen_url: string
  padre_id: number | null
}

const emptyForm: CategoriaFormData = {
  nombre: '',
  descripcion: '',
  slug: '',
  imagen_url: '',
  padre_id: null,
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const addToast = useUIStore((s) => s.addToast)

  const modal = useFormModal<CategoriaFormData, Categoria>(emptyForm)
  const deleteDialog = useConfirmDialog<Categoria>()

  const fetchCategorias = useCallback(async () => {
    try {
      const res = await api.get('/categorias/')
      setCategorias(res.data)
    } catch {
      addToast('Error al cargar categorías', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchCategorias()
  }, [fetchCategorias])

  const openEditModal = useCallback(
    (cat: Categoria) => {
      modal.openEdit(cat)
      modal.setFormData({
        nombre: cat.nombre,
        descripcion: cat.descripcion || '',
        slug: cat.slug,
        imagen_url: cat.imagen_url || '',
        padre_id: cat.padre_id ?? null,
      })
    },
    [modal]
  )

  const submitAction = useCallback(
    async (_prevState: FormState<CategoriaFormData>, formData: FormData): Promise<FormState<CategoriaFormData>> => {
      const data: CategoriaFormData = {
        nombre: formData.get('nombre') as string,
        descripcion: (formData.get('descripcion') as string) || '',
        slug: (formData.get('slug') as string) || '',
        imagen_url: (formData.get('imagen_url') as string) || '',
        padre_id: formData.get('padre_id') ? Number(formData.get('padre_id')) : null,
      }

      if (!data.nombre.trim()) {
        return { errors: { nombre: 'El nombre es requerido' }, isSuccess: false }
      }

      try {
        const payload: Record<string, unknown> = { ...data }
        if (!payload.slug) payload.slug = data.nombre.toLowerCase().replace(/\s+/g, '-')
        if (!payload.imagen_url) delete payload.imagen_url
        if (!payload.descripcion) delete payload.descripcion
        if (payload.padre_id === null) delete payload.padre_id

        if (modal.selectedItem) {
          await api.put(`/categorias/${modal.selectedItem.id}`, payload)
          addToast('Categoría actualizada', 'success')
        } else {
          await api.post('/categorias/', payload)
          addToast('Categoría creada', 'success')
        }
        fetchCategorias()
        return { isSuccess: true, message: 'Guardado correctamente' }
      } catch (error) {
        const message = handleError(error, 'CategoriasPage.submitAction')
        addToast(`Error al guardar: ${message}`, 'error')
        return { isSuccess: false, message: `Error: ${message}` }
      }
    },
    [modal.selectedItem, fetchCategorias, addToast]
  )

  const [state, formAction, isPending] = useActionState<FormState<CategoriaFormData>, FormData>(submitAction, {
    isSuccess: false,
  })

  if (state.isSuccess && modal.isOpen) {
    modal.close()
  }

  const handleDelete = useCallback(async () => {
    const item = deleteDialog.item
    if (!item) return

    try {
      await api.delete(`/categorias/${item.id}`)
      addToast('Categoría eliminada', 'success')
      fetchCategorias()
      deleteDialog.close()
    } catch (error) {
      const message = handleError(error, 'CategoriasPage.handleDelete')
      addToast(`Error al eliminar: ${message}`, 'error')
    }
  }, [deleteDialog, fetchCategorias, addToast])

  function flattenForSelect(
    nodes: Categoria[],
    level = 0,
    excludeId?: number
  ): { id: number; nombre: string; level: number }[] {
    const result: { id: number; nombre: string; level: number }[] = []
    for (const cat of nodes) {
      if (cat.id !== excludeId) {
        result.push({ id: cat.id, nombre: cat.nombre, level })
        if (cat.subcategorias && cat.subcategorias.length > 0) {
          result.push(...flattenForSelect(cat.subcategorias, level + 1, excludeId))
        }
      }
    }
    return result
  }

  function renderTree(nodes: Categoria[], level = 0) {
    return (
      <ul className="space-y-1" style={{ paddingLeft: level > 0 ? 24 : 0 }}>
        {nodes.map((cat) => (
          <li key={cat.id}>
            <div className="flex items-center justify-between py-2 px-3 hover:bg-accent rounded-lg group">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{level > 0 ? '└─' : ''}</span>
                <span className="font-medium text-foreground">{cat.nombre}</span>
                {!cat.activo && (
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">inactivo</span>
                )}
                {cat.slug && <span className="text-xs text-muted-foreground hidden sm:inline">/{cat.slug}</span>}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    openEditModal(cat)
                  }}
                  aria-label={`Editar ${cat.nombre}`}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteDialog.open(cat)
                  }}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  aria-label={`Eliminar ${cat.nombre}`}
                >
                  Eliminar
                </Button>
              </div>
            </div>
            {cat.subcategorias && cat.subcategorias.length > 0 && renderTree(cat.subcategorias, level + 1)}
          </li>
        ))}
      </ul>
    )
  }

  if (loading) {
    return (
      <PageContainer title="Categorías" description="Gestión jerárquica de categorías del menú" helpContent={helpContent.categorias}>
        <Card className="p-8 text-center text-muted-foreground animate-pulse">
          <p>Cargando categorías...</p>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="Categorías"
      description="Gestión jerárquica de categorías del menú"
      helpContent={helpContent.categorias}
      actions={<Button onClick={modal.openCreate}>+ Nueva Categoría</Button>}
    >
      {/* Modal Form */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={modal.selectedItem ? 'Editar Categoría' : 'Nueva Categoría'}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={modal.close} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" form="categoria-form" isLoading={isPending}>
              {modal.selectedItem ? 'Actualizar' : 'Crear'}
            </Button>
          </>
        }
      >
        <form id="categoria-form" action={formAction} className="space-y-4">
          {/* HelpButton as first element */}
          <div className="flex items-center gap-2 mb-2">
            <HelpButton
              title="Formulario de Categoría"
              content={
                <div className="space-y-3">
                  <p>
                    <strong>Completá los campos</strong> para crear o editar una categoría:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Nombre:</strong> Nombre visible de la categoría.
                    </li>
                    <li>
                      <strong>Slug:</strong> Identificador URL. Se auto-genera si se deja vacío.
                    </li>
                    <li>
                      <strong>Categoría padre:</strong> Seleccioná una categoría existente para crear una subcategoría.
                    </li>
                  </ul>
                </div>
              }
            />
            <span className="text-sm text-muted-foreground">Ayuda sobre el formulario</span>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1">
              Nombre <span className="text-destructive">*</span>
            </label>
            <input
              name="nombre"
              defaultValue={modal.selectedItem?.nombre ?? modal.formData.nombre}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background text-foreground"
              required
            />
            {state.errors?.nombre && <p className="text-xs text-destructive mt-1">{state.errors.nombre}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Descripción</label>
            <textarea
              name="descripcion"
              defaultValue={modal.selectedItem?.descripcion ?? modal.formData.descripcion}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background text-foreground"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Slug (dejar vacío para auto-generar)</label>
            <input
              name="slug"
              defaultValue={modal.selectedItem?.slug ?? modal.formData.slug}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background text-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1">URL de imagen</label>
            <input
              name="imagen_url"
              defaultValue={modal.selectedItem?.imagen_url ?? modal.formData.imagen_url}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background text-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Categoría padre</label>
            <select
              name="padre_id"
              defaultValue={modal.selectedItem?.padre_id ?? modal.formData.padre_id ?? ''}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background text-foreground"
            >
              <option value="">— Ninguna (raíz) —</option>
              {flattenForSelect(categorias, 0, modal.selectedItem?.id).map((c) => (
                <option key={c.id} value={c.id}>
                  {'  '.repeat(c.level)}
                  {c.level > 0 ? '└─ ' : ''}
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="Eliminar Categoría"
        message={`¿Estás seguro de eliminar "${deleteDialog.item?.nombre}"?`}
        confirmLabel="Eliminar"
      />

      {/* Tree */}
      {categorias.length === 0 ? (
        <Card className="p-6">
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">No hay categorías todavía</p>
            <p className="text-sm">Creá la primera categoría para comenzar</p>
          </div>
        </Card>
      ) : (
        <Card className="p-4">{renderTree(categorias)}</Card>
      )}
    </PageContainer>
  )
}
