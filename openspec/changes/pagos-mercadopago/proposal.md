## Why

El sistema ya permite crear pedidos con estados (FSM) pero no tiene integración real con MercadoPago. Los pedidos quedan en "pendiente" sin forma de cobrarlos. Sin pagos, el sistema no puede operar en producción. Este cambio integra MercadoPago como medio de cobro, permitiendo crear preferencias de pago, recibir webhooks IPN, consultar estados, y reintentar pagos rechazados.

## What Changes

- **Backend**: Nuevo feature `features/payments/` con modelo `Pago`, schemas, `PaymentService` y `PaymentRouter`
- **Backend**: SDK MercadoPago envuelto en configuración por environment, con fallback graceful si no hay credenciales
- **Backend**: Endpoints `POST /api/v1/pagos/crear`, `POST /api/v1/pagos/webhook`, `GET /api/v1/pagos/{pedido_id}`, `POST /api/v1/pagos/{pedido_id}/reintentar`
- **Backend**: Transición automática `pendiente → confirmado` vía webhook de MP
- **Frontend**: Componente `PaymentButton` con SDK `@mercadopago/sdk-react`
- **Frontend**: Actualizar `OrderDetailPage` con botón "Pagar con MercadoPago" en pedidos pendientes
- **Frontend**: Páginas de retorno (success/failure/pending)
- **Frontend**: Actualizar `paymentStore` para manejar el flujo completo
- **Infra**: Agregar `mercadopago` a `requirements.txt` y `@mercadopago/sdk-react` a `package.json`
- **Infra**: Documentar variables de entorno `MP_ACCESS_TOKEN` y `MP_PUBLIC_KEY`

## Capabilities

### New Capabilities
- `crear-pago`: Crear preferencia de pago en MercadoPago para un pedido pendiente, con idempotency_key
- `webhook-pago`: Procesar notificaciones IPN de MercadoPago, validar firma, actualizar estado del pago y transicionar el pedido
- `consultar-pago`: Consultar el estado de un pago asociado a un pedido
- `reintentar-pago`: Permitir generar un nuevo pago para un pedido con pago rechazado

### Modified Capabilities
- `fsm-pedidos`: Agregar transición automática `pendiente → confirmado` disparada por webhook de pago exitoso

## Impact

- `backend/features/payments/` — nuevo feature completo (models, schemas, service, router)
- `backend/features/orders/service.py` — agregar método `confirmar_por_pago()` para webhook
- `backend/main.py` — registrar nuevo router de pagos
- `backend/requirements.txt` — agregar `mercadopago`
- `frontend/src/pages/OrderDetailPage.tsx` — agregar botón de pago
- `frontend/src/stores/paymentStore.ts` — actualizar para flujo completo
- `frontend/package.json` — agregar `@mercadopago/sdk-react`
- `backend/.env.example` y `frontend/.env.example` — documentar MP_* vars
