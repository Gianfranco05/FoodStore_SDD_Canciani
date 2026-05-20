# admin-crud-usuarios — Users Management Page

## ADDED Requirements

### Requirement: Users page uses shared CRUD patterns
The UsuariosPage SHALL use `useFormModal`, `useConfirmDialog`, `usePagination`, `useActionState`, `PageContainer`, `HelpButton`, `TableSkeleton`, `Badge`, and `ConfirmDialog` from admin-crud-base.

#### Scenario: Page structure
- **WHEN** the page renders
- **THEN** it SHALL use `<PageContainer helpContent={helpContent.usuarios}>` (without create action — users register themselves)

#### Scenario: Table with columns
- **WHEN** users are loaded
- **THEN** they SHALL be displayed in a table with columns: email, nombre, roles (Badge list), activo (Badge), acciones (Editar/Toggle Activo)

#### Scenario: Edit user form
- **WHEN** user clicks "Editar"
- **THEN** `modal.openEdit(user)` SHALL open a `<Modal>` with `HelpButton` as first element and form fields: nombre, teléfono, roles (multi-select checkboxes)

#### Scenario: Toggle user active status
- **WHEN** user clicks toggle active/inactive
- **THEN** a PUT request SHALL update the user's active status with toast feedback

#### Scenario: Form submission via useActionState
- **WHEN** the edit user form is submitted
- **THEN** `useActionState` SHALL handle the submission, calling the API update endpoint
