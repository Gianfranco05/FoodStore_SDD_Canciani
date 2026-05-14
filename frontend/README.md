# FoodStore — Frontend 🎨

App web del e-commerce FoodStore. Hecha con **React 19**, **TypeScript**, **Vite** y **Tailwind CSS v4**.

---

## Prerrequisitos

- **Node.js 18+**
- **npm** (viene con Node.js)
- El **backend** corriendo en `http://localhost:8000` (ver [`../backend/README.md`](../backend/README.md))

---

## Primeros pasos

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

El archivo `.env` queda así:

```env
VITE_API_URL=http://localhost:8000
VITE_MP_PUBLIC_KEY=TEST-tu-public-key-de-mercadopago
```

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `VITE_API_URL` | ✅ Sí | URL base del backend |
| `VITE_MP_PUBLIC_KEY` | ❌ No | Public key de MercadoPago para el frontend. Si no se configura, el botón de pago muestra "MercadoPago no configurado" |

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

La app se abre en `http://localhost:5173`.

> **Importante:** No olvides tener el backend corriendo también. Las rutas protegidas redirigen a `/login` si no hay sesión y el backend no responde.

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con hot-reload |
| `npm run build` | Compila TypeScript + build de producción en `dist/` |
| `npm run preview` | Previsualiza el build de producción localmente |
| `npm run lint` | Ejecuta ESLint en todo el proyecto |

---

## Estructura del proyecto

```
frontend/
├── index.html                 # Entry point HTML
├── vite.config.ts             # Configuración de Vite
├── tsconfig.json              # TypeScript config (con path alias @/)
├── postcss.config.js          # PostCSS + Tailwind
├── package.json
├── .env.example               # Variables de entorno de ejemplo
│
└── src/
    ├── main.tsx               # Entry point React
    ├── index.css              # @import "tailwindcss"
    ├── app/
    │   ├── App.tsx            # Componente raíz
    │   ├── routes.tsx         # Definición de rutas
    │   ├── providers.tsx      # Providers globales (QueryClient, Router, Toast, ErrorBoundary)
    │   └── ErrorBoundary.tsx  # Captura de errores no manejados
    │
    ├── pages/                 # Páginas de la app
    │   ├── admin/             # Dashboard, Usuarios, Config, Categorías, Ingredientes, Productos, Pedidos
    │   ├── HomePage.tsx
    │   ├── LoginPage.tsx
    │   ├── RegisterPage.tsx
    │   ├── CatalogoPage.tsx
    │   ├── ProductoDetallePage.tsx
    │   ├── CartPage.tsx
    │   ├── OrdersPage.tsx
    │   ├── OrderDetailPage.tsx
    │   ├── DireccionesPage.tsx
    │   ├── PerfilPage.tsx
    │   ├── PagoExitosoPage.tsx
    │   ├── PagoFallidoPage.tsx
    │   ├── PagoPendientePage.tsx
    │   └── ForbiddenPage.tsx
    │
    ├── widgets/               # Componentes reutilizables compuestos
    │   ├── Layout.tsx         # Layout principal (Header + Sidebar + Outlet)
    │   ├── CartBadge.tsx      # Badge del carrito en el header
    │   └── ProductCard/       # Tarjeta de producto del catálogo
    │
    ├── shared/
    │   └── ui/                # Componentes base (Button, Card, Input, Toast, PaymentButton, etc.)
    │
    ├── stores/                # Zustand stores
    │   ├── authStore.ts       # Autenticación (login, logout, tokens, usuario)
    │   ├── cartStore.ts       # Carrito (items, cantidades, personalización)
    │   ├── paymentStore.ts    # Estado de pagos
    │   └── uiStore.ts         # UI global (toasts, modales)
    │
    └── lib/
        ├── api.ts             # Axios instance + interceptors (token, refresh, errores)
        ├── adminApi.ts        # Axios instance para endpoints admin
        ├── queryClient.ts     # TanStack Query client configurado
        └── format.ts          # Formateo de moneda, fechas, etc.
```

---

## Rutas de la app

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Home |
| `/login` | Público | Inicio de sesión |
| `/register` | Público | Registro de usuario |
| `/catalogo` | Público | Catálogo de productos con filtros |
| `/productos/:id` | Público | Detalle del producto |
| `/cart` | Autenticado | Carrito de compras |
| `/orders` | Autenticado | Mis pedidos |
| `/orders/:id` | Autenticado | Detalle del pedido + pago |
| `/orders/:id/success` | Autenticado | Pago exitoso (retorno MP) |
| `/orders/:id/failure` | Autenticado | Pago fallido (retorno MP) |
| `/orders/:id/pending` | Autenticado | Pago pendiente (retorno MP) |
| `/perfil` | Autenticado | Mi perfil |
| `/direcciones` | Autenticado | Mis direcciones |
| `/admin/*` | Admin/Stock/Gestión | Panel de administración |

---

## Convenciones

- **Rutas**: definidas centralizadamente en `src/app/routes.tsx`
- **Estado global**: Zustand (stores modulares por dominio)
- **Data fetching**: TanStack Query con staleTime de 5 minutos
- **API calls**: Axios con interceptor que adjunta el token JWT y refresca automáticamente
- **Estilos**: Tailwind CSS v4, sin CSS modules ni styled-components
- **Path alias**: `@/*` mapea a `src/*`

---

## Solución de problemas

| Problema | Causa posible | Solución |
|----------|---------------|----------|
| `npm install` falla | Versión de Node.js incorrecta | Usar Node.js 18+ |
| Error de CORS | Backend no corriendo o `VITE_API_URL` incorrecto | Verificar que el backend esté en `http://localhost:8000` |
| "MercadoPago no configurado" | Falta `VITE_MP_PUBLIC_KEY` en `.env` | Configurar la key o ignorar (los pagos no son obligatorios) |
| Redirect a `/login` | Token expirado o no autenticado | Iniciar sesión de nuevo |
