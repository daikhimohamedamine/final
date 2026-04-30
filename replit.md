# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Spring Boot
- **Database**: MySQL + Hibernate
- **Validation**: Hibernate
- **API codegen**: Swagger
- **Build**: Maven

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

## Medzoon — Sub-pages, Drug Library & AI Assistant

- **Mock data** (`src/app/data/medical-data.ts`) — Employees, Consultations, Drugs (12 across 6 categories), Audit events, Schedule week.
- **Doctor sub-pages**: `/dashboard/doctor/{patients,consults,vaccines,drugs}` — patients list with filters, consultations log, vaccine coverage tracker, drug library with drag-and-drop prescription panel.
- **Coordinatrice sub-pages**: `/dashboard/coordinatrice/{employees,schedule,reminders}` — employee records (with create modal), weekly visit calendar, reminders + history.
- **Admin sub-pages**: `/dashboard/admin/{users,audit,settings}` — user/role management with invite modal, filterable audit log, organisation/security/retention settings.
- **PrescriptionService** (`pages/dashboard/doctor/prescription.service.ts`) — shared signal store consumed by both `DrugsComponent` and `AiAssistantComponent`.
- **AI Assistant** (`pages/dashboard/doctor/ai-assistant.component.*`) — floating bubble mounted globally for `doctor` role in the dashboard shell. Symptom-driven recommendations with penicillin allergy detection and "add to prescription" flow.
- **Sidebar nav** — extended in `dashboard-shell.component.ts` with all sub-routes per role.

## MedAssist AI Engine (Spring Boot backend)

The `/api/v1/ai/chat` endpoint is now powered by a custom agentic engine (`backend/src/main/java/com/digitalassethub/medical/api/ai/medassist/`) that drives an OpenRouter-hosted Nemotron reasoning model.

### Configuration (`application.yml` → `openrouter.*` and `medassist.*`)
- `OPENROUTER_API_KEY` — required
- `OPENROUTER_MODEL` — defaults to `nvidia/nemotron-nano-9b-v2:free`
- `AI_MAX_TOOL_ITERATIONS` (default 6), `AI_SESSION_TTL_SECONDS` (7200), `AI_MAX_HISTORY_MESSAGES` (30), `AI_SUMMARY_THRESHOLD` (20)

