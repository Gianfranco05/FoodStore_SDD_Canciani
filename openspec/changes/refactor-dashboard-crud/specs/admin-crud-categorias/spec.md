# admin-crud-categorias — Categories CRUD Page

## ADDED Requirements

### Requirement: Categories page uses shared CRUD patterns
The CategoriasPage SHALL use `useFormModal`, `useConfirmDialog`, `useActionState`, `PageContainer`, `HelpButton`, and `ConfirmDialog` from admin-crud-base.

#### Scenario: Page structure
- **WHEN** the page renders
- **THEN** it SHALL use `<PageContainer helpContent={helpContent.categorias}>` with a "Nueva Categoría" action button

#### Scenario: Tree view preservation
- **WHEN** categories are loaded
- **THEN** they SHALL be displayed as a hierarchical tree (not a flat table), maintaining the existing `renderTree` visual structure

#### Scenario: Create category form
- **WHEN** user clicks "Nueva Categoría"
- **THEN** `modal.openCreate()` SHALL open a `<Modal>` with `HelpButton` as first element and form fields: nombre, descripción, slug, imagen_url, categoría padre (select with hierarchical flatten)

#### Scenario: Edit category
- **WHEN** user clicks "Editar" on a category
- **THEN** `modal.openEdit(cat)` SHALL open the modal with form fields pre-populated

#### Scenario: Delete category with confirmation
- **WHEN** user clicks "Eliminar"
- **THEN** `confirmDialog.open(cat)` SHALL open a `<ConfirmDialog>` — NOT `window.confirm()`

#### Scenario: Form submission
- **WHEN** the category form is submitted
- **THEN** `useActionState` SHALL handle the submission, calling POST (create) or PUT (edit) via API

### Requirement: Category filtering (self-reference guard)
The parent category selector SHALL exclude the current category being edited to prevent self-referencing.

#### Scenario: Prevent self-reference
- **WHEN** editing a category
- **THEN** the parent category dropdown SHALL filter out the category being edited
