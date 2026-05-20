import { useState, useEffect, useCallback, useMemo, useActionState } from 'react'
import { api } from '../../lib/api'
import { Badge, Button, Card, Modal, PageContainer, Pagination, TableSkeleton, ConfirmDialog } from '../../shared/ui'
import { HelpButton } from '../../shared/ui/HelpButton'
import { useFormModal } from '../../shared/hooks/useFormModal'
import { useConfirmDialog } from '../../shared/hooks/useConfirmDialog'
import { useUIStore } from '../../stores/uiStore'
import { handleError } from '../../shared/utils/logger'
import type { FormState } from '../../shared/types/form'
import { helpContent } from './helpContent'

interface CategoriaInfo {
  id: number
  nombre: string
}

interface IngredienteAsignado {
  id: number
  nombre: string
  cantidad: number
  alergeno: boolean
}

interface IngredienteDisponible {
  id: number
  nombre: string
}

interface Producto {
  id: number
  nombre: string
  descripcion?: string | null
  precio: number
  imagen_url?: string | null
  activo: boolean
  stock: number
  tiempo_preparacion_minutos: number
  categorias: CategoriaInfo[]
  ingredientes: IngredienteAsignado[]
  creado_en?: string
  actualizado_en?: string
  eliminado_en?: string | null
}

interface ProductoFormData {
  nombre: string
  descripcion: string
  precio: string
  imagen_url: string
  stock: string
  tiempo_preparacion_minutos: string
}

const emptyForm: ProductoFormData = {
  nombre: '',
  descripcion: '',
  precio: '',
  imagen_url: '',
  stock: '0',
  tiempo_preparacion_minutos: '15',
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(n)
}

