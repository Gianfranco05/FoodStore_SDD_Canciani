## Context

El frontend del proyecto usa **Tailwind CSS v4.2.4** con la configuración mínima: un `@import "tailwindcss"` en `index.css` y un `tailwind.config.js` legacy (obsoleto en v4). Los componentes UI manejan variantes manualmente con objetos + template literals, sin utilidades de merge de clases.

No existen design tokens, dark mode, ni un sistema de diseño consistente. Los colores están hardcodeados como valores literales (ej: `bg-green-600`, `border-gray-300`).

## Goals / Non-Goals

**Goals:**
- Configurar Tailwind v4 con CSS-first (`@theme`, `@layer`, `@custom-variant`)
- Establecer design tokens semánticos con OKLCH (colores, radii, animaciones)
- Agregar dark mode con `@custom-variant dark`
- Instalar `clsx`, `tailwind-merge`, `class-variance-authority`
- Crear utility `cn()` para merge inteligente de clases
- Refactorizar Button, Input, Card, Toast con CVA + cn()
- Garantizar focus-visible rings en todos los componentes interactivos

**Non-Goals:**
- NO refactorizar páginas enteras ni widgets completos
- NO cambiar el logo, tipografías, o identidad visual
- NO agregar animaciones complejas (solo las base)
- NO modificar el backend
- NO tocar componentes de páginas específicas (solo shared/ui/)

## Decisions

### 1. Tailwind v4 CSS-first sobre tailwind.config.js legacy
**Decisión:** Eliminar `tailwind.config.js` y mover toda la configuración a `@theme` en CSS.
**Rationale:** Tailwind v4 migró la configuración a CSS. El archivo JS es obsoleto y mantenerlo causa confusión. La configuración en CSS es más declarativa y permite usar características nativas como OKLCH, `@keyframes` dentro de `@theme`, y `@custom-variant`.
**Alternativa considerada:** Mantener ambos (JS + CSS) — descartado porque en v4 conviven pero el JS es solo compatibilidad, no agrega valor.

### 2. OKLCH sobre HEX/RGB para colores
**Decisión:** Usar OKLCH para todos los tokens de color.
**Rationale:** OKLCH es perceptualmente uniforme — lo que significa que un cambio de 5% en lightness se ve igual en cualquier color. Es más predecible para generar variantes y más accesible. Tailwind v4 lo soporta nativamente.
**Alternativa considerada:** HEX/RGB — más familiares pero menos precisos para sistemas de diseño.

### 3. CVA (class-variance-authority) sobre objetos manuales
**Decisión:** Usar CVA para definir variantes de componentes en lugar de objetos + template literals.
**Rationale:** CVA da tipado completo a las variantes, evita errores de tipeo, y genera el className correcto automáticamente. Se integra perfectamente con TypeScript y `cn()`.
**Alternativa considerada:** Seguir con objetos manuales — funcionan pero no escalan, no tienen tipado, y producen código verboso.

### 4. cn() con clsx + tailwind-merge sobre template literals
**Decisión:** Crear `cn()` que use `clsx` para condicionales y `tailwind-merge` para resolver conflictos de clases.
**Rationale:** `tailwind-merge` resuelve inteligentemente conflictos (ej: `bg-red-500 bg-blue-500` → gana la última). `clsx` maneja condicionales, arrays y objetos limpiamente. Juntos reemplazan toda la concatenación manual.
**Alternativa considerada:** Solo `clsx` — no resuelve conflictos de clases Tailwind.

### 5. Refactorizar solo shared/ui/ (no componentes de páginas)
**Decisión:** Refactorizar únicamente los componentes base en `shared/ui/` (Button, Input, Card, Toast).
**Rationale:** Estos 4 componentes son los bloques de construcción del design system. Refactorizar páginas enteras multiplica el esfuerzo sin beneficio proporcional. Los demás componentes pueden adoptar `cn()` gradualmente.
**Alternativa considerada:** Refactorizar todo — esfuerzo enorme, riesgo alto de romper funcionalidad probada.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| Al eliminar `tailwind.config.js`, clases custom podrían no funcionar | Como no había `theme.extend` ni plugins, no hay nada que perder. Verificar post-migración. |
| OKLCH no soportado en browsers muy viejos | OKLCH tiene ~93% cobertura global. Para este proyecto (app moderna), es aceptable. |
| CVA cambia la API de los componentes | Los componentes existentes se usan en varias páginas. Mantener la misma interfaz de props (variant, size, className) asegura compatibilidad. |
| Dark mode con class requiere mantener estado | Se implementa con ThemeProvider + localStorage, sin dependencias externas. |

## Open Questions

- (ninguna — todas las decisiones están tomadas para la Fase 1)
