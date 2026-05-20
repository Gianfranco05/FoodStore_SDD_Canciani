# admin-crud-ingredientes — Ingredients CRUD Page

## ADDED Requirements

### Requirement: Ingredients page uses shared CRUD patterns
The IngredientesPage SHALL use `useFormModal`, `useConfirmDialog`, `usePagination`, `useActionState`, `PageContainer`, `HelpButton`, `TableSkeleton`, and `ConfirmDialog` from admin-crud-base.

#### Scenario: Page structure
- **WHEN** the page renders
- **THEN** it SHALL use `<PageContainer helpContent={helpContent.ingredientes}>` with a "Nuevo Ingrediente" action button

#### Scenario: Table with columns
- **WHEN** ingredients are loaded
- **THEN** they SHALL be displayed in a table with columns: nombre, unidad_medida, alérgenos, disponible (Badge), acciones (Editar/Eliminar)

#### Scenario: TableSkeleton while loading
- **WHEN** `isLoading` is `true`
- **THEN** `<TableSkeleton>` SHALL be displayed instead of text "Cargando..."

#### Scenario: Create ingredient form
- **WHEN** user clicks "Nuevo Ingrediente"
- **THEN** `modal.openCreate()` SHALL open a `<Modal>` with `HelpButton` as first element and form fields: nombre, unidad_medida (select), alérgenos (text)

#### Scenario: Delete ingredient with confirmation
- **WHEN** user clicks "Eliminar"
- **THEN** `confirmDialog.open(item)` SHALL open a `<ConfirmDialog>` — NOT `window.confirm()`

#### Scenario: Toggle disponible
- **WHEN** user toggles the "disponible" status
- **THEN** a PUT request SHALL update the ingredient's availability and the table SHALL refresh
