## Context

El panel admin de FoodStore tiene 6 páginas CRUD (Categorías, Ingredientes, Productos, Pedidos, Usuarios, Config) que fueron implementadas sin un patrón unificado. Actualmente:

- **Estado de modales y formularios**: `useState` manual en cada página (showForm, editingId, form, saving)
- **Fetch de datos**: mezcla de `useEffect` + `useCallback` con llamadas directas a `api.get()`, y `useQuery`/`useMutation` de TanStack Query en algunos casos
- **Eliminación**: `confirm()` nativo del browser — sin personalización, sin preview de cascada
- **Paginación**: manual con `useState(page)` + lógica inline
- **Carga**: texto "Cargando..." o spinner básico — sin skeletons
- **Formularios**: `handleSubmit` con `useState` para loading/error
- **Accesibilidad**: sin `aria-label` en botones de íconos, sin `sr-only` en badges
- **Alertas de confirmación**: `window.confirm()` en lugar de componente personalizado

El stack actual es React 19, TypeScript, Zustand, TanStack Query, Tailwind CSS. La refactorización no cambia el stack, solo estandariza los patrones de implementación.

## Goals / Non-Goals

**Goals:**
- Crear hooks base (`useFormModal`, `useConfirmDialog`, `usePagination`) que encapsulen el estado de modales, confirmación y paginación
- Crear componentes base (`PageContainer`, `TableSkeleton`, `HelpButton`, `ConfirmDialog`, `Modal`, `Pagination`, `Badge`)
- Refactorizar las 6 páginas CRUD admin para usar estos patrones
- Usar `useActionState` de React 19 para todos los formularios CRUD
- Usar selectores de Zustand con `useShallow` para arrays filtrados
- Agregar HelpButton como primer elemento en todos los formularios modales
- Agregar `aria-label` y `aria-hidden` para accesibilidad
- Centralizar helpContent en `helpContent.tsx`
- Implementar `handleError` para manejo consistente de errores
- Usar TableSkeleton mientras isLoading

**Non-Goals:**
- NO cambiar APIs del backend
- NO migrar el store de estado global (Zustand se mantiene)
- NO cambiar la estructura de routing
- NO refactorizar DashboardPage.tsx (la página de métricas con gráficos — no es CRUD)
- NO refactorizar páginas públicas (CatalogoPage, CartPage, etc.)
- NO agregar nuevas funcionalidades a las páginas existentes

## Decisions

### 1. Ubicación de hooks y componentes
**Decisión**: Los hooks van en `frontend/src/shared/hooks/` y los componentes en `frontend/src/shared/ui/`.
**Rationale**: Ya existen componentes en `shared/ui/` (Button, Input, Card, etc.). Los hooks son reutilizables entre páginas. Mantener todo en `shared/` respeta la estructura FSD existente.
**Alternativa considerada**: Crear `src/hooks/` a nivel de app — se descartó porque `shared/` ya es el lugar para código reutilizable.

### 2. useActionState para formularios
**Decisión**: Reemplazar `handleSubmit` + `useState(isSaving/error)` por `useActionState` con `FormData`.
**Rationale**: React 19 nativo, elimina estado booleano manual, maneja pending state automáticamente, permite validación del lado del servidor (aunque sea client-side). Cierra el modal verificando `state.isSuccess` en tiempo de render, no dentro de la acción.
**Patrón**:
```typescript
const [state, formAction, isPending] = useActionState(submitAction, { isSuccess: false })
if (state.isSuccess && modal.isOpen) modal.close()
```

### 3. usePagination con sorted items
**Decisión**: `usePagination` recibe `sortedItems` (ya ordenados) y expone `paginatedItems`, `currentPage`, `totalPages`, `totalItems`, `itemsPerPage`, `setCurrentPage`.
**Rationale**: Separa la responsabilidad de ordenamiento (useMemo en la página) de la paginación. `usePagination` solo se preocupa de qué items mostrar en la página actual.

### 4. Selectores con useShallow
**Decisión**: Usar `useShallow` de `zustand/react/shallow` para arrays derivados del store. Para datos de un solo objeto, usar selector directo.
**Rationale**: Evita re-renders innecesarios. El patrón `const x = useStore(useShallow(state => ...))` es el recomendado por la doc de Zustand v5.

### 5. helpContent centralizado
**Decisión**: Todo el contenido de ayuda vive en `frontend/src/pages/admin/helpContent.tsx` (cerca de las páginas que lo usan). Cada entrada es un JSX.Element.
**Rationale**: Centralizar permite mantener consistencia y facilita actualizaciones. Se coloca en `pages/admin/` porque es específico del admin, no compartido.

### 6. Manejo de errores con logger
**Decisión**: Crear `frontend/src/shared/utils/logger.ts` con `handleError(error, context)` que tipa el error y devuelve un mensaje legible.
**Rationale**: Estandariza el try/catch en todas las páginas. El `context` (ej. "CategoriasPage.submitAction") ayuda a debuggear.

### 7. ModalComponent vs inline
**Decisión**: Crear `Modal` como componente reutilizable con `isOpen`, `onClose`, `title`, `size`, `footer` (render prop con Cancel + Submit). No usar render prop para el body — se pasa como children.
**Rationale**: Las páginas CRUD tienen necesidades de formulario muy variables. Un modal con `children` flexible es más práctico que uno con render props complejas.

### 8. Categorías: caso especial (árbol jerárquico)
**Decisión**: CategoríasPage mantiene su árbol visual (`renderTree`) pero se refactoriza para usar `useFormModal`, `useConfirmDialog` y los patrones base.
**Rationale**: La página de categorías es inherentemente diferente (árbol vs tabla), pero comparte la misma lógica de formulario modal, confirmación y helpContent. No forzamos una tabla donde no corresponde.

## Risks / Trade-offs

- **[Riesgo] Tamaño del cambio**: Refactorizar 6 páginas simultáneamente puede generar conflictos si hay otros cambios en progreso.
  → **Mitigación**: La refactorización es puramente frontend y no toca APIs. Cada página se puede hacer de forma independiente. Se prioriza el orden: hooks → componentes → utilidades → páginas una por una.

- **[Riesgo] useActionState + modal.isOpen**: Si `state.isSuccess` se checkea después de cerrar el modal, puede reintentar el cierre.
  → **Mitigación**: El patrón `if (state.isSuccess && modal.isOpen)` es seguro. El estado `isSuccess` se resetea al abrir el modal.

- **[Trade-off] No refactorizar DashboardPage**: La página de métricas con gráficos no sigue el patrón CRUD y no se beneficia de estos hooks. Dejarla como está evita over-engineering.

- **[Trade-off] Nuevos archivos vs modificar existentes**: Se crean ~10 archivos nuevos (hooks, componentes, utilidades) y se modifican ~6 páginas. El incremento en cantidad de archivos es compensado por la reducción de código repetitivo en cada página.

- **[Riesgo] Regresión visual**: Los estilos existentes pueden cambiar ligeramente al reemplazar modales inline por Modal component.
  → **Mitigación**: Comparar visualmente cada página después de la refactorización. Los estilos de Modal deben coincidir con los existentes (Card-based, mismos colores, mismo padding).
