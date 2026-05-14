# FoodStore — Backend 🚀

API REST del e-commerce FoodStore. Hecha con **FastAPI**, **SQLModel** y **MySQL**.

---

## Prerrequisitos

- **Python 3.11+**
- **MySQL 8+** corriendo en `localhost:3306`
- **pip** (viene con Python)

---

## Guía de instalación

### Si descargaste el proyecto (primera vez)

#### 1. Crear la base de datos

Asegurate de tener MySQL corriendo. Luego:

```bash
cd backend
python create_db.py
```

Esto crea la base `foodstore` si no existe. También podés hacerlo manualmente:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS foodstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

#### 2. Crear entorno virtual e instalar dependencias

```bash
cd backend
python -m venv venv
```

Activá el entorno virtual:

- **Windows (cmd):** `venv\Scripts\activate`
- **Windows (PowerShell):** `venv\Scripts\Activate.ps1`
- **Linux / Mac:** `source venv/bin/activate`

Luego instalá las dependencias:

```bash
pip install -r requirements.txt
```

Si vas a desarrollar (tests), también:

```bash
pip install -r requirements-dev.txt
```

#### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editá `backend/.env` con tus credenciales:

```env
DATABASE_URL=mysql+mysqlconnector://root:password@localhost:3306/foodstore
SECRET_KEY=cambia-esto-por-una-clave-de-64-caracteres-minimo
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
MP_ACCESS_TOKEN=TEST-tu-access-token-de-mercadopago
MP_PUBLIC_KEY=TEST-tu-public-key-de-mercadopago
CORS_ORIGINS=http://localhost:5173
```

| Variable | Obligatoria | Default | Descripción |
|----------|-------------|---------|-------------|
| `DATABASE_URL` | ✅ Sí | `mysql+mysqlconnector://root@localhost:3306/foodstore` | URL de conexión a MySQL |
| `SECRET_KEY` | ✅ Sí | — | Clave para firmar JWT (mínimo 64 caracteres) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | ❌ No | `30` | Minutos de validez del access token |
| `REFRESH_TOKEN_EXPIRE_DAYS` | ❌ No | `7` | Días de validez del refresh token |
| `MP_ACCESS_TOKEN` | ❌ No | — | Access token de MercadoPago (para cobrar) |
| `MP_PUBLIC_KEY` | ❌ No | — | Public key de MercadoPago |
| `CORS_ORIGINS` | ❌ No | `http://localhost:5173` | Orígenes permitidos por CORS |

> **Sobre MercadoPago:** Si no configurás `MP_ACCESS_TOKEN`, los endpoints de pago devuelven 501 (no implementado). El resto del backend funciona perfectamente sin estas variables.

#### 4. Ejecutar migraciones

```bash
alembic upgrade head
```

Esto crea todas las tablas en la base de datos.

#### 5. Sembrar datos de prueba

```bash
python run_seeds.py
```

Esto crea:
- **Roles:** admin, cliente, repartidor, cocinero
- **Estados de pedido:** pendiente → confirmado → preparando → listo → enviado → entregado (más cancelado)
- **Formas de pago:** efectivo, tarjeta, transferencia, mercado_pago
- **Categorías:** 10 categorías jerárquicas (Bebidas, Comidas, Postres, etc.)
- **Ingredientes:** 23 ingredientes con alérgenos
- **Productos:** 8 productos de ejemplo con categorías e ingredientes
- **Usuario admin:** `admin@foodstore.com` / `admin123`

> También podés sembrar desde la raíz del proyecto con `python seed_database.py`.

#### 6. Iniciar el servidor

```bash
uvicorn backend.main:app --reload --port 8000
```

O usando el script de Windows:

```bash
.\start_backend.bat
```

La API queda disponible en:
- **API:** `http://localhost:8000`
- **Docs (Swagger):** `http://localhost:8000/docs`
- **Docs alternativos (Redoc):** `http://localhost:8000/redoc`
- **Health check:** `http://localhost:8000/health`

