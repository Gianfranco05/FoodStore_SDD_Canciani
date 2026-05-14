# Project Skill Registry

Maps domains and task contexts to project-specific skills for the OPSX workflow.
The orchestrator reads this file during the **apply** phase to identify which
domain skills to load before implementing tasks.

## Usage

When a change involves tasks in any of the domains below, load ALL matching
skills before writing code. Each skill carries project-specific patterns,
conventions, and templates that must be followed.

## Registry

| Domain / Task Context | Skill(s) | Description |
|---|---|---|
| **Frontend — React components, hooks, JSX, performance** | `vercel-react-best-practices` | React 19 optimization: waterfalls, bundle size, re-renders, server-side patterns |
| **Frontend — Tailwind CSS, design system, UI components, responsive** | `tailwind-design-system` | Tailwind v4 CSS-first config, design tokens, component variants, dark mode |
| **Frontend — View transitions, page animations, route transitions** | `vercel-react-view-transitions` | React View Transition API, shared element animations, directional nav |
| **Backend — FastAPI, Python API routes, async endpoints** | `fastapi-templates` | FastAPI async patterns, dependency injection, project structure, error handling |
| **DevOps — Vercel deployment** | `deploy-to-vercel` | Vercel deployment configuration and workflows |
| **Inventory — stock management, low stock, transfers** | `shopify-inventory-management` | Multi-location inventory, demand forecasting, safety stock, ABC analysis |

## Notes

- **Multiple skills can apply simultaneously** (e.g., a UI change using React components with Tailwind styling should load both `vercel-react-best-practices` and `tailwind-design-system`).
- Skills not listed here (e.g., `go-testing`, `vercel-react-native-skills`) are not relevant to this project and should not be loaded.
- This file is read during the OPSX **apply** phase. The orchestrator checks for its existence before implementation begins.
