## Context

El sistema ya tiene:
- Modelo `FormaPago` en `backend/features/payments/models.py`
- Pedidos con `forma_pago_id` nullable en `Pedido` y el `PedidoCreateRequest`
- FSM de pedidos completa con transición `pendiente → confirmado` (admin/cocinero)
- `paymentStore` en Zustand con persistencia (status + preferenceId)
- `OrderDetailPage` que muestra detalle del pedido

Lo que falta:
- No hay modelo `Pago` para tracking individual de transacciones
- No hay integración con SDK de MercadoPago
- No hay webhook IPN para transición automática de estados
- No hay botón de pago en el frontend
- Las credenciales MP no están configuradas (se usarán env vars)

## Goals / Non-Goals

**Goals:**
- Modelo `Pago` con tracking completo de transacciones MP (preference_id, payment_id, status, idempotency)
- SDK MercadoPago envuelto en un wrapper que verifica credenciales antes de operar
- Endpoint `POST /api/v1/pagos/crear` — crea preferencia de pago en MP
- Endpoint `POST /api/v1/pagos/webhook` — recibe IPN, valida firma, actualiza estado
- Endpoint `GET /api/v1/pagos/{pedido_id}` — consulta estado del pago
- Endpoint `POST /api/v1/pagos/{pedido_id}/reintentar` — nuevo pago para rechazados
- Transición automática `pendiente → confirmado` en la FSM cuando el webhook confirma el pago
- Componente `PaymentButton` en frontend con brick de MercadoPago
- Páginas de retorno: success, failure, pending
- Toda la configuración vía variables de entorno, sin hardcodear credenciales

**Non-Goals:**
- NO se implementan otros medios de pago (solo MercadoPago por ahora)
- NO se implementan suscripciones o pagos recurrentes
- NO se implementan reembolsos (solo consulta de estado)
- NO se implementan cuotas ni intereses
- NO se cambia la FSM existente — solo se agrega una transición automática adicional

## Decisions

### 1. Modelo `Pago` separado vs campos en `Pedido`
**Decisión:** Modelo separado `Pago` con FK a `Pedido`.
**Rationale:** Un pedido puede tener múltiples intentos de pago (reintentos). Cada intento es un registro independiente. Además, mantener datos de MP separados evita acoplar el modelo de negocio con el proveedor de pagos.
**Alternativa:** Agregar campos MP directamente a `Pedido`. Descartado porque no soporta reintentos y acopla dominios.

### 2. SDK MP: inicialización lazy con chequeo de credenciales
**Decisión:** El SDK de MercadoPago se inicializa bajo demanda y verifica que las credenciales existan. Si no hay `MP_ACCESS_TOKEN`, los endpoints devuelven 501 Not Implemented con un mensaje claro.
**Rationale:** El sistema debe funcionar (sin pagos) aunque no haya credenciales configuradas. Esto permite desarrollo y testing sin depender de MP.
```python
def get_mp_client() -> Optional[MercadoPagoSDK]:
    access_token = os.getenv("MP_ACCESS_TOKEN")
    if not access_token:
        return None
    return MercadoPagoSDK(access_token)
```

### 3. Webhook: validación de firma vs confianza en IP secreta
**Decisión:** Validar firma `X-Signature` de MercadoPago usando el `x-www-form-urlencoded` del body.
**Rationale:** Es la práctica recomendada por MP. No asumir que la IP de origen es confiable.
**Alternativa:** Verificar IP de origen (lista pública de MP). Descartado porque las IPs pueden cambiar sin previo aviso.

### 4. Idempotencia: `idempotency_key` generada por el backend
**Decisión:** El backend genera una `idempotency_key` (UUID) por cada intento de pago y la almacena en el modelo `Pago`.
**Rationale:** MP requiere `X-Idempotency-Key` para evitar duplicados. Al almacenarla en BD, podemos reintentar requests fallidos a MP sin crear preferencias duplicadas.

### 5. Frontend: SDK @mercadopago/sdk-react con Wallet Brick
**Decisión:** Usar el componente `<Wallet>` del SDK de MercadoPago, que es un botón inteligente que muestra los medios de pago disponibles.
**Rationale:** Es la integración más simple y segura. No requiere manejar tarjetas ni datos sensibles.
**Alternativa:** Checkout Pro redirect (URL). Descartado porque la experiencia embebida es mejor para el usuario.

### 6. Páginas de retorno: rutas en frontend, callbacks en preferencia MP
**Decisión:** Al crear la preferencia, se pasan `back_urls` apuntando a las rutas del frontend: `/orders/{id}/success`, `/orders/{id}/failure`, `/orders/{id}/pending`. El parámetro `auto_return` se setea en "approved".
**Rationale:** MP redirige al usuario automáticamente después del pago. Las rutas de retorno muestran feedback visual y permiten al usuario seguir navegando.

### 7. Auto-transición FSM: método separado vs reutilizar `update_estado`
**Decisión:** Método separado `confirmar_por_pago()` en OrderService, que solo permite la transición `pendiente → confirmado` y registra el medio de pago.
**Rationale:** Separar la responsabilidad: `update_estado` es para acciones manuales (admin/cocinero), `confirmar_por_pago` es para el webhook automático. Evita mezclar lógica de negocio con lógica de pagos.

## Risks / Trade-offs

- **[Riesgo] Webhook no entregado**: MP puede fallar al enviar el webhook o el servidor puede estar caído.
  → **Mitigación**: Implementar consulta periódica (polling) desde frontend mientras el pedido está pendiente. El usuario puede ver el estado actualizado al recargar la página.

- **[Riesgo] Doble notificación**: MP puede enviar el mismo webhook múltiples veces.
  → **Mitigación**: Usar `idempotency_key` + verificar estado actual del pago antes de procesar. Si ya está procesado, responder 200 sin efectos secundarios.

- **[Riesgo] Credenciales rotas**: El token de MP expira o se revoca.
  → **Mitigación**: El wrapper del SDK valida credenciales en cada request. Si falta el token, los endpoints devuelven 501 con mensaje claro. El sistema sigue funcionando para pedidos sin pago.

- **[Riesgo] Timeout de MP**: La creación de preferencia puede tardar.
  → **Mitigación**: Timeout de 10s en requests salientes. Mostrar loading state en frontend.

- **[Trade-off] Testing sin MP real**: No se puede probar el flujo completo sin credenciales reales.
  → **Decisión**: El código está preparado para funcionar con credenciales de testing (MP_TEST). Cuando el usuario configure `MP_ACCESS_TOKEN`, todo funciona.
