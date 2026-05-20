# admin-crud-base — Shared CRUD Patterns

## ADDED Requirements

### Requirement: useFormModal hook
The system SHALL provide a `useFormModal<FormData, Entity>` hook that manages modal state and form data.

#### Scenario: Open create modal
- **WHEN** `modal.openCreate()` is called
- **THEN** `modal.isOpen` SHALL be `true`, `modal.selectedItem` SHALL be `null`, and `modal.formData` SHALL be reset to initial values

#### Scenario: Open edit modal
- **WHEN** `modal.openEdit(item)` is called with an existing entity
- **THEN** `modal.isOpen` SHALL be `true`, `modal.selectedItem` SHALL be the entity, and `modal.formData` SHALL be populated with the entity's values

#### Scenario: Close modal
- **WHEN** `modal.close()` is called
- **THEN** `modal.isOpen` SHALL be `false` and `modal.selectedItem` SHALL be `null`

#### Scenario: Update form data
- **WHEN** `modal.setFormData(updater)` is called
- **THEN** `modal.formData` SHALL be updated with the partial or functional updater

### Requirement: useConfirmDialog hook
The system SHALL provide a `useConfirmDialog<Entity>` hook that manages delete confirmation dialog state.

#### Scenario: Open confirm dialog
- **WHEN** `confirmDialog.open(item)` is called
- **THEN** `confirmDialog.isOpen` SHALL be `true` and `confirmDialog.item` SHALL be the entity

#### Scenario: Close confirm dialog
- **WHEN** `confirmDialog.close()` is called
- **THEN** `confirmDialog.isOpen` SHALL be `false` and `confirmDialog.item` SHALL be `null`

### Requirement: usePagination hook
The system SHALL provide a `usePagination<T>(sortedItems: T[])` hook that manages pagination state.

#### Scenario: Default pagination
- **WHEN** `usePagination(items)` is called with an array
- **THEN** it SHALL return `paginatedItems` (subset for current page), `currentPage` (default 1), `totalPages`, `totalItems`, `itemsPerPage` (default 20), and `setCurrentPage`

#### Scenario: Navigate to page
- **WHEN** `setCurrentPage(n)` is called with a valid page number
- **THEN** `currentPage` SHALL be updated and `paginatedItems` SHALL reflect the items for that page

### Requirement: PageContainer component
The system SHALL provide a `<PageContainer>` component with `title`, `description`, `helpContent`, and optional `actions` (ReactNode for header buttons).

#### Scenario: Render with help content
- **WHEN** `<PageContainer helpContent={...}>` is rendered
- **THEN** the help content SHALL be accessible via a help button or section in the page

#### Scenario: Render with actions
- **WHEN** `<PageContainer actions={<Button>Nuevo</Button>}>` is rendered
- **THEN** the action button SHALL appear in the page header

### Requirement: TableSkeleton component
The system SHALL provide a `<TableSkeleton>` component for loading state.

#### Scenario: Loading state
- **WHEN** `isLoading` is `true`
- **THEN** `<TableSkeleton>` SHALL be displayed instead of the empty table or "Cargando..." text

### Requirement: HelpButton component
The system SHALL provide a `<HelpButton>` component with `size="sm"` variant for modal forms.

#### Scenario: Help in modal form
- **WHEN** a modal form is rendered
- **THEN** a `<HelpButton size="sm">` SHALL be the first element inside the form with contextual help content

### Requirement: ConfirmDialog component
The system SHALL provide a `<ConfirmDialog>` component with `isOpen`, `onClose`, `onConfirm`, `title`, `message`, and `confirmLabel` props.

#### Scenario: Confirm delete
- **WHEN** user clicks confirm in the dialog
- **THEN** `onConfirm` SHALL be called with the item from `useConfirmDialog`

#### Scenario: Cancel delete
- **WHEN** user clicks cancel or closes the dialog
- **THEN** `onClose` SHALL be called and the dialog SHALL close

### Requirement: Modal component
The system SHALL provide a reusable `<Modal>` component with `isOpen`, `onClose`, `title`, `size`, and `footer` props.

#### Scenario: Render modal
- **WHEN** `isOpen` is `true`
- **THEN** the modal SHALL render with a backdrop overlay, title, children content, and footer with Cancel + Submit buttons

#### Scenario: Close modal
- **WHEN** user clicks the backdrop or Cancel button
- **THEN** `onClose` SHALL be called

### Requirement: Badge component
The system SHALL provide a `<Badge>` component with `variant` (success, danger, warning, info) that includes sr-only text for accessibility.

#### Scenario: Render badge with sr-only
- **WHEN** a `<Badge variant="success">Activo</Badge>` is rendered
- **THEN** it SHALL include `<span className="sr-only">Estado:</span>` before the visible text

### Requirement: useActionState for form submission
All CRUD forms SHALL use `useActionState` from React 19 for form submission instead of `useState` + `handleSubmit`.

#### Scenario: Form submission with useActionState
- **WHEN** a form is submitted
- **THEN** the action function SHALL receive `FormData`, validate, call the store action, and return `FormState<T>` with `isSuccess`, `errors`, and optional `message`

#### Scenario: Close modal on success
- **WHEN** `state.isSuccess` is `true` and `modal.isOpen` is `true`
- **THEN** `modal.close()` SHALL be called at render time (not inside the action)

### Requirement: Zustand selectors with useShallow
Zustand store access SHALL use selectors (never destructuring). Filtered arrays SHALL use `useShallow`.

#### Scenario: Select single value
- **WHEN** accessing a single store value
- **THEN** `const value = useStore((s) => s.value)` SHALL be used (no destructuring)

#### Scenario: Select filtered array
- **WHEN** accessing a filtered array from the store
- **THEN** `useShallow` SHALL be used: `const items = useStore(useShallow((s) => s.items.filter(...)))`

### Requirement: Columns definition with useMemo
Table columns SHALL be defined as `columns: TableColumn<Entity>[]` using `useMemo` with the entire `deleteDialog` object in the dependency array.

#### Scenario: Columns with correct deps
- **WHEN** defining table columns
- **THEN** `useMemo` SHALL include the full `deleteDialog` object (not `deleteDialog.open`) in the dependency array

### Requirement: Accessibility patterns
All icon-only buttons SHALL have `aria-label`. All decorative icons SHALL have `aria-hidden="true"`.

#### Scenario: Icon button accessibility
- **WHEN** rendering an Edit button with only a Pencil icon
- **THEN** it SHALL have `aria-label="Editar {item.name}"` and the icon SHALL have `aria-hidden="true"`

### Requirement: Error handling with handleError
The system SHALL use `handleError(error, context)` from a shared logger utility for consistent error handling.

#### Scenario: Catch and format error
- **WHEN** an error is caught in a try/catch block
- **THEN** `handleError(error, 'PageName.action')` SHALL be called and SHALL return a user-readable message string

### Requirement: helpContent centralization
All help content SHALL be defined in a centralized `helpContent.tsx` file, never inline in page components.

#### Scenario: Help content registration
- **WHEN** a page needs help content
- **THEN** it SHALL be added to `helpContent.tsx` and referenced via `helpContent.pageName` (not defined inline)
