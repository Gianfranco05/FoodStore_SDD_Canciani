## ADDED Requirements

### Requirement: Crear preferencia de pago
El sistema SHALL crear una preferencia de pago en MercadoPago para un pedido en estado "pendiente", utilizando el SDK de MercadoPago.

#### Scenario: Crear preferencia exitosamente
- **WHEN** un usuario autenticado solicita crear un pago para un pedido pendiente que le pertenece
- **THEN** el sistema crea una preferencia en MercadoPago con el monto total, título, y back_urls
- **AND** el sistema almacena un registro `Pago` con `estado = pendiente`, `mp_preference_id` y `idempotency_key`
- **AND** el sistema retorna el `preference_id` y `init_point` al frontend

#### Scenario: Pedido no existe
- **WHEN** se solicita crear un pago para un `pedido_id` inexistente
- **THEN** el sistema retorna 404

#### Scenario: Pedido no pertenece al usuario
- **WHEN** se solicita crear un pago para un pedido que no pertenece al usuario autenticado
- **THEN** el sistema retorna 403

#### Scenario: Pedido no está en estado pendiente
- **WHEN** se solicita crear un pago para un pedido cuyo estado no es "pendiente"
- **THEN** el sistema retorna 400 con mensaje "El pedido no está pendiente de pago"

#### Scenario: SDK no configurado
- **WHEN** no hay `MP_ACCESS_TOKEN` configurado en las variables de entorno
- **THEN** el sistema retorna 501 con mensaje "MercadoPago no está configurado"

### Requirement: Idempotencia en creación de pago
Cada intento de pago SHALL tener una `idempotency_key` única (UUID v4) generada por el backend.

#### Scenario: Misma idempotency_key
- **WHEN** se envía el mismo request con la misma `idempotency_key`
- **THEN** el sistema retorna el mismo `Pago` previamente creado sin duplicar la preferencia en MP
