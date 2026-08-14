# Vibe Shelf

A community bookshelf where vibe-coded GitHub projects are displayed as vintage library books. Each book spine shows the owner's initials and project name. Clicking a book pulls it off the shelf to reveal the project details — live link, GitHub link, and collaboration email. Anyone can add their own book.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at /api)
- `pnpm --filter @workspace/vibe-shelf run dev` — run the frontend (port 20572, proxied at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + framer-motion (book animations)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (v3), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/db/src/schema/books.ts` — books table definition
- `artifacts/api-server/src/routes/books.ts` — books CRUD route handlers
- `artifacts/vibe-shelf/src/` — React frontend (bookshelf UI)
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not edit)
- `lib/api-zod/src/generated/` — generated Zod schemas (do not edit)

## Architecture decisions

- `type: number` used instead of `type: integer` in OpenAPI spec because Orval + Zod v3 generates `zod.int()` for integers (a Zod v4-only method), which fails typecheck.
- `/books/stats` route is registered before `/books/:id` in Express to avoid the stats path being swallowed by the param route.
- Spine colors are assigned server-side randomly from a curated vintage palette (`SPINE_COLORS` in `lib/db/src/schema/books.ts`).

## Product

- **Bookshelf view** — warm vintage library aesthetic with walnut wood-grain background, colored book spines on shelf rows, amber accent colors, and serif typography.
- **Book spine** — shows owner's first + last name initials and project name rotated vertically.
- **Book pull** — clicking a spine animates it outward and shows a parchment-style card with project name, owner, live link, GitHub link, and collaboration email.
- **Add Your Book** — modal form for submitting first name, last name, project name, GitHub link, plus optional live link and email.
- **Shelf stats** — total volume count shown in the header.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After changing `lib/*` schemas, run `pnpm run typecheck:libs` before checking artifact packages — stale declarations cause false TS errors like "module has no exported member".
- After each OpenAPI spec change, re-run codegen: `pnpm --filter @workspace/api-spec run codegen`.
- Use `type: number` (not `type: integer`) in the OpenAPI spec to stay compatible with Zod v3 codegen.
- Seed data is in the DB only — there is no seed script file. Re-seed via direct SQL if needed.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
