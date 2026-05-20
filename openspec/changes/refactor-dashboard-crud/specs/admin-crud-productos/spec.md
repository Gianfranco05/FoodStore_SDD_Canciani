# admin-crud-productos — Products CRUD Page

## ADDED Requirements

### Requirement: Products page uses shared CRUD patterns
The ProductosPage SHALL use `useFormModal`, `useConfirmDialog`, `usePagination`, `useActionState`, `PageContainer`, `HelpButton`, `TableSkeleton`, and `ConfirmDialog` from admin-crud-base.

#### Scenario: Page structure
- **WHEN** the page renders
- **THEN** it SHALL use `<PageContainer helpContent={helpContent.productos}>` with a "Nuevo Producto" action button

#### Scenario: Table with columns
- **WHEN** products are loaded
- **THEN** they SHALL be displayed in a table with columns: nombre, precio (formatted), stock, activo (Badge), acciones (Editar/Eliminar/Stock)

#### Scenario: Create product form
- **WHEN** user clicks "Nuevo Producto"
- **THEN** `modal.openCreate()` SHALL open a `<Modal>` with `HelpButton` as first element and form fields: nombre, descripción, precio, imagen_url, stock, tiempo_preparacion_minutos

#### Scenario: Category assignment modal
- **WHEN** user clicks "Asignar Categorías" on a product
- **THEN** a secondary modal SHALL open with checkboxes for each category

#### Scenario: Ingredient assignment modal
- **WHEN** user clicks "Asignar Ingredientes" on a product
- **THEN** a secondary modal SHALL open with checkboxes and cantidad field for each ingredient

#### Scenario: Stock update modal
- **WHEN** user clicks "Stock" on a product
- **THEN** a secondary modal SHALL open with a form for stock operation (set | increment | decrement)

#### Scenario: Delete product with confirmation
- **WHEN** user clicks "Eliminar"
- **THEN** `confirmDialog.open(item)` SHALL open a `<ConfirmDialog>` — NOT `window.confirm()`
