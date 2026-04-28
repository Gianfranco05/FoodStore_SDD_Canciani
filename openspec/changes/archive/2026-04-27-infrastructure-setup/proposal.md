# Proposal: infrastructure-setup

## Change ID
`infrastructure-setup`

## ¿Qué?
Configuración inicial del proyecto: scaffolding del monorepo, backend FastAPI con PostgreSQL, frontend React+Vite, patrones arquitectónicos base, y utilidades comunes.

## ¿Por qué?
Sin este change no existe la base sobre la cual construir nada. Es el change fundacional del sistema.

## Scope

### Backend
- Estructura feature-first del proyecto
- FastAPI con SQLModel y Alembic
- Modelos base: Usuario, Rol, Categoria, Ingrediente, Producto, etc.
- Migraciones de base de datos
- Seed data (roles, estados, formas de pago)
- Unit of Work pattern
- BaseRepository[T] genérico
- Dependencias FastAPI (get_current_user, require_role)
- Manejo de errores RFC 7807
- Validación de inputs

### Frontend
- Estructura FSD (Feature-Sliced Design)
- React + Vite + TypeScript
- Tailwind CSS
- 4 stores Zustand: authStore, cartStore, paymentStore, uiStore
- Axios con interceptores
- TanStack Query

### Historias de usuario asociadas

| US | Historia | Prioridad |
|----|----------|----------|
| US-000 | Inicialización del repositorio y estructura del proyecto | Alta |
| US-000a | Configuración del entorno backend (FastAPI + dependencias) | Alta |
| US-000b | Configuración de PostgreSQL, migraciones y seed data | Alta |
| US-000c | Configuración del entorno frontend (React + Vite + dependencias) | Alta |
| US-000d | Implementación de patrones base (BaseRepository, Unit of Work, dependencias FastAPI) | Alta |
| US-000e | Configuración de los stores de Zustand (authStore, cartStore, paymentStore, uiStore) | Alta |
| US-068 | Manejo de errores estandarizado en backend | Alta |
| US-074 | Validación y sanitización de inputs | Alta |

## Dependencias
> **Depende de**: Ninguno (es el change fundacional)

## Criterios de aceptación
1. ✅ Monorepo configurado con backend/frontend
2. ✅ Backend FastAPI corre en puerto 8000
3. ✅ Frontend React corre en puerto 5173
4. ✅ PostgreSQL conectado con migraciones aplicadas
5. ✅ Seed data insertado (roles, estados, formas de pago)
6. ✅ BaseRepository y Unit of Work funcionando
7. ✅ authStore, cartStore, paymentStore, uiStore configurados
8. ✅ Endpoints de salud (/health) funcionando en backend y frontend