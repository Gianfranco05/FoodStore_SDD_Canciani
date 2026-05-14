## ADDED Requirements

### Requirement: Procesar webhook IPN de MercadoPago
El sistema SHALL recibir y procesar notificaciones IPN (Instant Payment Notification) de MercadoPago en un endpoint público sin autenticación.

#### Scenario: Webhook de pago aprobado
- **WHEN** MercadoPago envía un webhook con `type = payment` y `action = payment.approved`
- **THEN** el sistema consulta el pago en MP por `payment_id`
- **AND** actualiza el registro `Pago` con `estado = aprobado`, `mp_payment_id`, `mp_status`, `mp_status_detail`
- **AND** transiciona el `Pedido` de "pendiente" a "confirmado" automáticamente
- **AND** el sistema retorna 200 OK

#### Scenario: Webhook de pago rechazado
- **WHEN** MercadoPago envía un webhook con `type = payment` y `action = payment.rejected`
- **THEN** el sistema actualiza el registro `Pago` con `estado = rechazado`
- **AND** el pedido permanece en estado "pendiente"
- **AND** el sistema retorna 200 OK

#### Scenario: Webhook duplicado
- **WHEN** MercadoPago envía el mismo webhook más de una vez
- **THEN** el sistema verifica que el pago ya fue procesado
- **AND** retorna 200 OK sin efectos secundarios

#### Scenario: Webhook sin payment_id válido
- **WHEN** el webhook no incluye `payment_id` o el ID no existe en el sistema
- **THEN** el sistema retorna 200 OK (para evitar que MP reintente)

#### Scenario: Firma inválida
- **WHEN** el webhook no tiene una firma `X-Signature` válida
- **THEN** el sistema retorna 400 Bad Request
