# Kingsman Platform (MERN MVP)

## Repository Structure

- `frontend/` – Kingsman Admin SPA (Vite + React + TypeScript + styled-components + react-router-dom).
- `backend/` – Express + TypeScript API with in-memory datastore for realms, users, and groups (nodemon dev server).
- `prd/` – Product requirements, roadmap, and design documents (`kingsman.md`, `kingsman-hld.md`, `kingsman-lld.md`).

## Prerequisites

- Node.js 20.x (matching the current environment; Vite warns if lower than 20.19).
- npm 9.x (ships with Node 20).

## Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Start the dev server (auto restarts via nodemon):
   ```bash
   npm run dev
   ```
3. The API listens on `http://localhost:4000` by default and exposes:
   - `GET /health`
   - Realm CRUD under `/realms`
   - Realm-scoped user routes `/realms/:realmId/users`
   - Realm-scoped group routes `/realms/:realmId/groups`

> **Note:** The datastore is in-memory for the MVP. Restarting the server resets seed data (System Realm, Engineering group, Founding Admin user).

## Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Configure the API base URL if needed by creating `.env` (optional):
   ```env
   VITE_API_BASE_URL=http://localhost:4000
   ```
   The default points to `http://localhost:4000` so this step can be skipped in local dev.
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open the provided URL (usually `http://localhost:5173`) to access the Kingsman Admin.

## Core Features Implemented (Phase 1 & 2)

- Realm list & creation with slug uniqueness checks, metadata, and status.
- User directory per realm with invite, status toggle, and group assignments.
- Group management per realm with parent linkage, uniqueness, and user membership.
- Context-driven state management syncing realms, users, and groups with backend.
- Styled-components layout shell, dashboard summaries, and navigation between realms/users.

## Next Steps

- Persist data using MongoDB and wire authentication/token services (Phase 3+).
- Harden validation, add request schemas, and introduce real auth flows.
- Expand UI for realm settings and client management.
