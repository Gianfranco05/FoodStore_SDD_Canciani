## ADDED Requirements

### Requirement: Consultar estado de pago
El sistema SHALL permitir consultar el estado actual de un pago asociado a un pedido.

#### Scenario: Consultar pago existente
- **WHEN** un usuario autenticado consulta el estado de pago de un pedido que le pertenece
- **THEN** el sistema retorna el estado del pago más reciente: `pendiente`, `aprobado` o `rechazado`
- **AND** incluye `mp_preference_id` y `init_point` si el pago está pendiente

#### Scenario: Pedido sin pagos
- **WHEN** se consulta el estado de pago de un pedido que no tiene ningún `Pago` asociado
- **THEN** el sistema retorna `estado = null` y `disponible = true`

#### Scenario: Pedido no pertenece al usuario
- **WHEN** un usuario consulta el estado de pago de un pedido que no le pertenece
- **THEN** el sistema retorna 403

#### Scenario: Consulta admin
- **WHEN** un admin consulta el estado de pago de cualquier pedido
- **THEN** el sistema retorna el estado sin restricciones de ownership