---

### Si ya tenés el proyecto clonado (actualizar)

```bash
cd backend
git pull

# Si hay nuevas dependencias
venv\Scripts\activate
pip install -r requirements.txt

# Si hay nuevas migraciones
alembic upgrade head

# Iniciar
uvicorn backend.main:app --reload --port 8000
```

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `uvicorn backend.main:app --reload --port 8000` | Iniciar servidor con hot-reload |
| `alembic upgrade head` | Ejecutar migraciones pendientes |
| `alembic downgrade -1` | Revertir última migración |
| `alembic revision --autogenerate -m "descripcion"` | Generar nueva migración automática |
| `python create_db.py` | Crear la base de datos `foodstore` si no existe |
| `python run_seeds.py` | Sembrar datos de prueba |
| `python seed_database.py` | Sembrar desde la raíz del proyecto |
| `.\start_backend.bat` | Iniciar backend (Windows, atajo) |
| `python test_mysql.py` | Verificar conexión a MySQL |

---

## Estructura del backend

```
backend/
├── main.py                    # FastAPI app factory + registro de routers
├── app.py                     # Re-export: from main import app
├── config.py                  # Settings con Pydantic (lee .env)
├── database.py                # Engine, SessionLocal, get_db
├── dependencies.py            # Dependencias FastAPI (get_db_session, get_uow)
├── create_db.py               # Crea la BD "foodstore" en MySQL
├── .env.example               # Variables de entorno de ejemplo
│
├── alembic.ini                # Configuración de Alembic
├── migrations/                # Migraciones (versiones)
│   ├── env.py
│   └── versions/
│       ├── 6403a2112f82_initial.py
│       ├── a25c163f8beb_add_configuracion.py
│       └── b25c163f8beb_add_pagos_table.py
│
├── seeds/                     # Seeds con SQLModel ORM
│   └── __init__.py
├── run_seeds.py               # Entry point para seeds
│
├── core/                      # Capa transversal
│   ├── security.py            # JWT + bcrypt (create_access_token, hash/verify password)
│   ├── exceptions.py          # NotFoundException, Unauthorized, Forbidden, etc.
│   ├── middleware.py          # Exception handlers con RFC 7807
│   └── rate_limit.py          # Slowapi Limiter
│
├── features/                  # Módulos funcionales (DDD)
│   ├── __init__.py            # Importa todos los modelos
│   ├── base.py                # TimestampMixin, BaseModel
│   │
│   ├── auth/                  # Autenticación y autorización
│   │   ├── models.py          # Usuario, RefreshToken, Rol
│   │   ├── schemas.py         # LoginRequest, RegisterRequest, TokenResponse
│   │   ├── service.py         # AuthService (register, login, refresh, logout)
│   │   ├── router.py          # POST /login, /register, /refresh, /logout, GET /me
│   │   ├── repository.py      # UsuarioRepository, RefreshTokenRepository
│   │   ├── dependencies.py    # get_current_user
│   │   └── requires.py        # require_role factory
│   │
│   ├── addresses/             # Direcciones de entrega
│   │   ├── models.py          # DireccionEntrega
│   │   ├── schemas.py         # DireccionCreate, DireccionUpdate, DireccionResponse
│   │   ├── service.py         # AddressService (CRUD + set_default)
│   │   └── router.py          # GET/POST /direcciones, PUT/DELETE /{id}
│   │
│   ├── categories/            # Categorías jerárquicas
│   │   ├── models.py          # Categoria
│   │   ├── schemas.py         # CategoriaCreate/Update/Response/Tree
│   │   ├── service.py         # CategoryService (CRUD + árbol + soft_delete)
│   │   └── router.py          # CRUD + GET /tree
│   │
│   ├── ingredients/           # Ingredientes con alérgenos
│   │   ├── models.py          # Ingrediente
│   │   ├── schemas.py         # IngredienteCreate/Update/Response
│   │   ├── service.py         # IngredienteService (CRUD + soft_delete)
│   │   └── router.py          # CRUD
│   │
│   ├── products/              # Productos y catálogo público
│   │   ├── models.py          # Producto, producto_categorias, producto_ingredientes
│   │   ├── schemas.py         # ProductoCreate/Update/Response + StockUpdate
│   │   ├── service.py         # ProductoService (CRUD admin + stock)
│   │   ├── router.py          # CRUD admin productos
│   │   ├── public_service.py  # PublicCatalogService (filtros + paginación)
│   │   └── public_router.py   # GET /public, GET /public/{id}
│   │
│   ├── orders/                # Pedidos con FSM
│   │   ├── models.py          # Pedido, DetallePedido, HistorialEstadoPedido
│   │   ├── schemas.py         # PedidoCreate/Response + EstadoUpdate
│   │   ├── service.py         # OrderService (create, FSM, list, cancel)
│   │   └── router.py          # POST/GET /pedidos, PUT /{id}/estado
│   │
│   ├── payments/              # Pagos con MercadoPago
│   │   ├── models.py          # Pago, FormaPago
│   │   ├── schemas.py         # PagoCreateRequest, PagoResponse, PagoWebhookRequest
│   │   ├── service.py         # PaymentService (crear preferencia, webhook, consultar, reintentar)
│   │   ├── router.py          # POST /crear, POST /webhook, GET /{pedido_id}, POST /{id}/reintentar
│   │   └── dependencies.py    # Dependencias de pago
│   │
│   ├── admin/                 # Panel de administración
│   │   ├── models.py          # Configuracion
│   │   ├── schemas.py         # Admin schemas
│   │   ├── service.py         # Gestión de usuarios, métricas, configuración
│   │   └── router.py          # GET/PUT /admin/usuarios, /metricas, /configuracion
│   │
│   └── repositories/          # Capa de datos (Repository Pattern + UnitOfWork)
│       ├── base_repository.py  # BaseRepository genérico
│       ├── unit_of_work.py     # UnitOfWork con transacciones atómicas
│       ├── usuario_repository.py
│       ├── categoria_repository.py
│       ├── ingrediente_repository.py
│       ├── producto_repository.py
│       ├── direccion_repository.py
│       ├── pedido_repository.py
│       ├── pago_repository.py
│       └── config_repository.py
│
├── requirements.txt           # Dependencias de producción
└── requirements-dev.txt       # Dependencias de desarrollo (pytest, httpx)
```

