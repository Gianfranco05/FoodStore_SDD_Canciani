import { Routes, Route, Navigate } from 'react-router-dom'
import { TestConnection } from '../pages/TestConnectionPage'
import HomePage from '../pages/HomePage'

export const routes = [
  { path: '/', component: () => import('../pages/HomePage') },
  { path: '/test', component: () => import('../pages/TestConnectionPage') },
]

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-500">Próximamente disponible</p>
      </div>
    </div>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/test" element={<TestConnection />} />
      <Route path="/login" element={<PlaceholderPage title="Iniciar Sesión" />} />
      <Route path="/register" element={<PlaceholderPage title="Registrarse" />} />
      <Route path="/cart" element={<PlaceholderPage title="Carrito" />} />
      <Route path="/orders" element={<PlaceholderPage title="Mis Pedidos" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}