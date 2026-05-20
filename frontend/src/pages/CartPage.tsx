import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore, useAuthStore } from '../stores'
import { Button } from '../shared/ui/Button'
import { Card } from '../shared/ui/Card'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCartStore()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const openCheckout = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/cart')
      return
    }
    navigate('/checkout')
  }, [isAuthenticated, navigate])

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-muted-foreground mb-6">
          <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Carrito de Compras</h1>
          <p className="text-sm text-muted-foreground">{totalItems()} producto{totalItems() !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="outline" onClick={() => { if (confirm('¿Vaciar carrito?')) clearCart() }}>
          Vaciar Carrito
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={`${item.productoId}-${(item.excludedIngredientIds || []).join(',')}`} className="p-4">
            <div className="flex gap-4">
              {/* Image placeholder */}
              <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center text-muted-foreground">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <Link to={`/productos/${item.productoId}`} className="font-semibold text-foreground hover:text-primary">
                      {item.nombre}
                    </Link>
                    {item.personalizacion && (
                      <p className="text-xs text-muted-foreground mt-1">{item.personalizacion}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.productoId)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productoId, item.cantidad - 1)}
                      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-8 text-center font-medium">{item.cantidad}</span>
                    <button
                      onClick={() => updateQuantity(item.productoId, item.cantidad + 1)}
                      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${(item.precio * item.cantidad).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">${item.precio.toFixed(2)} c/u</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="p-6 mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground">Subtotal ({totalItems()} items)</span>
          <span className="font-semibold">${totalPrice().toFixed(2)}</span>
        </div>
        <hr className="my-3" />
        <div className="flex items-center justify-between text-lg">
          <span className="font-bold text-foreground">Total</span>
          <span className="font-bold text-primary">${totalPrice().toFixed(2)}</span>
        </div>
        <Button className="w-full mt-4" size="lg" onClick={openCheckout}>
          Iniciar Pedido
        </Button>
      </Card>

    </div>
  )
}