---

## API Endpoints

### Salud y test
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/health` | Health check del servidor |
| `GET` | `/api/v1/test` | Test de conexión |

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/auth/register` | Registrar nuevo usuario |
| `POST` | `/api/v1/auth/login` | Iniciar sesión |
| `POST` | `/api/v1/auth/refresh` | Refrescar token |
| `POST` | `/api/v1/auth/logout` | Cerrar sesión |
| `GET` | `/api/v1/auth/me` | Obtener datos del usuario actual |
| `PUT` | `/api/v1/auth/me` | Actualizar perfil (nombre, teléfono) |

### Direcciones
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/direcciones` | Listar mis direcciones |
| `POST` | `/api/v1/direcciones` | Crear dirección |
| `PUT` | `/api/v1/direcciones/{id}` | Actualizar dirección |
| `DELETE` | `/api/v1/direcciones/{id}` | Eliminar dirección |
| `PUT` | `/api/v1/direcciones/{id}/default` | Establecer como predeterminada |

### Catálogo público
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/productos/public` | Catálogo público (con filtros y paginación) |
| `GET` | `/api/v1/productos/public/{id}` | Detalle público de producto |

### Productos (admin)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/productos` | Listar productos (admin) |
| `POST` | `/api/v1/productos` | Crear producto |
| `PUT` | `/api/v1/productos/{id}` | Actualizar producto |
| `DELETE` | `/api/v1/productos/{id}` | Eliminar producto (soft) |
| `PATCH` | `/api/v1/productos/{id}/stock` | Actualizar stock |
| `PUT` | `/api/v1/productos/{id}/categorias` | Asignar categorías |
| `PUT` | `/api/v1/productos/{id}/ingredientes` | Asignar ingredientes |

