## 1. Setup — Dependencias y limpieza

- [x] 1.1 Instalar `clsx`, `tailwind-merge`, `class-variance-authority` como devDependencies
- [x] 1.2 Eliminar `tailwind.config.js` (obsoleto en Tailwind v4)
- [x] 1.3 Verificar que `postcss.config.js` queda correcto con solo `@tailwindcss/postcss`

## 2. CSS — Design tokens y base styles

- [x] 2.1 Actualizar `src/index.css` con `@theme` conteniendo colores semánticos OKLCH (light mode)
- [x] 2.2 Agregar variante dark con `@custom-variant dark` y tokens dark mode en `.dark`
- [x] 2.3 Agregar `@layer base` con `border-border` y `bg-background text-foreground antialiased`
- [x] 2.4 Agregar tokens de `--radius-*` (sm, md, lg, xl) y `--animate-*` con `@keyframes`
- [x] 2.5 Verificar que el CSS sigue la sintaxis de Tailwind v4 correctamente

## 3. Utilities — cn() + helpers

- [x] 3.1 Crear `src/lib/utils.ts` con función `cn()`, `focusRing` y `disabled` utilities

## 4. Refactor — Componentes UI a CVA + cn()

- [x] 4.1 Refactorizar `shared/ui/Button.tsx` usando CVA + cn() con variantes primary/secondary/outline/ghost y sizes sm/md/lg
- [x] 4.2 Refactorizar `shared/ui/Input.tsx` usando cn() + estado de error con borde destructivo
- [x] 4.3 Refactorizar `shared/ui/Card.tsx` como compound component (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter) con CVA + cn()
- [x] 4.4 Refactorizar `shared/ui/Toast.tsx` usando cn() + variantes success/error/warning/info

## 5. Verificación

- [ ] 5.1 Verificar que el frontend compile sin errores (`npm run build`)
- [ ] 5.2 Verificar que los componentes refactorizados se rendericen correctamente (revisar páginas que los usan)
