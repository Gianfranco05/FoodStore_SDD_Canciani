# admin-crud-pedidos — Orders Management Page

## ADDED Requirements

### Requirement: Orders page uses shared CRUD patterns
The PedidosPage SHALL use `useConfirmDialog`, `usePagination`, `PageContainer`, `TableSkeleton`, and `ConfirmDialog` from admin-crud-base. For state transitions, it uses inline actions (not useActionState, since transitions are button-based not form-based).

#### Scenario: Page structure
- **WHEN** the page renders
- **THEN** it SHALL use `<PageContainer helpContent={helpContent.pedidos}>` (without create action — orders are created by clients)

#### Scenario: Table with order status columns
- **WHEN** orders are loaded
- **THEN** they SHALL be displayed in a table with columns: ID, cliente, estado (Badge), total, fecha, acciones (contextual buttons per state)

#### Scenario: Contextual action buttons
- **WHEN** an order is in "pendiente" state
- **THEN** action buttons SHALL show "Confirmar" and "Cancelar" based on user role

#### Scenario: State transition with FSM
- **WHEN** user clicks a state transition button (e.g., "Confirmar")
- **THEN** a PUT request to `/pedidos/{id}/estado` SHALL be made and the table SHALL refresh with toast feedback

#### Scenario: Cancel order with confirmation
- **WHEN** user clicks "Cancelar"
- **THEN** `confirmDialog.open(order)` SHALL open a `<ConfirmDialog>` — NOT `window.confirm()`
