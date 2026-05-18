import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../lib/adminApi'
import { useUIStore } from '../../stores/uiStore'

const ROLES_DISPONIBLES = ['admin', 'cliente', 'cocinero', 'repartidor']

interface User {
  id: number
  email: string
  nombre: string
  telefono: string | null
  activo: boolean
  roles: string[]
  creado_en: string | null
}

export default function UsuariosPage() {
  const queryClient = useQueryClient()
  const addToast = useUIStore((s) => s.addToast)
  const [search, setSearch] = useState('')
  const [rolFilter, setRolFilter] = useState('')
  const [page, setPage] = useState(0)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({ nombre: '', telefono: '', roles: [] as string[] })

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-usuarios', search, rolFilter, page],
    queryFn: () => adminApi.listUsers({ q: search || undefined, rol: rolFilter || undefined, skip: page * 20, limit: 20 }),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, activo }: { id: number; activo: boolean }) => adminApi.toggleUserStatus(id, activo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] })
      addToast('Estado de usuario actualizado', 'success')
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail?.detail || 'Error al actualizar estado'
      addToast(msg, 'error')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { nombre?: string; telefono?: string; roles?: string[] } }) =>
      adminApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] })
      setEditUser(null)
      addToast('Usuario actualizado correctamente', 'success')
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail?.detail || 'Error al actualizar usuario'
      addToast(msg, 'error')
    },
  })

  const openEditModal = (user: User) => {
    setEditUser(user)
    setEditForm({ nombre: user.nombre, telefono: user.telefono || '', roles: [...user.roles] })
  }

  const handleSave = () => {
    if (!editUser) return
    updateMutation.mutate({ id: editUser.id, data: editForm })
  }

  const toggleRole = (role: string) => {
    setEditForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }))
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="p-6 text-center">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-destructive font-semibold mb-2">Error al cargar usuarios</h3>
          <button onClick={() => refetch()} className="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 text-sm">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const users = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / 20)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          className="border border-border rounded-lg px-4 py-2 text-sm flex-1 max-w-md"
        />
        <select
          value={rolFilter}
          onChange={(e) => { setRolFilter(e.target.value); setPage(0) }}
          className="border border-border rounded-lg px-4 py-2 text-sm"
        >
          <option value="">Todos los roles</option>
          {ROLES_DISPONIBLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No se encontraron usuarios</p>
          <p className="text-sm mt-1">Intentá con otros filtros de búsqueda.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-card rounded-xl shadow-sm border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Teléfono</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Roles</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Activo</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Creado</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user: User) => (
                <tr key={user.id} className="hover:bg-accent transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{user.nombre}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.telefono || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((r) => (
                        <span key={r} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleMutation.mutate({ id: user.id, activo: !user.activo })}
                      disabled={toggleMutation.isPending}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        user.activo ? 'bg-primary' : 'bg-muted-foreground/30'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          user.activo ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {user.creado_en ? new Date(user.creado_en).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => openEditModal(user)}
                      className="px-3 py-1 text-xs bg-muted text-foreground rounded-lg hover:bg-accent transition-colors"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 text-sm border border-border rounded-lg disabled:opacity-50 hover:bg-accent"
          >
            Anterior
          </button>
          <span className="text-sm text-muted-foreground">
            Página {page + 1} de {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1.5 text-sm border border-border rounded-lg disabled:opacity-50 hover:bg-accent"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditUser(null)}>
          <div className="bg-card rounded-xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-foreground mb-4">Editar Usuario</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nombre</label>
                <input
                  type="text"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm((p) => ({ ...p, nombre: e.target.value }))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Teléfono</label>
                <input
                  type="text"
                  value={editForm.telefono}
                  onChange={(e) => setEditForm((p) => ({ ...p, telefono: e.target.value }))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Roles</label>
                <div className="space-y-2">
                  {ROLES_DISPONIBLES.map((role) => (
                    <label key={role} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.roles.includes(role)}
                        onChange={() => toggleRole(role)}
                        className="rounded border-border text-primary focus-visible:ring-ring"
                      />
                      <span className="text-sm text-foreground">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
