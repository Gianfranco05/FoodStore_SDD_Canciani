# Tasks: sprint4-pedidos

## 1. Backend - DetallePedido Model

- [x] 1.1 Modelo DetallePedido creado en `features/orders/models.py` con todos los campos
- [x] 1.2 Relación `detalles` agregada en Pedido

## 2. Backend - Schemas

- [x] 2.1 Schemas creados en `features/orders/schemas.py` con todos los modelos de request/response

## 3. Backend - OrderService

- [x] 3.1 OrderService completo: create (atómico con UoW), list_mine, get_by_id, list_all (admin), update_estado (FSM)
- [x] 3.2 FSM implementada con 7 estados y transiciones validadas por roles

## 4. Backend - Router

- [x] 4.1 Router creado con 5 endpoints (POST /pedidos, GET /pedidos, GET /pedidos/{id}, PUT /pedidos/{id}/estado, GET /pedidos/admin)
- [x] 4.2 Router registrado en main.py con prefijo /api/v1/pedidos

## 5. Frontend - Checkout

- [x] 5.1 CartPage → POST /api/v1/pedidos conectado con selección de dirección
- [x] 5.2 Al crear pedido: limpia carrito, toast de éxito, redirige a /orders/{id}

## 6. Frontend - Página de Pedidos (cliente)

- [x] 6.1 OrdersPage creada: listado de pedidos con estados coloreados y link a detalle
- [x] 6.2 OrderDetailPage creada: items, dirección, timeline, cancelación, PaymentButton, estado de pago

## 7. Frontend - Panel de Pedidos (admin/gestor)

- [x] 7.1 PedidosPage (admin) creada: listar todos los pedidos con botones de transición FSM

## 8. Frontend - Rutas

- [x] 8.1 Rutas /orders, /orders/{id}, /orders/{id}/success, /orders/{id}/failure, /orders/{id}/pending, /admin/pedidos agregadas en routes.tsx

## 9. Verificación

- [ ] 9.1 Probar crear pedido desde carrito
- [ ] 9.2 Probar FSM (avanzar estados)
- [ ] 9.3 Probar cancelación