export default function ProductosPage() {
  const [items, setItems] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const addToast = useUIStore((s) => s.addToast)
  const limit = 10
  const totalPages = Math.ceil(total / limit)

  // Secondary modal state
  const [showCategories, setShowCategories] = useState<number | null>(null)
  const [showIngredients, setShowIngredients] = useState<number | null>(null)
  const [showStock, setShowStock] = useState<number | null>(null)
  const [allCategories, setAllCategories] = useState<CategoriaInfo[]>([])
  const [allIngredients, setAllIngredients] = useState<IngredienteDisponible[]>([])
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([])
  const [selectedIngs, setSelectedIngs] = useState<{ ingrediente_id: number; cantidad: number }[]>([])
  const [stockOp, setStockOp] = useState<'set' | 'incrementar' | 'decrementar'>('set')
  const [stockQty, setStockQty] = useState('0')

  const modal = useFormModal<ProductoFormData, Producto>(emptyForm)
  const deleteDialog = useConfirmDialog<Producto>()

  const fetchItems = useCallback(async () => {
    try {
      const res = await api.get('/productos/', { params: { page, limit } })
      setItems(res.data.items)
      setTotal(res.data.total)
    } catch {
      addToast('Error al cargar productos', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, addToast])

  const fetchAuxData = useCallback(async () => {
    try {
      const [catRes, ingRes] = await Promise.all([
        api.get('/categorias/'),
        api.get('/ingredientes/', { params: { solo_disponibles: false, limit: 500 } }),
      ])
      const flattenCats = (cats: any[]): CategoriaInfo[] => {
        const result: CategoriaInfo[] = []
        for (const c of cats) {
          result.push({ id: c.id, nombre: c.nombre })
          if (c.subcategorias) result.push(...flattenCats(c.subcategorias))
        }
        return result
      }
      setAllCategories(flattenCats(catRes.data))
      setAllIngredients(ingRes.data.items || [])
    } catch {
      // Non-critical
    }
  }, [])

  useEffect(() => {
    fetchItems()
    fetchAuxData()
  }, [fetchItems, fetchAuxData])

  const openEditModal = useCallback(
    (item: Producto) => {
      modal.openEdit(item)
      modal.setFormData({
        nombre: item.nombre,
        descripcion: item.descripcion || '',
        precio: String(item.precio),
        imagen_url: item.imagen_url || '',
        stock: String(item.stock),
        tiempo_preparacion_minutos: String(item.tiempo_preparacion_minutos),
      })
    },
    [modal]
  )

  const submitAction = useCallback(
    async (_prevState: FormState<ProductoFormData>, formData: FormData): Promise<FormState<ProductoFormData>> => {
      const data: ProductoFormData = {
        nombre: formData.get('nombre') as string,
        descripcion: (formData.get('descripcion') as string) || '',
        precio: (formData.get('precio') as string) || '',
        imagen_url: (formData.get('imagen_url') as string) || '',
        stock: (formData.get('stock') as string) || '0',
        tiempo_preparacion_minutos: (formData.get('tiempo_preparacion_minutos') as string) || '15',
      }

      if (!data.nombre.trim()) {
        return { errors: { nombre: 'El nombre es requerido' }, isSuccess: false }
      }
      if (!data.precio || isNaN(parseFloat(data.precio))) {
        return { errors: { precio: 'El precio es requerido' }, isSuccess: false }
      }

      try {
        const payload: Record<string, unknown> = {
          nombre: data.nombre,
          precio: parseFloat(data.precio),
          stock: parseInt(data.stock) || 0,
          tiempo_preparacion_minutos: parseInt(data.tiempo_preparacion_minutos) || 15,
        }
        if (data.descripcion) payload.descripcion = data.descripcion
        if (data.imagen_url) payload.imagen_url = data.imagen_url

        if (modal.selectedItem) {
          await api.put(`/productos/${modal.selectedItem.id}`, payload)
          addToast('Producto actualizado', 'success')
        } else {
          await api.post('/productos/', payload)
          addToast('Producto creado', 'success')
        }
        fetchItems()
        return { isSuccess: true, message: 'Guardado correctamente' }
      } catch (error) {
        const message = handleError(error, 'ProductosPage.submitAction')
        addToast(`Error al guardar: ${message}`, 'error')
        return { isSuccess: false, message: `Error: ${message}` }
      }
    },
    [modal.selectedItem, fetchItems, addToast]
  )

  const [state, formAction, isPending] = useActionState<FormState<ProductoFormData>, FormData>(submitAction, {
    isSuccess: false,
  })

  if (state.isSuccess && modal.isOpen) {
    modal.close()
  }

  const handleDelete = useCallback(async () => {
    const item = deleteDialog.item
    if (!item) return

    try {
      await api.delete(`/productos/${item.id}`)
      addToast('Producto eliminado', 'success')
      fetchItems()
      deleteDialog.close()
    } catch (error) {
      const message = handleError(error, 'ProductosPage.handleDelete')
      addToast(`Error al eliminar: ${message}`, 'error')
    }
  }, [deleteDialog, fetchItems, addToast])

  const handleRestore = useCallback(async (producto: Producto) => {
    try {
      await api.post(`/productos/${producto.id}/restore`)
      addToast('Producto restaurado', 'success')
      fetchItems()
    } catch (error) {
      const message = handleError(error, 'ProductosPage.handleRestore')
      addToast(`Error al restaurar: ${message}`, 'error')
    }
  }, [fetchItems, addToast])

  // Category assignment handlers
  const openCategories = useCallback((producto: Producto) => {
    setShowCategories(producto.id)
    setSelectedCatIds(producto.categorias.map((c) => c.id))
  }, [])

  const saveCategories = useCallback(async () => {
    if (!showCategories) return
    try {
      await api.put(`/productos/${showCategories}/categorias`, { categoria_ids: selectedCatIds })
      addToast('Categorías asignadas', 'success')
      setShowCategories(null)
      fetchItems()
    } catch (error) {
      const message = handleError(error, 'ProductosPage.saveCategories')
      addToast(`Error: ${message}`, 'error')
    }
  }, [showCategories, selectedCatIds, fetchItems, addToast])

  const toggleCategory = useCallback((catId: number, checked: boolean) => {
    if (checked) {
      setSelectedCatIds((prev) => [...prev, catId])
    } else {
      setSelectedCatIds((prev) => prev.filter((id) => id !== catId))
    }
  }, [])

  // Ingredient assignment handlers
  const openIngredients = useCallback((producto: Producto) => {
    setShowIngredients(producto.id)
    setSelectedIngs(producto.ingredientes.map((i) => ({ ingrediente_id: i.id, cantidad: i.cantidad })))
  }, [])

  const saveIngredients = useCallback(async () => {
    if (!showIngredients) return
    try {
      await api.put(`/productos/${showIngredients}/ingredientes`, {
        ingredientes: selectedIngs.filter((i) => i.cantidad > 0),
      })
      addToast('Ingredientes asignados', 'success')
      setShowIngredients(null)
      fetchItems()
    } catch (error) {
      const message = handleError(error, 'ProductosPage.saveIngredients')
      addToast(`Error: ${message}`, 'error')
    }
  }, [showIngredients, selectedIngs, fetchItems, addToast])

  const toggleIngredient = useCallback((ingId: number, checked: boolean) => {
    if (checked) {
      setSelectedIngs((prev) => [...prev, { ingrediente_id: ingId, cantidad: 1 }])
    } else {
      setSelectedIngs((prev) => prev.filter((i) => i.ingrediente_id !== ingId))
    }
  }, [])

  const updateIngredientQty = useCallback((ingId: number, cantidad: number) => {
    setSelectedIngs((prev) => prev.map((i) => (i.ingrediente_id === ingId ? { ...i, cantidad } : i)))
  }, [])

  // Stock handlers
  const openStock = useCallback((producto: Producto) => {
    setShowStock(producto.id)
    setStockQty(String(producto.stock))
    setStockOp('set')
  }, [])

  const saveStock = useCallback(async () => {
    if (!showStock) return
    try {
      await api.patch(`/productos/${showStock}/stock`, {
        cantidad: parseInt(stockQty) || 0,
        operacion: stockOp,
      })
      addToast('Stock actualizado', 'success')
      setShowStock(null)
      fetchItems()
    } catch (error) {
      const message = handleError(error, 'ProductosPage.saveStock')
      addToast(`Error: ${message}`, 'error')
    }
  }, [showStock, stockOp, stockQty, fetchItems, addToast])

  const columns = useMemo(
    () => [
      {
        key: 'nombre',
        label: 'Producto',
        width: 'w-1/4',
        render: (item: Producto) => (
          <div>
            <p className={`font-medium ${item.eliminado_en ? 'line-through text-red-500' : 'text-foreground'}`}>
              {item.nombre}
            </p>
            {item.descripcion && (
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">{item.descripcion}</p>
            )}
          </div>
        ),
      },
      {
        key: 'precio',
        label: 'Precio',
        align: 'center',
        width: 'w-20',
        render: (item: Producto) => (
          <span className="text-center font-medium block">{formatCurrency(item.precio)}</span>
        ),
      },
      {
        key: 'stock',
        label: 'Stock',
        align: 'center',
        width: 'w-14',
        render: (item: Producto) => {
          const color =
            item.stock <= 0
              ? 'text-destructive'
              : item.stock < 10
                ? 'text-yellow-600'
                : 'text-primary'
          return <span className={`font-medium text-center block ${color}`}>{item.stock}</span>
        },
      },
      {
        key: 'activo',
        label: 'Estado',
        align: 'center',
        width: 'w-20',
        render: (item: Producto) =>
          item.eliminado_en
            ? <Badge variant="warning">Eliminado</Badge>
            : item.activo ? <Badge variant="success">Activo</Badge> : <Badge variant="danger">Inactivo</Badge>,
      },
      {
        key: 'categorias',
        label: 'Categ.',
        align: 'center',
        width: 'w-24',
        render: (item: Producto) => (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                openCategories(item)
              }}
              aria-label={`Asignar categorías a ${item.nombre}`}
            >
              {item.categorias.length > 0 ? `${item.categorias.length} cats` : 'Asignar'}
            </Button>
          </div>
        ),
      },
      {
        key: 'ingredientes',
        label: 'Ingred.',
        align: 'center',
        width: 'w-28',
        render: (item: Producto) => (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                openIngredients(item)
              }}
              aria-label={`Asignar ingredientes a ${item.nombre}`}
            >
              {item.ingredientes.length > 0 ? `${item.ingredientes.length} ings` : 'Asignar'}
            </Button>
          </div>
        ),
      },
      {
        key: 'acciones',
        label: 'Acciones',
        align: 'right',
        width: 'w-56',
        render: (item: Producto) =>
          item.eliminado_en ? (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  openEditModal(item)
                }}
                aria-label={`Editar ${item.nombre}`}
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
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRestore(item)
                }}
                className="text-green-600 hover:text-green-800 hover:bg-green-50"
                aria-label={`Restaurar ${item.nombre}`}
              >
                Restaurar
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  openStock(item)
                }}
                aria-label={`Actualizar stock de ${item.nombre}`}
              >
                Stock
              </Button>
              <div className="w-px h-5 bg-border mx-0.5" aria-hidden="true" />
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  openEditModal(item)
                }}
                aria-label={`Editar ${item.nombre}`}
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
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteDialog.open(item)
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                aria-label={`Eliminar ${item.nombre}`}
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
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </Button>
            </div>
          ),
      },
    ],
    [deleteDialog, openEditModal, openCategories, openIngredients, openStock, handleRestore]
  )

  if (loading) {
    return (
      <PageContainer title="Productos" description="Gestión de productos del menú" helpContent={helpContent.productos}>
        <Card className="p-6">
          <TableSkeleton rows={5} columns={7} />
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="Productos"
      description={`Gestión de productos del menú (${total} registros)`}
      helpContent={helpContent.productos}
      actions={<Button onClick={modal.openCreate}>+ Nuevo Producto</Button>}
    >
      {/* Main Product Form Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={modal.selectedItem ? 'Editar Producto' : 'Nuevo Producto'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={modal.close} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" form="producto-form" isLoading={isPending}>
              {modal.selectedItem ? 'Actualizar' : 'Crear'}
            </Button>
          </>
        }
      >
        <form id="producto-form" action={formAction} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpButton
              title="Formulario de Producto"
              content={
                <div className="space-y-3">
                  <p>
                    <strong>Completá los campos</strong> para crear o editar un producto:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Nombre:</strong> Nombre del producto.
                    </li>
                    <li>
                      <strong>Precio:</strong> Precio de venta en ARS.
                    </li>
                    <li>
                      <strong>Stock:</strong> Cantidad disponible inicial.
                    </li>
                    <li>
                      <strong>Tiempo de preparación:</strong> Minutos estimados.
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
            <label className="text-sm font-medium text-foreground block mb-1">
              Precio <span className="text-destructive">*</span>
            </label>
            <input
              name="precio"
              type="number"
              step="0.01"
              min="0"
              defaultValue={modal.selectedItem?.precio ?? modal.formData.precio}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background text-foreground"
              required
            />
            {state.errors?.precio && <p className="text-xs text-destructive mt-1">{state.errors.precio}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1">URL de imagen</label>
            <input
              name="imagen_url"
              defaultValue={modal.selectedItem?.imagen_url ?? modal.formData.imagen_url}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Stock inicial</label>
              <input
                name="stock"
                type="number"
                min="0"
                defaultValue={modal.selectedItem?.stock ?? modal.formData.stock}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Tiempo prep. (min)</label>
              <input
                name="tiempo_preparacion_minutos"
                type="number"
                min="1"
                defaultValue={modal.selectedItem?.tiempo_preparacion_minutos ?? modal.formData.tiempo_preparacion_minutos}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background text-foreground"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Category Assignment Modal */}
      <Modal
        isOpen={showCategories !== null}
        onClose={() => setShowCategories(null)}
        title="Asignar Categorías"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCategories(null)}>
              Cancelar
            </Button>
            <Button onClick={saveCategories}>Guardar</Button>
          </>
        }
      >
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {allCategories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 p-2 hover:bg-accent rounded-lg cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCatIds.includes(cat.id)}
                onChange={(e) => toggleCategory(cat.id, e.target.checked)}
                className="rounded border-border text-primary focus-visible:ring-ring"
              />
              <span className="text-sm text-foreground">{cat.nombre}</span>
            </label>
          ))}
          {allCategories.length === 0 && (
            <p className="text-sm text-muted-foreground">No hay categorías disponibles</p>
          )}
        </div>
      </Modal>

      {/* Ingredient Assignment Modal */}
      <Modal
        isOpen={showIngredients !== null}
        onClose={() => setShowIngredients(null)}
        title="Asignar Ingredientes"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowIngredients(null)}>
              Cancelar
            </Button>
            <Button onClick={saveIngredients}>Guardar</Button>
          </>
        }
      >
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {allIngredients.map((ing) => {
            const existing = selectedIngs.find((i) => i.ingrediente_id === ing.id)
            return (
              <div key={ing.id} className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg">
                <input
                  type="checkbox"
                  checked={!!existing}
                  onChange={(e) => toggleIngredient(ing.id, e.target.checked)}
                  className="rounded border-border text-primary focus-visible:ring-ring"
                />
                <span className="text-sm text-foreground flex-1">{ing.nombre}</span>
                {existing && (
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={existing.cantidad}
                    onChange={(e) => updateIngredientQty(ing.id, parseFloat(e.target.value) || 0)}
                    className="w-20 rounded border border-border px-2 py-1 text-sm text-right focus:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background text-foreground"
                  />
                )}
              </div>
            )
          })}
          {allIngredients.length === 0 && (
            <p className="text-sm text-muted-foreground">No hay ingredientes disponibles</p>
          )}
        </div>
      </Modal>

      {/* Stock Update Modal */}
      <Modal
        isOpen={showStock !== null}
        onClose={() => setShowStock(null)}
        title="Actualizar Stock"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowStock(null)}>
              Cancelar
            </Button>
            <Button onClick={saveStock}>Actualizar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Operación</label>
            <select
              value={stockOp}
              onChange={(e) => setStockOp(e.target.value as 'set' | 'incrementar' | 'decrementar')}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background text-foreground"
            >
              <option value="set">Seteado absoluto</option>
              <option value="incrementar">Incrementar</option>
              <option value="decrementar">Decrementar</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Cantidad</label>
            <input
              type="number"
              min="0"
              value={stockQty}
              onChange={(e) => setStockQty(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background text-foreground"
            />
          </div>
        </div>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="Eliminar Producto"
        message={`¿Estás seguro de eliminar "${deleteDialog.item?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
      />

      {/* Table */}
      {items.length === 0 ? (
        <Card className="p-6">
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">No hay productos todavía</p>
            <p className="text-sm">Creá el primer producto para comenzar</p>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-fixed">
              <thead className="bg-muted border-b border-border">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 font-medium text-muted-foreground ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.width ?? ''}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-accent transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.width ?? ''}`}>
                        {col.render(item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            itemsPerPage={limit}
            onPageChange={setPage}
          />
        </Card>
      )}
    </PageContainer>
  )
}
