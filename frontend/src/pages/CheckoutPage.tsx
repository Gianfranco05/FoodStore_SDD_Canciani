import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores'
import { api } from '../lib/api'
import { Button } from '../shared/ui/Button'
import { Input } from '../shared/ui/Input'
import { Card } from '../shared/ui/Card'
import { useUIStore } from '../stores/uiStore'

interface Direccion {
  id: number
  nombre: string
  calle: string
  numero: string
  ciudad: string
  provincia?: string | null
  codigo_postal: string
  referencias?: string | null
  es_default: boolean
}

interface DireccionForm {
  nombre: string
  calle: string
  numero: string
  ciudad: string
  provincia: string
  codigo_postal: string
  referencias: string
}

const emptyForm: DireccionForm = {
  nombre: '',
  calle: '',
  numero: '',
  ciudad: '',
  provincia: '',
  codigo_postal: '',
  referencias: '',
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCartStore()
  const navigate = useNavigate()
  const addToast = useUIStore((s) => s.addToast)

  const [direcciones, setDirecciones] = useState<Direccion[]>([])
  const [selectedDirId, setSelectedDirId] = useState<number | null>(null)
  const [loadingDirs, setLoadingDirs] = useState(true)
  const [creating, setCreating] = useState(false)

  // Address form modal
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState<DireccionForm>(emptyForm)
  const [savingAddress, setSavingAddress] = useState(false)

  const fetchDirecciones = useCallback(async () => {
    try {
      const res = await api.get('/direcciones/')
      const dirs: Direccion[] = res.data
      setDirecciones(dirs)
      const defaultDir = dirs.find((d) => d.es_default)
      if (defaultDir) setSelectedDirId(defaultDir.id)
      else if (dirs.length > 0) setSelectedDirId(dirs[0].id)
    } catch {
      addToast('Error al cargar direcciones', 'error')
    } finally {
      setLoadingDirs(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchDirecciones()
  }, [fetchDirecciones])

  const handleSaveAddress = async () => {
    setSavingAddress(true)
    try {
      const payload: Record<string, string | boolean> = { ...addressForm }
      if (!payload.provincia) delete payload.provincia
      if (!payload.referencias) delete payload.referencias

      const res = await api.post('/direcciones/', payload)
      const nueva: Direccion = res.data
      setDirecciones((prev) => [...prev, nueva])
      setSelectedDirId(nueva.id)
      setShowAddressForm(false)
      setAddressForm(emptyForm)
      addToast('Dirección creada', 'success')
    } catch (err: any) {
      const detail = err.response?.data?.detail
      addToast(detail || 'Error al guardar dirección', 'error')
    } finally {
      setSavingAddress(false)
    }
  }

  const handleCreateOrder = async () => {
    if (!selectedDirId) {
      addToast('Seleccioná una dirección de entrega', 'warning')
      return
    }
    setCreating(true)
    try {
      const payload = {
        direccion_entrega_id: selectedDirId,
        items: items.map((item) => ({
          producto_id: item.productoId,
          nombre_snapshot: item.nombre,
          precio_snapshot: item.precio,
          cantidad: item.cantidad,
          excluded_ingredient_ids: (item.excludedIngredientIds || []).join(','),
          personalizacion_snapshot: item.personalizacion || null,
        })),
      }
      const res = await api.post('/pedidos', payload)
      clearCart()
      addToast('Pedido creado con éxito!', 'success')
      navigate(`/orders/${res.data.id}`)
    } catch (err: any) {
      const detail = err.response?.data?.detail
      addToast(detail || 'Error al crear pedido', 'error')
    } finally {
      setCreating(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-muted-foreground mb-6">
          <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Tu carrito está vacío</h1>
        <p className="text-muted-foreground mb-6">Agregá productos desde el catálogo para empezar</p>
        <Link to="/catalogo">
          <Button>Ver Catálogo</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/cart" className="text-sm text-primary hover:text-primary/80 mb-2 inline-block">
            &larr; Volver al carrito
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Confirmar Pedido</h1>
          <p className="text-muted-foreground mt-1">Revisá los productos y elegí la dirección de entrega</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column: Products summary */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Productos ({totalItems()})
              </h2>
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={`${item.productoId}-${(item.excludedIngredientIds || []).join(',')}`}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/productos/${item.productoId}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {item.nombre}
                      </Link>
                      {item.personalizacion && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.personalizacion}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ${item.precio.toFixed(2)} c/u
                      </p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <span className="text-sm text-muted-foreground">x{item.cantidad}</span>
                      <span className="font-semibold text-foreground w-20 text-right">
                        ${(item.precio * item.cantidad).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column: Address + Total */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery address */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Dirección de Entrega</h2>
                <Button variant="outline" size="sm" onClick={() => setShowAddressForm(true)}>
                  + Nueva
                </Button>
              </div>

              {loadingDirs ? (
                <p className="text-sm text-muted-foreground">Cargando direcciones...</p>
              ) : direcciones.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  <p className="mb-3">No tenés direcciones guardadas.</p>
                  <Button size="sm" onClick={() => setShowAddressForm(true)}>
                    + Agregar Dirección
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {direcciones.map((dir) => (
                    <label
                      key={dir.id}
                      className={`
                        flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                        ${selectedDirId === dir.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-border'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="direccion"
                        checked={selectedDirId === dir.id}
                        onChange={() => setSelectedDirId(dir.id)}
                        className="mt-1 text-primary focus-visible:ring-ring"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-foreground">{dir.nombre}</span>
                          {dir.es_default && (
                            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {dir.calle} {dir.numero}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dir.ciudad}{dir.provincia ? `, ${dir.provincia}` : ''}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </Card>

            {/* Total + Confirm */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Resumen</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({totalItems()} items)</span>
                  <span className="text-foreground">${totalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="text-foreground">A calcular</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold text-primary">${totalPrice().toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handleCreateOrder}
                disabled={creating || !selectedDirId}
              >
                {creating ? 'Creando Pedido...' : 'Confirmar Pedido'}
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Address form modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Nueva Dirección</h2>
            <div className="space-y-4">
              <Input
                label="Nombre *"
                value={addressForm.nombre}
                onChange={(e) => setAddressForm({ ...addressForm, nombre: e.target.value })}
                placeholder="Ej: Casa, Trabajo"
                required
              />
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <Input
                    label="Calle *"
                    value={addressForm.calle}
                    onChange={(e) => setAddressForm({ ...addressForm, calle: e.target.value })}
                    required
                  />
                </div>
                <Input
                  label="Número *"
                  value={addressForm.numero}
                  onChange={(e) => setAddressForm({ ...addressForm, numero: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Ciudad *"
                  value={addressForm.ciudad}
                  onChange={(e) => setAddressForm({ ...addressForm, ciudad: e.target.value })}
                  required
                />
                <Input
                  label="Provincia"
                  value={addressForm.provincia}
                  onChange={(e) => setAddressForm({ ...addressForm, provincia: e.target.value })}
                />
              </div>
              <Input
                label="Código Postal *"
                value={addressForm.codigo_postal}
                onChange={(e) => setAddressForm({ ...addressForm, codigo_postal: e.target.value })}
                required
              />
              <Input
                label="Referencias"
                value={addressForm.referencias}
                onChange={(e) => setAddressForm({ ...addressForm, referencias: e.target.value })}
                placeholder="Ej: Depto 3, entre calle X y Y"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddressForm(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSaveAddress}
                disabled={
                  savingAddress ||
                  !addressForm.nombre ||
                  !addressForm.calle ||
                  !addressForm.numero ||
                  !addressForm.ciudad ||
                  !addressForm.codigo_postal
                }
              >
                {savingAddress ? 'Guardando...' : 'Guardar Dirección'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
