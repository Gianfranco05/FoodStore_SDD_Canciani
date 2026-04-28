# Design: infrastructure-setup

## Context

### Background
Food Store es un sistema e-commerce para gestión de pedidos de comida con:
- **Backend**: FastAPI + PostgreSQL + SQLModel
- **Frontend**: React + TypeScript + Vite
- **Stack de estado**: Zustand + TanStack Query
- **Payments**: MercadoPago

Este change establece la infraestructura base sobre la cual se construirán los 12 changes restantes.

### Current State
- Proyecto nuevo sin estructura definida
- Documentación existente en docs/ (Descripcion.txt, Historias_de_usuario.txt, Integrador.txt, CHANGES.md)
- No existe código implementado

### Constraints
- PostgreSQL como base de datos principal
- FastAPI requiere SQLModel para ORM
- Frontend debe soportar SSR si se requiere en futuro (por eso Vite)
- 4 roles de usuario: ADMIN, STOCK, PEDIDOS, CLIENT

### Stakeholders
- Equipo de desarrollo backend
- Equipo de desarrollo frontend
- DevOps (deployment)

---

## Goals / Non-Goals

### Goals
1. **Estructura de monorepo** clara con backend/frontend separados
2. **Backend FastAPI** funcionales con endpoints de salud
3. **Frontend React** corriendo con Hot Module Replacement
4. **Base de datos** PostgreSQL con modelos y migraciones
5. **Patrones arquitectónicos** implementados y probados
6. **Stores Zustand** configurados con persistencia
7. **APIs de desarrollo** documentadas

### Non-Goals
- Funcionalidad de negocio (auth, productos, pedidos, etc.)
- Panel de administración
- Integración con MercadoPago
- Tests unitarios (se agregan por change)
- CI/CD pipelines
- Deployment a producción

---

## Decisions

### D1: Monorepo con estructura backend/frontend

**Decisión**: Estructura raíz con `/backend` y `/frontend` como carpetas principales.

**Alternativas consideradas**:
- Turborepo/PNx: Añade complejidad de configuración, no necesario para proyecto de este tamaño
- Repositorios separados: Mayor overhead de coordinación

**Rationale**: Simplicidad y familiaridad del equipo.

---

### D2: SQLModel sobre SQLAlchemy puro

**Decisión**: Usar SQLModel de Pydantic Team para modelos.

**Alternativas consideradas**:
- SQLAlchemy Core: Más verboso, menos integración con FastAPI
- Dapper: Requiere escribir SQL manual, menor productividad

**Rationale**: SQLModel combina lo mejor de SQLAlchemy + Pydantic, validación automática, migraciones con Alembic.

---

### D3: Feature-first en backend

**Decisión**: Organización por características, no por tipo (controllers/models/services).

```
backend/
├── features/
│   ├── auth/
│   │   ├── models.py
│   │   ├── routes.py
│   │   └── service.py
│   ├── products/
│   │   └── ...
```

**Alternativas consideradas**:
- Estructura MVC (controllers/models/services): Confunde cuando una feature crece
- Estructura por módulos (Django-style): Menos flexible para dominio Food Store

**Rationale**: Escalabilidad, cohesión de cada feature, facilita el SDD.

---

### D4: FSD (Feature-Sliced Design) en frontend

**Decisión**: FSD como metodología de estructuración.

**Alternativas consideradas**:
- Atomic Design: No escala bien con lógica de negocio compleja
- Feature folders simples: No tiene convenciones para compartir código

**Rationale**: FSD tiene convenciones claras para shared UI, app-level, y features.

---

### D5: Zustand + TanStack Query

**Decisión**: Zustand para estado global, TanStack Query para estado servidor.

**Alternativas consideradas**:
- Redux Toolkit: Boilerplate excesivo
- Jotai: Menos maduro, menor ecosistema

**Rationale**: Zustand es minimalista, TypeScript-first, y funciona bien con persistencia localStorage. TanStack Query maneja caché, refetch, y estados de carga automáticamente.

---

### D6: Unit of Work para transacciones

**Decisión**: Implementar Unit of Work pattern para operaciones atómicas.

**Rationale**: Los pedidos requieren validación de stock + creación de pedido + historial en una sola transacción. Sin UoW, es fácil dejar datos inconsistentes.

---

## Risks / Trade-offs

### R1: Migraciones Alembic pueden romperse en desarrollo

**Riesgo**: Cuando los modelos cambian, las migraciones pueden conflictuar entre desarrolladores.

**Mitigación**: 
- Usar `--autogenerate` siempre
- Code review riguroso en migraciones
- Script de reset de DB en desarrollo

---

### R2: Zustand persist puede guardar datos stale

**Riesgo**: El usuario recarga la página y tiene items en carrito de una sesión anterior con precios viejos.

**Mitigación**:
- Validar precios al hacer checkout (change order-creation)
- Clear cart al logout
- TTL en el storage

---

### R3: Falta de tests en change fundacional

**Riesgo**: Refactorizaciones futuras pueden romper sin detección.

**Mitigación**:
- Agregar tests en cada change posterior
- Mantener código simple y predecible
- Coverage mínimo 70% en cambios críticos

---

## Migration Plan

### Paso 1: Setup estructura
```bash
mkdir -p backend frontend
cd backend && pip install fastapi uvicorn sqlmodel alembic psycopg2-binary
cd frontend && npm create vite@latest . -- --template react-ts
```

### Paso 2: Modelos y migraciones
```bash
cd backend
alembic init migrations
# Definir modelos en features/
alembic revision --autogenerate
alembic upgrade head
```

### Paso 3: Seed data
```bash
# Insertar roles, estados de pedido, formas de pago
python -m backend.seeds
```

### Paso 4: Frontend setup
```bash
cd frontend
npm install zustand @tanstack/react-query axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Rollback
Si algo falla, borrar contenedores/volúmenes de Docker y recrear:
```bash
docker-compose down -v
docker-compose up -d
```

---

## Open Questions

1. **¿Usar Docker desde el inicio?** 
   - Recomendado: docker-compose con PostgreSQL
   - Dejar configurable para entornos sin Docker

2. **¿Cuántos entornos?**
   - Mínimo: dev, test, prod
   - Usar `.env` para configuración por entorno

3. **¿API versioning?**
   - Empezar sin versionado (/api/v1/)
   - Agregar cuando haya-breaking changes