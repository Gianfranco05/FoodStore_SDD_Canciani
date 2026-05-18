import { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores'
import { useUIStore } from '../stores/uiStore'
import { cn } from '../lib/utils'
import { Button } from '../shared/ui/Button'
import { CartBadge } from './CartBadge'

interface NavItem {
  label: string
  path: string
  icon: string
  roles?: string[]
}

const allNavItems: NavItem[] = [
  { label: 'Inicio', path: '/', icon: '🏠' },
  { label: 'Catálogo', path: '/catalogo', icon: '📦' },
  { label: 'Carrito', path: '/cart', icon: '🛒' },
  { label: 'Mis Pedidos', path: '/orders', icon: '📋', roles: ['cliente', 'admin'] },
  { label: 'Mi Perfil', path: '/perfil', icon: '👤', roles: ['cliente', 'admin', 'cocinero', 'repartidor'] },
  { label: 'Mis Direcciones', path: '/direcciones', icon: '📍', roles: ['cliente', 'admin'] },
  { label: 'Productos', path: '/productos', icon: '📦', roles: ['cocinero', 'admin'] },
  { label: 'Categorías', path: '/categorias', icon: '📁', roles: ['cocinero', 'admin'] },
  { label: 'Ingredientes', path: '/ingredientes', icon: '🧂', roles: ['admin'] },
  { label: 'Panel Pedidos', path: '/pedidos', icon: '📋', roles: ['repartidor', 'admin'] },
  { label: 'Usuarios', path: '/admin/usuarios', icon: '👥', roles: ['admin'] },
  { label: 'Dashboard', path: '/admin', icon: '📊', roles: ['admin'] },
  { label: 'Configuración', path: '/admin/config', icon: '⚙️', roles: ['admin'] },
]

/** Paths que NO debe ver un admin (son de cliente) */
const adminRestrictedPaths = ['/cart', '/orders', '/direcciones', '/perfil']

function getFilteredNavItems(userRoles: string[] | undefined): NavItem[] {
  if (!userRoles || userRoles.length === 0) {
    return allNavItems.filter((item) => !item.roles)
  }

  const isAdmin = userRoles.includes('admin')

  return allNavItems.filter((item) => {
    // Si es admin, ocultar paths de cliente
    if (isAdmin && adminRestrictedPaths.includes(item.path)) return false
    // Items públicos visibles para todos
    if (!item.roles) return true
    // Acceso por roles
    return item.roles.some((r) => userRoles.includes(r))
  })
}

function ThemeToggle() {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-accent transition-colors"
      aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  )
}

export function Layout() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = getFilteredNavItems(user?.roles)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-accent transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link to="/" className="text-xl font-bold text-primary">
              FoodStore
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />
            <CartBadge />
            {isAuthenticated && user ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.nombre}
                  <span className="text-muted-foreground/60 ml-1">
                    ({user.roles?.join(', ')})
                  </span>
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
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed lg:static inset-y-0 left-0 z-30 w-64 bg-card border-r border-border',
            'transform transition-transform duration-200 ease-in-out',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            'lg:translate-x-0 lg:block pt-16 lg:pt-4'
          )}
        >
          <nav className="px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