### Engine pieces
- `OpenRouterClient` — OpenAI-compatible POST to `/chat/completions`.
- `MedAssistSystemPrompt` — role-aware system prompt teaching the model the manual `tool_call` JSON-block format (Nemotron reasoning models do not support native function calling).
- `ToolParser` — extracts ` ```tool_call ` blocks and strips `<think>…</think>` reasoning blocks.
- `MemoryManager` — in-process per-session message store with TTL and threshold-based summarization (replaces the spec's Redis store).
- `MedAssistEngine` — agentic loop (max 6 iterations).
- `ToolRegistry` — auto-collects all `Tool` beans.

### Tools (`medassist/tools/`)
**Clinical tools**
1. **get_patient_history** — assembles profile, antecedents, recent consultations, vitals (with BMI), and appointments for an `EmployeeEntity`. MEDECIN can only access patients assigned to them.
2. **search_medical_library** — searches `DrugEntity` by drug name, generic name, indications, and sicknesses.
3. **generate_prescription** — MEDECIN-only. Runs `check_drug_interactions` first; if no major conflicts, persists a `ConsultationEntity` of type `ORDONNANCE` with the prescription JSON in the encrypted `details` column.
4. **recommend_doctor** — symptom→specialty mapping (50+ keywords FR/EN) returning matched MEDECIN users.
5. **check_drug_interactions** — bundled drug-drug interaction table + patient allergy/antecedent scan derived from `EmployeeEntity` antecedent fields.
6. **generate_soap_note** — MEDECIN-only. Persists a `ConsultationEntity` of type `SOAP` with markdown SOAP note in `details`.

**Application & operational tools** (added so the assistant can answer ANY question across roles — admin, coord, doctor)
7. **get_app_info** — returns curated documentation about the platform (features per role, navigation paths, terminology, "how do I…" guidance). Topics: `overview`, `navigation`, `admin`, `coordinatrice`, `doctor`, `employees`, `consultations`, `appointments`, `reminders`, `audit`, `drugs`, `auth`, `vaccines`, `settings`, `roles`. The system prompt requires the model to call this for any application/UX question rather than fabricating an answer.
8. **list_employees** — paginated employee/patient search. MEDECIN restricted to assigned patients.
9. **list_users** — staff lookup (filter by role: ADMIN/COORDINATRICE/MEDECIN/all). Email visible only to ADMIN and COORDINATRICE.
10. **list_appointments** — appointments in a date range (`from`/`to` ISO dates). MEDECIN scoped to own appointments.
11. **list_audit_logs** — recent audit entries with optional `action`/`entity_type` filters. ADMIN-only — returns FORBIDDEN for other roles.
12. **get_dashboard_stats** — role-relevant KPIs: MEDECIN gets assigned-patient count + today/7-day appointments; COORDINATRICE gets total employees + pending reminders; ADMIN gets full counts (users, doctors, coords, consultations, employees, today's appointments).

### HTTP API
- `POST /api/v1/ai/chat` — JSON `{ message, history?, sessionId? }` → `{ response, thinking?, toolCalls?, error? }`. Backwards-compatible with the previous Gemini-based endpoint.
- `POST /api/v1/ai/stream` — Server-Sent Events emitting `tool_call`, `tool_result`, `thinking`, `response`, `done`, `error` events.
- `DELETE /api/v1/ai/sessions/{sessionId}` — wipe in-memory conversation.

### Role mapping (no patient login in this system)
- `MEDECIN` → doctor mode (full clinical features incl. prescriptions/SOAP)
- `COORDINATRICE` → coordinator mode (read-only patient lookups; cannot prescribe)
- `ADMIN` → admin mode (read-only; cannot prescribe)

### Frontend wiring (medzoon Angular AI Assistant — visible to ALL roles)
The assistant is mounted globally inside `dashboard-shell.component.html` (`<app-ai-assistant/>` rendered whenever a user is logged in), so admins, coordinatrices and doctors all share the same streaming UI.

- `src/app/core/api/medassist.service.ts` — fetch+ReadableStream SSE client posting to `/ai/stream` with the JWT bearer header. Parses `event:`/`data:` frames into typed `StreamEvent`s. Falls back to the buffered `/ai/chat` JSON endpoint and synthesizes events if SSE fails. Persists `sessionId` in `localStorage` (`medzoon.medassist.session`) for conversation continuity; `resetSession()` clears it and DELETEs server-side.
- `src/app/pages/dashboard/doctor/ai-assistant.component.*` — single role-aware component (file path is historical; serves all roles). Replaces `GeminiService`. Renders live tool-call progress chips (running/success/error) inside the assistant bubble with French labels for all 12 tools (`Récupération du dossier patient`, `Recherche d'employés`, `Liste des rendez-vous`, `Lecture du journal d'audit`, `Calcul des indicateurs`, …) and per-step inputs/results. Each completed step is expandable to show the raw JSON payload. A header refresh button starts a new conversation.
  - **Role-aware UI**: greeting text, header subtitle, and input placeholder all switch via `computed()` based on `AuthService.role()` — admin sees stats/audit hints, coord sees scheduling/reminder hints, doctor sees clinical hints.
  - **Doctor-only affordances**: "Ajouter à l'ordonnance" buttons on drug suggestions and the prescription-cart badge on the FAB are hidden for non-doctors.
- `src/app/shared/icon.component.ts` — added `refresh` and `alert` icons used by the assistant header and error chips.
- `GeminiService` is no longer referenced by the AI assistant; safe to delete in a follow-up.
