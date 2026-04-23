# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Medzoon Authentication & Dashboards

The `@workspace/medzoon` Angular 19 artifact includes a full client-side auth flow plus three role-specific dashboards.

- **Auth service** (`src/app/auth/auth.service.ts`) — signals-based, persists session in `localStorage` (`medzoon.session.v1`). Three demo accounts at `admin@medzoon.health`, `coord@medzoon.health`, `doctor@medzoon.health` (password `demo123`).
- **Roles**: `admin` (purple) → `/dashboard/admin`; `coordinatrice` (cyan) → `/dashboard/coordinatrice`; `doctor` (blue) → `/dashboard/doctor`.
- **Guards** (`src/app/auth/auth.guards.ts`): `authGuard` (must be signed in), `roleGuard(...roles)`, `dashboardRedirectGuard` (sends `/dashboard` to the user's role home).
- **Login** (`src/app/pages/login/login.component.*`) — split-screen form with demo-account quick-fill cards.
- **Dashboard shell** (`src/app/pages/dashboard/shared/dashboard-shell.component.*`) — sidebar + topbar (search, notifications, user menu with sign-out), role-aware nav.
- **Role pages** (`src/app/pages/dashboard/{admin,coordinatrice,doctor}/`) — each ships KPIs, tables, lists, and progress bars, sharing styles via `shared/dash-ui.scss`.
- The `AppComponent` hides the marketing navbar/footer on `/login` and `/dashboard/*` routes.
