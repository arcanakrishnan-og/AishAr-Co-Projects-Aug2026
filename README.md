# 📚 Vibe Shelf — AishAr Co. Projects

A community bookshelf where AishAr Co. cohort members register their vibe-coded GitHub projects as vintage library book spines.

---

## What It Is

Vibe Shelf is a visual, interactive bookshelf built for the AishAr Co. community. Each book spine on the shelf represents a real project built by a cohort member. Click any spine to open the book and read the project details.

### Features

- 🎨 **Vintage book spines** — each project gets a unique colour and typography
- 📖 **Book-opening animation** — click a spine to flip it open with a smooth Framer Motion animation
- 👑 **AI Builder of the Week** — a crown badge highlights the featured project (gated with a secret code)
- ✏️ **Add & Edit projects** — submit your own project or update an existing entry
- 📊 **Shelf stats** — see total books and recent additions at a glance

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS + Framer Motion + shadcn/ui |
| Backend | Express 5 + Drizzle ORM + PostgreSQL |
| API contract | OpenAPI spec → Orval codegen → TanStack Query |
| Monorepo | pnpm workspaces + TypeScript 5.9 |

---

## Project Structure

```
artifacts/
  vibe-shelf/        # React frontend (Vite)
  api-server/        # Express REST API
lib/
  db/                # Drizzle schema + migrations
  api-spec/          # OpenAPI spec (source of truth)
  api-zod/           # Generated Zod validators
  api-client-react/  # Generated TanStack Query hooks
```

---

## Getting Started

**Prerequisites:** Node 24, pnpm 9+, PostgreSQL

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm --filter @workspace/db run push

# Start everything
pnpm --filter @workspace/api-server run dev   # API on :8080
pnpm --filter @workspace/vibe-shelf run dev   # Frontend on :5173
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/books` | List all books on the shelf |
| `POST` | `/api/books` | Add a new book |
| `GET` | `/api/books/:id` | Get a single book |
| `PATCH` | `/api/books/:id` | Update a book |
| `DELETE` | `/api/books/:id` | Remove a book |
| `GET` | `/api/books/stats` | Shelf statistics |

---

## Built by AishAr Co.

This project was vibe-coded iteratively as part of the AishAr Co. AI builders cohort, August 2026.
