import { useState, useCallback, useMemo, useActionState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../lib/adminApi'
import { Badge, Button, Card, Modal, PageContainer, TableSkeleton } from '../../shared/ui'
import { HelpButton } from '../../shared/ui/HelpButton'
import { useFormModal } from '../../shared/hooks/useFormModal'
import { usePagination } from '../../shared/hooks/usePagination'
import { useUIStore } from '../../stores/uiStore'
import { handleError } from '../../shared/utils/logger'
import type { FormState, TableColumn } from '../../shared/types/form'
import { helpContent } from './helpContent'

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

interface UserFormData {
  nombre: string
  telefono: string
  roles: string[]
}

const emptyForm: UserFormData = {
  nombre: '',
  telefono: '',
  roles: [],
}

export default function UsuariosPage() {
  const queryClient = useQueryClient()
  const addToast = useUIStore((s) => s.addToast)
  const [search, setSearch] = useState('')
  const [rolFilter, setRolFilter] = useState('')

  const modal = useFormModal<UserFormData, User>(emptyForm)

  const handleToggleActive = useCallback(
    async (user: User) => {
      try {
        await adminApi.toggleUserStatus(user.id, !user.activo)
        queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] })
        addToast(`Usuario ${user.activo ? 'desactivado' : 'activado'}`, 'success')
      } catch (error) {
        const msg = handleError(error, 'UsuariosPage.toggleActive')
        addToast(msg, 'error')
      }
    },
    [queryClient, addToast]
  )

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-usuarios', search, rolFilter],
    queryFn: () => adminApi.listUsers({ q: search || undefined, rol: rolFilter || undefined, skip: 0, limit: 100 }),
  })

  const users = data?.items ?? []

  const openEditModal = useCallback(
    (user: User) => {
      modal.openEdit(user)
      modal.setFormData({
        nombre: user.nombre,
        telefono: user.telefono || '',
        roles: [...user.roles],
      })
    },
    [modal]
  )

  const submitAction = useCallback(
    async (_prevState: FormState<UserFormData>, formData: FormData): Promise<FormState<UserFormData>> => {
      const rolesJson = formData.get('roles') as string
      const data: UserFormData = {
        nombre: formData.get('nombre') as string,
        telefono: (formData.get('telefono') as string) || '',
        roles: rolesJson ? JSON.parse(rolesJson) : [],
      }

      if (!data.nombre.trim()) {
        return { errors: { nombre: 'El nombre es requerido' }, isSuccess: false }
      }

      try {
        if (modal.selectedItem) {
          await adminApi.updateUser(modal.selectedItem.id, {
            nombre: data.nombre,
            telefono: data.telefono || undefined,
            roles: data.roles,
          })
          addToast('Usuario actualizado correctamente', 'success')
        }
        queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] })
        return { isSuccess: true, message: 'Guardado correctamente' }
      } catch (error) {
        const message = handleError(error, 'UsuariosPage.submitAction')
        addToast(`Error al guardar: ${message}`, 'error')
        return { isSuccess: false, message: `Error: ${message}` }
      }
    },
    [modal.selectedItem, queryClient, addToast]
  )

  const [state, formAction, isPending] = useActionState<FormState<UserFormData>, FormData>(submitAction, {
    isSuccess: false,
  })

  if (state.isSuccess && modal.isOpen) {
    modal.close()
  }

  const toggleRoleInForm = useCallback(
    (role: string) => {
      const currentRoles = modal.formData.roles
      const updated = currentRoles.includes(role)
        ? currentRoles.filter((r) => r !== role)
        : [...currentRoles, role]
      modal.setFormData((prev) => ({ ...prev, roles: updated }))
    },
    [modal]
  )

  const sortedItems = useMemo(
    () => [...users].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [users]
  )

  const { paginatedItems, currentPage, totalPages, totalItems, setCurrentPage } = usePagination(sortedItems, 20)

  const columns = useMemo(
    (): TableColumn<User>[] => [
      {
        key: 'nombre',
        label: 'Nombre',
        render: (item: User) => <span className="font-medium">{item.nombre}</span>,
      },
      {
        key: 'email',
        label: 'Email',
        render: (item: User) => <span className="text-muted-foreground">{item.email}</span>,
      },
      {
        key: 'telefono',
        label: 'Teléfono',
        width: 'w-28',
        align: 'center',
        render: (item: User) => (
          <span className="text-muted-foreground">{item.telefono || '—'}</span>
        ),
      },
      {
        key: 'roles',
        label: 'Roles',
        align: 'center',
        render: (item: User) => (
          <div className="flex flex-wrap gap-1 justify-center">
            {item.roles.map((r) => (
              <Badge key={r} variant="info">
                {r}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        key: 'activo',
        label: 'Activo',
        width: 'w-20',
        align: 'center',
        render: (item: User) =>
          item.activo ? <Badge variant="success">Activo</Badge> : <Badge variant="danger">Inactivo</Badge>,
      },
      {
        key: 'creado_en',
        label: 'Creado',
        width: 'w-24',
        align: 'center',
        render: (item: User) => (
          <span className="text-muted-foreground text-xs">
            {item.creado_en ? new Date(item.creado_en).toLocaleDateString() : '—'}
          </span>
        ),
      },
      {
        key: 'acciones',
        label: 'Acciones',
        width: 'w-28',
        align: 'center',
        render: (item: User) => (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleToggleActive(item)
              }}
              aria-label={`${item.activo ? 'Desactivar' : 'Activar'} ${item.nombre}`}
            >
              {item.activo ? (
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
                  <path d="M10.114 2.819a2 2 0 0 1 3.772 0l7.756 19.226A1 1 0 0 1 20.756 24H3.244a1 1 0 0 1-.886-1.955z" />
                  <path d="M12 10v6" />
                  <path d="M12 20h.01" />
                </svg>
              ) : (
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                </svg>
              )}
            </Button>
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
          </div>
        ),
      },
    ],
    [openEditModal, handleToggleActive]
  )

  if (isLoading) {
    return (
      <PageContainer title="Usuarios" description="Administración de usuarios del sistema" helpContent={helpContent.usuarios}>
        <Card className="p-6">
          <TableSkeleton rows={5} columns={7} />
        </Card>
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer title="Usuarios" description="Administración de usuarios del sistema" helpContent={helpContent.usuarios}>
        <Card className="p-6">
          <div className="text-center py-8">
            <h3 className="text-destructive font-semibold mb-2">Error al cargar usuarios</h3>
            <Button onClick={() => refetch()}>Reintentar</Button>
          </div>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="Usuarios"
      description="Administración de usuarios del sistema"
      helpContent={helpContent.usuarios}
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
          className="border border-border rounded-lg px-4 py-2 text-sm flex-1 max-w-md bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Buscar usuarios"
        />
        <select
          value={rolFilter}
          onChange={(e) => {
            setRolFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="border border-border rounded-lg px-4 py-2 text-sm bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Filtrar por rol"
        >
          <option value="">Todos los roles</option>
          {ROLES_DISPONIBLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title="Editar Usuario"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={modal.close} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" form="usuario-form" isLoading={isPending}>
              Guardar
            </Button>
          </>
        }
      >
        <form id="usuario-form" action={formAction} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpButton
              title="Formulario de Usuario"
              content={
                <div className="space-y-3">
                  <p>
                    <strong>Editá los datos</strong> del usuario:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Nombre:</strong> Nombre completo del usuario.
                    </li>
                    <li>
                      <strong>Teléfono:</strong> Número de contacto.
                    </li>
                    <li>
                      <strong>Roles:</strong> Seleccioná uno o más roles para asignar.
                    </li>
                  </ul>
                </div>
              }
            />
            <span className="text-sm text-muted-foreground">Ayuda sobre el formulario</span>
          </div>

          {/* Store roles as hidden JSON field */}
          <input
            type="hidden"
            name="roles"
            value={JSON.stringify(modal.formData.roles)}
          />

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
            <label className="text-sm font-medium text-foreground block mb-1">Teléfono</label>
            <input
              name="telefono"
              defaultValue={modal.selectedItem?.telefono ?? modal.formData.telefono}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background text-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Roles</label>
            <div className="space-y-2">
              {ROLES_DISPONIBLES.map((role) => (
                <label key={role} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modal.formData.roles.includes(role)}
                    onChange={() => toggleRoleInForm(role)}
                    className="rounded border-border text-primary focus-visible:ring-ring"
                  />
                  <span className="text-sm text-foreground">{role}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {/* Table */}
      {users.length === 0 ? (
        <Card className="p-6">
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">No se encontraron usuarios</p>
            <p className="text-sm mt-1">Intentá con otros filtros de búsqueda.</p>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 font-medium text-muted-foreground ${col.width ?? ''}`}
                      style={{ textAlign: col.align ?? 'left' }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-accent transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3 ${col.width ?? ''}`} style={{ textAlign: col.align ?? 'left' }}>
                        {col.render(item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <span className="text-sm text-muted-foreground">Total: {totalItems} usuarios</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  aria-label="Página anterior"
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Pág. {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  aria-label="Página siguiente"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </PageContainer>
  )
}
