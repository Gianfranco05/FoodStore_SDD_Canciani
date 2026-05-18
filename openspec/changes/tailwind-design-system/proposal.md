## Why

El proyecto ya está funcionalmente completo, pero el sistema de estilos con Tailwind CSS v4 no está aprovechando las capacidades modernas de la herramienta. Actualmente no hay design tokens, no hay utilidades de merge de clases, y los componentes manejan variantes manualmente con concatenación de strings. Esto hace que el mantenimiento sea propenso a errores, difícil de escalar, y sin un sistema de diseño consistente.

Este cambio establece la **fundación** del design system: configuración moderna de Tailwind v4, utilidades base, y patrones de componentes reutilizables.

## What Changes

- **BREAKING**: Eliminar `tailwind.config.js` (obsoleto en Tailwind v4 — la configuración ahora es CSS-first)
- **Nuevas dependencias**: Instalar `clsx`, `tailwind-merge`, `class-variance-authority`
- **Nueva utility**: Crear `src/lib/utils.ts` con función `cn()` que unifique merge de clases
- **Design tokens**: Configurar `@theme` en `src/index.css` con colores semánticos OKLCH, radii, animaciones
- **Dark mode**: Agregar soporte con `@custom-variant dark`
- **Base styles**: Agregar `@layer base` con reset de estilos base
- **Refactor componentes UI**: Migrar Button, Input, Card, Toast a patrón CVA + cn()
- **Accesibilidad**: Asegurar focus-visible rings en todos los componentes interactivos

## Capabilities

### New Capabilities
- `design-system`: Sistema de diseño con Tailwind v4 — tokens semánticos, dark mode, utilidades de merge, y componentes base reutilizables con variantes tipadas.

### Modified Capabilities
*(Ninguna — es la primera vez que se definen specs en este proyecto)*

## Impact

- **frontend/package.json**: Nuevas dependencias dev (`clsx`, `tailwind-merge`, `class-variance-authority`)
- **frontend/tailwind.config.js**: **Eliminado** (obsoleto en v4)
- **frontend/src/index.css**: Completamente renovado con `@theme`, `@custom-variant dark`, `@layer base`
- **frontend/src/lib/utils.ts**: Nuevo archivo con `cn()`, `focusRing`, `disabled` utilities
- **frontend/src/shared/ui/**: Refactor de Button.tsx, Input.tsx, Card.tsx, Toast.tsx para usar CVA + cn()
- **Otros componentes**: Pueden beneficiarse de `cn()` sin cambios obligatorios
