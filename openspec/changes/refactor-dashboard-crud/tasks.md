## 1. Shared Types

- [x] 1.1 Crear `frontend/src/shared/types/form.ts` con `FormState<T>` interfaz (`isSuccess: boolean`, `errors?: Record<string, string>`, `message?: string`) y `TableColumn<T>` genérico (`key`, `label`, `render`, `width?`, `sortable?`)

## 2. Shared Hooks

- [x] 2.1 Crear `frontend/src/shared/hooks/useFormModal.ts`: hook genérico `useFormModal<FormData, Entity>` con `isOpen`, `selectedItem`, `formData`, `openCreate()`, `openEdit(entity)`, `close()`, `setFormData(updater)`
- [x] 2.2 Crear `frontend/src/shared/hooks/useConfirmDialog.ts`: hook genérico `useConfirmDialog<Entity>` con `isOpen`, `item`, `open(entity)`, `close()`
- [x] 2.3 Crear `frontend/src/shared/hooks/usePagination.ts`: hook `usePagination<T>(sortedItems: T[])` con `paginatedItems`, `currentPage`, `totalPages`, `totalItems`, `itemsPerPage`, `setCurrentPage`
- [x] 2.4 Crear `frontend/src/shared/hooks/index.ts` como barrel export

## 3. Shared Components

- [x] 3.1 Crear `frontend/src/shared/ui/Modal.tsx`: componente Modal reutilizable con backdrop overlay, `isOpen`, `onClose`, `title`, `size` ('sm'|'md'|'lg'), `footer` (ReactNode), children, y cierre con Escape y click en backdrop
- [x] 3.2 Crear `frontend/src/shared/ui/PageContainer.tsx`: componente con `title`, `description?`, `helpContent` (ReactNode), `actions?` (botones en header), children, padding consistente
- [x] 3.3 Crear `frontend/src/shared/ui/TableSkeleton.tsx`: componente de skeleton para tabla con filas animadas (pulse)
- [x] 3.4 Crear `frontend/src/shared/ui/HelpButton.tsx`: botón de ayuda con `size` ('sm'|'md'), `title`, `content` (ReactNode), tooltip/popover con contenido contextual
- [x] 3.5 Crear `frontend/src/shared/ui/ConfirmDialog.tsx`: diálogo de confirmación reutilizable con `isOpen`, `onClose`, `onConfirm`, `title`, `message`, `confirmLabel`, children (para cascade preview)
- [x] 3.6 Crear `frontend/src/shared/ui/Pagination.tsx`: componente de paginación con botones anterior/siguiente, página actual/total, items por página
- [x] 3.7 Crear `frontend/src/shared/ui/Badge.tsx`: componente Badge con `variant` ('success'|'danger'|'warning'|'info'), children, y `<span className="sr-only">Estado:</span>` antes del texto visible

## 4. Shared Utilities

- [x] 4.1 Crear `frontend/src/shared/utils/logger.ts`: función `handleError(error: unknown, context: string): string` que tipa el error (AxiosError | Error | string) y devuelve mensaje legible, más `logWarning` para advertencias
- [x] 4.2 Crear `frontend/src/shared/utils/validation.ts`: funciones de validación reutilizables (required, minLength, email, number, etc.) que devuelven `{ isValid: boolean, errors: Record<string, string> }`

## 5. helpContent Centralizado

- [x] 5.1 Crear `frontend/src/pages/admin/helpContent.tsx`: objeto `helpContent` con entradas para categorias, ingredientes, productos, pedidos, usuarios, config (cada una es un JSX.Element con instrucciones del formulario)

## 6. Refactor shared/ui/index.ts

- [x] 6.1 Actualizar `frontend/src/shared/ui/index.ts` para exportar todos los nuevos componentes (Modal, PageContainer, TableSkeleton, HelpButton, ConfirmDialog, Pagination, Badge)

## 7. Refactor IngredientesPage

- [x] 7.1 Refactorizar `frontend/src/pages/admin/IngredientesPage.tsx`: aplicar `useFormModal`, `useConfirmDialog`, `usePagination`, `useActionState`, `PageContainer` con `helpContent`, `TableSkeleton`, `HelpButton` en formulario, `ConfirmDialog` en delete, columnas con `useMemo` y `deleteDialog` en deps, selectores de store sin destructuring

## 8. Refactor ProductosPage

- [x] 8.1 Refactorizar `frontend/src/pages/admin/ProductosPage.tsx`: aplicar `useFormModal`, `useConfirmDialog`, `usePagination`, `useActionState`, `PageContainer` con `helpContent`, `TableSkeleton`, `HelpButton` en formulario, `ConfirmDialog` en delete, modales secundarios (categorías, ingredientes, stock) usando el patrón Modal, columnas con `useMemo`

## 9. Refactor CategoriasPage

- [x] 9.1 Refactorizar `frontend/src/pages/admin/CategoriasPage.tsx`: aplicar `useFormModal`, `useConfirmDialog`, `useActionState`, `PageContainer` con `helpContent`, `HelpButton` en formulario, `ConfirmDialog` en delete. Mantener el árbol jerárquico (`renderTree`) como visualización principal. No forzar tabla.

## 10. Refactor PedidosPage

- [x] 10.1 Refactorizar `frontend/src/pages/admin/PedidosPage.tsx`: aplicar `useConfirmDialog`, `usePagination`, `PageContainer` con `helpContent`, `TableSkeleton`, `ConfirmDialog` en cancelación. Mantener botones contextuales de transición de estado. Reemplazar badges inline por componente Badge.

## 11. Refactor UsuariosPage

- [x] 11.1 Refactorizar `frontend/src/pages/admin/UsuariosPage.tsx`: aplicar `useFormModal`, `useConfirmDialog`, `usePagination`, `useActionState`, `PageContainer` con `helpContent`, `TableSkeleton`, `HelpButton` en formulario, `ConfirmDialog`, `Badge` para roles y estado activo

## 12. Refactor ConfigPage

- [x] 12.1 Refactorizar `frontend/src/pages/admin/ConfigPage.tsx`: aplicar `PageContainer` con `helpContent`, `useActionState` para el formulario de configuración. No aplica `useFormModal` ni `usePagination` (es una página de settings, no CRUD).

## 13. Verificación

- [x] 13.1 Verificar que `npm run dev` inicia sin errores de compilación (tsc --noEmit: 0 errores)
- [ ] 13.2 Verificar que cada página admin carga sin errores en consola *(requiere servidor backend)*
- [ ] 13.3 Verificar que los formularios de creación/edición funcionan con useActionState *(requiere servidor backend)*
- [ ] 13.4 Verificar que los diálogos de confirmación reemplazan a window.confirm() *(requiere servidor backend)*
- [ ] 13.5 Verificar que HelpButton aparece como primer elemento en cada formulario modal *(requiere servidor backend)*
- [ ] 13.6 Verificar accesibilidad: aria-label en botones de íconos, aria-hidden en íconos decorativos, sr-only en badges *(requiere servidor backend)*
