## Why

Las páginas CRUD del panel admin (Categorías, Ingredientes, Productos, Pedidos, Usuarios, Config) fueron construidas sin un patrón unificado. Cada una maneja modales, formularios, paginación y eliminación con `useState` manual, `confirm()` nativo, y lógica de fetch inline con `useEffect` + `useCallback`. Esto genera código inconsistente, difícil de mantener, y propenso a bugs (estados de carga/error no estandarizados, formularios sin validación de servidor, falta de skeletons).

Se necesita refactorizar aplicando los patrones definidos en la skill `dashboard-crud-page` para garantizar consistencia, accesibilidad, y mantenibilidad en todas las páginas CRUD del admin.

## What Changes

- **Crear hooks compartidos**: `useFormModal`, `useConfirmDialog`, `usePagination` — reemplazan el `useState` manual para estado de modales, diálogos de eliminación y paginación
- **Crear componentes compartidos**: `PageContainer`, `TableSkeleton`, `HelpButton` (dentro de formularios), `ConfirmDialog` con preview de cascada, `Modal` reutilizable, `Pagination`, `Badge` con patrones de accesibilidad
- **Crear utilidades compartidas**: `helpContent.tsx` con contenido de ayuda centralizado, `validation.ts` con funciones de validación reutilizables, `logger.ts` con `handleError` para errores consistentes
- **Refactorizar formularios a `useActionState` (React 19)**: reemplazar `handleSubmit` + `useState` por `useActionState` con `FormData` nativo
- **Refactorizar stores a selectores con `useShallow`**: usar selectores en vez de destructuring, `useShallow` para arrays filtrados
- **Estandarizar columnas de tabla**: definir `columns: TableColumn<Entity>[]` con `useMemo` siguiendo el patrón de deps (incluir `deleteDialog` entero)
- **Agregar `<TableSkeleton>`**: mostrar skeleton mientras `isLoading` en vez de texto "Cargando..."
- **Agregar `<HelpButton>` como primer elemento dentro de cada formulario modal**
- **Agregar `aria-label` en botones de solo ícono** y `aria-hidden="true"` en íconos decorativos
- **Reemplazar `confirm()` nativo** por `ConfirmDialog` con `useConfirmDialog`
- **Centralizar contenido de ayuda** en `helpContent.tsx`, nunca inline en la página
- **Agregar `<Badge>` con `<span className="sr-only">Estado:</span>`** para accesibilidad

## Capabilities

### New Capabilities
- `admin-crud-base`: Patrones base compartidos para todas las páginas CRUD del panel administrativo — incluye hooks (`useFormModal`, `useConfirmDialog`, `usePagination`), componentes (`PageContainer`, `TableSkeleton`, `HelpButton`, `ConfirmDialog`, `Modal`, `Pagination`, `Badge`), utilidades (`helpContent`, `validation`, `logger`), y tipos (`FormState`, `TableColumn`)
- `admin-crud-categorias`: Página de gestión de categorías refactorizada con los patrones base
- `admin-crud-ingredientes`: Página de gestión de ingredientes refactorizada con los patrones base
- `admin-crud-productos`: Página de gestión de productos refactorizada con los patrones base
- `admin-crud-pedidos`: Página de gestión de pedidos refactorizada con los patrones base
- `admin-crud-usuarios`: Página de gestión de usuarios refactorizada con los patrones base
- `admin-crud-config`: Página de configuración refactorizada con los patrones base

### Modified Capabilities
*(Ninguna — no hay cambios en requerimientos a nivel de spec, solo en implementación)*

## Impact

- **Nuevos archivos**: hooks (`useFormModal.ts`, `useConfirmDialog.ts`, `usePagination.ts`), componentes (`PageContainer.tsx`, `TableSkeleton.tsx`, `HelpButton.tsx`, `ConfirmDialog.tsx`, `Modal.tsx`, `Pagination.tsx`, `Badge.tsx`), utilidades (`helpContent.tsx`, `validation.ts`, `logger.ts`), tipos (`form.ts`)
- **Archivos modificados**: `frontend/src/pages/admin/CategoriasPage.tsx`, `IngredientesPage.tsx`, `ProductosPage.tsx`, `PedidosPage.tsx`, `UsuariosPage.tsx`, `ConfigPage.tsx`, más todos los stores de Zustand involucrados para usar selectores
- **API pública**: No hay cambios en APIs backend. Solo refactor de frontend.
- **Dependencias**: `react@19` (requerido para `useActionState`). Verificar versión actual en `package.json`.
