import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productoId: number
  nombre: string
  precio: number
  cantidad: number
  imagen?: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productoId: number) => void
  updateQuantity: (productoId: number, cantidad: number) => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items
        const existing = items.find((i) => i.productoId === item.productoId)
        if (existing) {
          set({
            items: items.map((i) =>
              i.productoId === item.productoId
                ? { ...i, cantidad: i.cantidad + item.cantidad }
                : i
            ),
          })
        } else {
          set({ items: [...items, item] })
        }
      },
      removeItem: (productoId) => {
        set({ items: get().items.filter((i) => i.productoId !== productoId) })
      },
      updateQuantity: (productoId, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(productoId)
        } else {
          set({
            items: get().items.map((i) =>
              i.productoId === productoId ? { ...i, cantidad } : i
            ),
          })
        }
      },
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
)