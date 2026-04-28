import { Card } from '../shared/ui/Card'
import { Button } from '../shared/ui/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-600">FoodStore</h1>
          <nav className="flex gap-4">
            <Button variant="ghost" onClick={() => window.location.href = '/login'}>
              Ingresar
            </Button>
            <Button onClick={() => window.location.href = '/register'}>
              Registrarse
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Bienvenido a FoodStore
          </h2>
          <p className="text-gray-600 mb-6">
            Tu tienda de alimentos favoritos. Explora nuestros productos y hace tus pedidos.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.href = '/cart'}>
              Ver Carrito
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/orders'}>
              Mis Pedidos
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}