### Categorías e Ingredientes
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/categorias` | Listar categorías |
| `GET` | `/api/v1/categorias/tree` | Árbol de categorías |
| `POST` | `/api/v1/categorias` | Crear categoría |
| `PUT` | `/api/v1/categorias/{id}` | Actualizar categoría |
| `DELETE` | `/api/v1/categorias/{id}` | Eliminar categoría |
| `GET` | `/api/v1/ingredientes` | Listar ingredientes |
| `POST` | `/api/v1/ingredientes` | Crear ingrediente |
| `PUT` | `/api/v1/ingredientes/{id}` | Actualizar ingrediente |
| `DELETE` | `/api/v1/ingredientes/{id}` | Eliminar ingrediente |

### Pedidos
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/pedidos` | Crear pedido (desde carrito) |
| `GET` | `/api/v1/pedidos` | Listar mis pedidos |
| `GET` | `/api/v1/pedidos/{id}` | Detalle del pedido |
| `PUT` | `/api/v1/pedidos/{id}/estado` | Avanzar/cancelar estado (FSM) |
| `GET` | `/api/v1/pedidos/admin` | Listar todos los pedidos (admin) |

### Pagos (MercadoPago)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/pagos/crear` | Crear preferencia de pago |
| `POST` | `/api/v1/pagos/webhook` | Webhook IPN de MercadoPago |
| `GET` | `/api/v1/pagos/{pedido_id}` | Consultar estado del pago |
| `POST` | `/api/v1/pagos/{id}/reintentar` | Reintentar pago |

### Admin
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/admin/usuarios` | Listar usuarios (admin) |
| `PUT` | `/api/admin/usuarios/{id}` | Editar usuario |
| `PATCH` | `/api/admin/usuarios/{id}/estado` | Activar/desactivar usuario |
| `GET` | `/api/admin/metricas/resumen` | Métricas de resumen |
| `GET` | `/api/admin/metricas/ventas` | Ventas por período |
| `GET` | `/api/admin/metricas/productos-top` | Top productos |
| `GET` | `/api/admin/metricas/pedidos-por-estado` | Pedidos por estado |
| `GET` | `/api/admin/configuracion` | Obtener configuración |
| `PUT` | `/api/admin/configuracion` | Actualizar configuración |

---

## Solución de problemas

| Problema | Causa posible | Solución |
|----------|---------------|----------|
| `mysql.connector.errors.InterfaceError: 2003` | MySQL no está corriendo | Iniciar MySQL (`net start MySQL` o desde servicios) |
| `pymysql.err.OperationalError: (1049, "Unknown database 'foodstore'")` | No se creó la BD | Ejecutar `python create_db.py` |
| `alembic.util.exceptions.CommandError: Can't locate revision` | Base de datos vacía sin migraciones | Ejecutar `alembic upgrade head` |
| `ModuleNotFoundError: No module named 'backend'` | PYTHONPATH incorrecto | Ejecutar desde `backend/` con el comando correcto: `uvicorn backend.main:app --reload --port 8000` |
| Error 401 en endpoints protegidos | Token no enviado o expirado | Verificar que el frontend envía el token correctamente |
| Error 429 Too Many Requests | Rate limit excedido | Esperar y reintentar (login: 5 intentos cada 15 minutos) |
| Endpoints de pago devuelven 501 | `MP_ACCESS_TOKEN` no configurado | Configurar en `.env` o ignorar si no se usa MercadoPago |
