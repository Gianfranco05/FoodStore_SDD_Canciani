# Spec: infrastructure-setup

## Overview
Configuración inicial de la infraestructura del proyecto: monorepo, backend FastAPI, frontend React, patrones base, y stores de estado.

---

## ADDED Requirements

### Requirement: Backend FastAPI debe iniciar correctamente
El servidor FastAPI debe iniciar en el puerto 8000 y responder a health checks.

#### Scenario: Health check endpoint responde
- **WHEN** se hace una petición GET a `/health`
- **THEN** el servidor responde con status 200 y JSON con `{"status": "ok"}`

#### Scenario: Documentación OpenAPI disponible
- **WHEN** se accede a `/docs`
- **THEN** se muestra la documentación interactiva de Swagger

---

### Requirement: BaseRepository debe proporcionar operaciones CRUD genéricas
El BaseRepository debe implementar operaciones Create, Read, Update, Delete de forma genérica para cualquier modelo.

#### Scenario: Create - Insertar nuevo registro
- **WHEN** se llama `repository.create(data)`
- **THEN** se crea el registro en la base de datos y se retorna el objeto con ID

#### Scenario: Read - Obtener por ID
- **WHEN** se llama `repository.get_by_id(id)`
- **THEN** se retorna el registro o None si no existe

#### Scenario: Read - Listar todos
- **WHEN** se llama `repository.get_all()`
- **THEN** se retorna una lista de todos los registros

#### Scenario: Update - Actualizar registro
- **WHEN** se llama `repository.update(id, data)`
- **THEN** se actualizan los campos y se retorna el registro actualizado

#### Scenario: Delete - Soft delete
- **WHEN** se llama `repository.soft_delete(id)`
- **THEN** se marca el registro como eliminado (campo `eliminado` o similar)

---

### Requirement: Unit of Work debe manejar transacciones atómicas
El Unit of Work debe permitir ejecutar múltiples operaciones en una sola transacción.

#### Scenario: Commit - Confirmar cambios
- **WHEN** se llama `uow.commit()`
- **THEN** todos los cambios pendientes se guardan en la base de datos

#### Scenario: Rollback - Revertir cambios
- **WHEN** ocurre una excepción y se llama `uow.rollback()`
- **THEN** todos los cambios pendientes se revierten

#### Scenario: Transacción con múltiples repositories
- **WHEN** se usan múltiples repositories dentro de un UoW
- **THEN** todos comparten la misma conexión y transacción

---

### Requirement: Seed data debe ejecutarse correctamente
Al iniciar el proyecto, debe insertarse data inicial necesaria.

#### Scenario: Roles insertados
- **WHEN** se ejecuta el seed
- **THEN** existen los roles: ADMIN, STOCK, PEDIDOS, CLIENT

#### Scenario: Estados de pedido insertados
- **WHEN** se ejecuta el seed
- **THEN** existen los estados: PENDIENTE, CONFIRMADO, EN_PREPARACION, EN_CAMINO, ENTREGADO, CANCELADO

#### Scenario: Formas de pago insertadas
- **WHEN** se ejecuta el seed
- **THEN** existen las formas de pago: EFECTIVO, MERCADO_PAGO

---

### Requirement: Frontend debe iniciar correctamente
El servidor de desarrollo Vite debe iniciar y mostrar la aplicación.

#### Scenario: Servidor Vite responde
- **WHEN** se inicia `npm run dev`
- **THEN** la aplicación está disponible en `http://localhost:5173`

#### Scenario: Hot Module Replacement funciona
- **WHEN** se modifica un archivo React
- **THEN** el navegador se actualiza automáticamente sin recargar

---

### Requirement: Zustand stores deben persistir estado
Los stores de Zustand deben mantener el estado entre sesiones del navegador.

#### Scenario: authStore persiste token
- **WHEN** el usuario hace login y se guarda el token
- **THEN** al recargar la página, el token sigue disponible

#### Scenario: cartStore persiste items
- **WHEN** el usuario agrega items al carrito
- **THEN** al recargar la página, los items siguen en el carrito

---

### Requirement: Dependencias FastAPI deben funcionar
Las dependencias de autenticación deben proteger endpoints correctamente.

#### Scenario: get_current_user con token válido
- **WHEN** se hace una petición con token JWT válido
- **THEN** `get_current_user` retorna el usuario

#### Scenario: get_current_user con token inválido
- **WHEN** se hace una petición con token JWT inválido o expirado
- **THEN** se retorna 401 Unauthorized

#### Scenario: require_role con rol correcto
- **WHEN** un usuario con rol ADMIN accede a endpoint protegido
- **THEN** se permite el acceso

#### Scenario: require_role con rol incorrecto
- **WHEN** un usuario con rol CLIENT accede a endpoint de admin
- **THEN** se retorna 403 Forbidden

---

### Requirement: Manejo de errores RFC 7807
Los errores de la API deben seguir el formato Problem Details.

#### Scenario: Error de validación
- **WHEN** se envía datos inválidos a un endpoint
- **THEN** el error retorna Content-Type: application/problem+json con detalles

#### Scenario: Error de recurso no encontrado
- **WHEN** se solicita un recurso que no existe
- **THEN** el error retorna 404 con formato RFC 7807