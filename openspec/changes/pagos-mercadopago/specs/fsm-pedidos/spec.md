## ADDED Requirements

### Requirement: Transición automática por pago
La FSM de pedidos SHALL soportar una transición automática de "pendiente" a "confirmado" cuando el webhook de MercadoPago confirma un pago exitoso.

#### Scenario: Confirmación automática por webhook
- **WHEN** el webhook de MercadoPago notifica un pago aprobado para un pedido en estado "pendiente"
- **THEN** el sistema transiciona el pedido a "confirmado" automáticamente
- **AND** registra en el historial: "Pago confirmado vía MercadoPago"
- **AND** asigna el `forma_pago_id` correspondiente al pedido

#### Scenario: Intento de confirmación manual después de pago automático
- **WHEN** un admin intenta confirmar manualmente un pedido que ya fue confirmado por webhook
- **THEN** la FSM rechaza la transición porque el estado actual ya es "confirmado"
