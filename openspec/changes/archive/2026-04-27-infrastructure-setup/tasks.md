# Tasks: infrastructure-setup

## 1. Estructura del Proyecto

- [ ] 1.1 Crear estructura de monorepo con carpetas `backend/` y `frontend/`
- [ ] 1.2 Crear archivo `.gitignore` raíz con configuraciones para Python, Node, IDEs
- [ ] 1.3 Crear archivo `README.md` con instrucciones de setup

## 2. Backend - Configuración Inicial

- [ ] 2.1 Inicializar entorno virtual Python y crear `requirements.txt` con dependencias (fastapi, uvicorn, sqlmodel, alembic, psycopg2-binary, python-jose, passlib, python-multipart)
- [ ] 2.2 Crear `backend/main.py` con FastAPI básico y endpoint /health
- [ ] 2.3 Configurar Alembic: inicializar con `alembic init` y configurar `alembic.ini`
- [ ] 2.4 Crear `backend/database.py` con configuración de conexión PostgreSQL
- [ ] 2.5 Crear `backend/app.py` como aplicación FastAPI principal

## 3. Backend - Modelos Base

- [ ] 3.1 Crear carpeta `backend/features/` con estructura feature-first
- [ ] 3.2 Crear `backend/features/__init__.py`
- [ ] 3.3 Crear modelo base SQLModel en `backend/features/base.py` con campos comunes (id, fecha_creacion, fecha_actualizacion, eliminado)
- [ ] 3.4 Crear modelos: Usuario, Rol, Categoria, Ingrediente, Producto, Direccion, Pedido, EstadoPedido, HistorialEstadoPedido, FormaPago, etc.

## 4. Backend - Repositorios y Unit of Work

- [ ] 4.1 Crear `backend/features/repositories/base_repository.py` con BaseRepository[T] genérico
- [ ] 4.2 Implementar métodos CRUD: create, get_by_id, get_all, update, soft_delete
- [ ] 4.3 Crear `backend/features/repositories/unit_of_work.py` con Unit of Work pattern
- [ ] 4.4 Crear `backend/features/database.py` con dependencia de sesión

## 5. Backend - Autenticación Base

- [ ] 5.1 Crear `backend/features/auth/dependencies.py` con get_current_user
- [ ] 5.2 Crear `backend/features/auth/requires.py` con require_role
- [ ] 5.3 Configurar JWT en `backend/core/security.py`

## 6. Backend - Manejo de Errores

- [ ] 6.1 Crear `backend/exceptions.py` con clases de excepción personalizadas
- [ ] 6.2 Crear `backend/middleware.py` para manejo de errores RFC 7807
- [ ] 6.3 Configurar exception handlers en `main.py`

## 7. Backend - Migraciones y Seeds

- [ ] 7.1 Ejecutar `alembic revision --autogenerate` para crear migración inicial
- [ ] 7.2 Ejecutar `alembic upgrade head` para aplicar migraciones
- [ ] 7.3 Crear `backend/seeds/__init__.py` con funciones de seed
- [ ] 7.4 Insertar seed data: roles, estados de pedido, formas de pago

## 8. Frontend - Configuración Inicial

- [ ] 8.1 Crear proyecto Vite con React + TypeScript: `npm create vite@latest frontend -- --template react-ts`
- [ ] 8.2 Instalar dependencias: zustand, @tanstack/react-query, axios, react-router-dom, react-hook-form
- [ ] 8.3 Instalar y configurar Tailwind CSS
- [ ] 8.4 Crear estructura FSD: `src/app/`, `src/shared/`, `src/features/`, `src/pages/`

## 9. Frontend - Stores Zustand

- [ ] 9.1 Crear `frontend/src/stores/authStore.ts` con persistencia
- [ ] 9.2 Crear `frontend/src/stores/cartStore.ts` con persistencia
- [ ] 9.3 Crear `frontend/src/stores/paymentStore.ts`
- [ ] 9.4 Crear `frontend/src/stores/uiStore.ts`
- [ ] 9.5 Crear `frontend/src/stores/index.ts` como barrel export

## 10. Frontend - Configuración de API

- [ ] 10.1 Crear `frontend/src/lib/api.ts` con instancia Axios e interceptores
- [ ] 10.2 Crear `frontend/src/lib/queryClient.ts` con configuración de TanStack Query
- [ ] 10.3 Crear `frontend/src/routes/` con estructura de rutas

## 11. Verificación

- [ ] 11.1 Verificar que backend inicia: `cd backend && uvicorn main:app --reload`
- [ ] 11.2 Verificar endpoint /health responde correctamente
- [ ] 11.3 Verificar que frontend inicia: `cd frontend && npm run dev`
- [ ] 11.4 Verificar que la página principal carga sin errores
- [ ] 11.5 Verificar que los stores de Zustand persisten en localStorage