import { Link, useNavigate } from 'react-router-dom'
import { Card } from '../shared/ui/Card'
import { Button } from '../shared/ui/Button'
import { useAuthStore } from '../stores'

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const isAdmin = isAuthenticated && user?.roles?.includes('admin')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            FoodStore
          </Link>
          <nav className="flex gap-4 items-center">
            {isAuthenticated && user ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.nombre} <span className="text-muted-foreground/60">({user.roles?.join(', ')})</span>
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Ingresar
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Registrarse
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            {isAdmin ? 'Panel de Administración' : 'Bienvenido a '}
            {!isAdmin && <span className="text-primary">FoodStore</span>}
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            {isAdmin
              ? 'Gestioná los productos, usuarios y configuración del sistema desde un solo lugar.'
              : 'Descubrí una experiencia única de comida. Productos frescos, preparación artesanal y el mejor sabor, directo a tu puerta.'
            }
          </p>

          {!isAdmin && (
            <Link to="/catalogo">
              <Button size="lg" className="px-10 py-4 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-shadow">
                Ver Catálogo
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Action Cards */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        {isAdmin ? (
          <>
            <p className="text-center text-muted-foreground mb-8 text-sm uppercase tracking-widest font-medium">
              Acceso Rápido
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Link to="/productos" className="block">
                <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Administrar Productos</h3>
                  <p className="text-sm text-muted-foreground">
                    Creá, editá y gestioná el catálogo de productos del menú.
                  </p>
                </Card>
              </Link>

              <Link to="/admin/usuarios" className="block">
                <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Ver Usuarios</h3>
                  <p className="text-sm text-muted-foreground">
                    Administrá los usuarios, roles y permisos del sistema.
                  </p>
                </Card>
              </Link>

              <Link to="/admin" className="block">
                <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Visualizá estadísticas, ventas y métricas del negocio.
                  </p>
                </Card>
              </Link>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Tu Carrito</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Revisá los productos que agregaste y finalizá tu pedido.
              </p>
              <Link to="/cart">
                <Button variant="outline" className="w-full">
                  Ver Carrito
                </Button>
              </Link>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Mis Pedidos</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Seguí el estado de tus pedidos en tiempo real.
              </p>
              <Link to="/orders">
                <Button variant="outline" className="w-full">
                  Ver Pedidos
                </Button>
              </Link>
            </Card>
          </div>
        )}
      </section>
    </div>
  )
}
