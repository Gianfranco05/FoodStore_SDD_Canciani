## ADDED Requirements

### Requirement: Reintentar pago rechazado
El sistema SHALL permitir generar un nuevo intento de pago para un pedido cuyo último pago fue rechazado.

#### Scenario: Reintentar pago exitosamente
- **WHEN** un usuario autenticado solicita reintentar el pago de un pedido pendiente que le pertenece
- **AND** el último `Pago` del pedido tiene `estado = rechazado`
- **THEN** el sistema crea una nueva preferencia en MercadoPago
- **AND** almacena un nuevo registro `Pago` con nueva `idempotency_key` y `estado = pendiente`
- **AND** retorna el nuevo `preference_id` e `init_point`

#### Scenario: Reintentar con pago ya aprobado
- **WHEN** se solicita reintentar un pago para un pedido que ya tiene un pago aprobado
- **THEN** el sistema retorna 400 con mensaje "El pedido ya tiene un pago aprobado"

#### Scenario: Reintentar sin pagos previos
- **WHEN** se solicita reintentar un pago para un pedido que no tiene ningún `Pago` asociado
- **THEN** el sistema redirige al flujo de crear pago normal
