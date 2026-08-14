# Threat Model

## Project Overview

Vibe Shelf is a community bookshelf web app where users can submit their vibe-coded GitHub projects as virtual library books. The stack is Node.js 24 + Express 5 (API server) with React + Vite (frontend), PostgreSQL via Drizzle ORM, and Zod for request validation. It is not currently deployed to production (no live deployment found).

The application is intentionally open — anyone can add a book. There is **no user authentication** or account system. The API lives at `/api` and is publicly accessible.

## Assets

- **Book records** — user-submitted entries containing first/last name, project name, GitHub link, optional live link, optional email, and optional description. Email addresses are PII.
- **`isBadged` flag** — an "AI Builder of the Week" badge field on each book, presumably awarded by administrators. If this has any social or competitive value, it is an asset.
- **Database** — PostgreSQL instance accessed via `DATABASE_URL`. Full access would expose all records and PII (emails).
- **Application secrets** — `DATABASE_URL` environment variable. Exposure allows direct DB access.

## Trust Boundaries

- **Browser to API** — All client requests cross this boundary. There is no authentication, so the only controls are Zod input validation and CORS headers.
- **API to PostgreSQL** — Drizzle ORM with parameterized queries; no raw string concatenation found.
- **Public surface** — All read, write, update, and delete operations on books are publicly reachable with no authentication required.

## Scan Anchors

- **Entry points**: `artifacts/api-server/src/routes/books.ts` (all book CRUD), `artifacts/api-server/src/routes/health.ts`
- **Highest-risk areas**: `PATCH /books/:id` and `DELETE /books/:id` (unauthenticated mutation of any record), `isBadged` field (privilege escalation via self-badging)
- **Public surface**: All endpoints — no authenticated or admin surface exists
- **Dev-only**: `artifacts/mockup-sandbox/` (Canvas design mockup, not production)

## Threat Categories

### Tampering

Any anonymous user can issue `PATCH /api/books/:id` with any numeric ID to overwrite another user's book record — including name, links, and description — or issue `DELETE /api/books/:id` to permanently remove it. There is no ownership proof, session token, or secret required. This is the highest-impact threat: the entire community shelf can be defaced or wiped by a single attacker.

**Required guarantee:** Mutating and deleting book records MUST require proof of ownership (e.g., a creation token stored in the browser, a magic-link email, or an admin credential). Server-side enforcement only.

### Elevation of Privilege

The `isBadged` field ("AI Builder of the Week") is accepted as user input on both `POST /books` (create) and `PATCH /books/:id` (update). Any user can self-assign the badge without restriction. If the badge has any display or competitive significance, this is a privilege escalation.

**Required guarantee:** `isBadged` MUST only be settable by an authenticated administrator. It must be stripped from the public create/update request schemas.

### Information Disclosure

The `GET /books` endpoint returns all book records including email addresses. There is no rate limiting, pagination limit, or field filtering, so a single unauthenticated request returns every email on the shelf. Combined with the open CORS policy (`Access-Control-Allow-Origin: *`), any malicious website visited by a browser can silently harvest all emails.

**Required guarantee:** Email addresses MUST either be excluded from list responses or gated behind authentication. Rate limiting MUST be applied to all read endpoints.

### Denial of Service

No rate limiting exists on any endpoint. An attacker can spam `POST /books` to fill the database with junk, or repeatedly call `GET /books` to amplify database load. `DELETE /books/:id` with sequential IDs can empty the shelf.

**Required guarantee:** Rate limiting MUST be applied to write endpoints. The delete/update endpoints MUST require authorization.

### Spoofing

No authentication system exists. This is by design for the public-add use case, but the absence of any ownership model means there is nothing to spoof — and nothing to protect individual submissions. Any future authentication addition must be enforced server-side.

### Injection

Drizzle ORM uses parameterized queries throughout. No raw SQL string concatenation found. No template injection or command injection paths identified. Risk is LOW given the ORM usage.
