# ClubConnect

ClubConnect is a responsive event management website for the CodeChef Club at ABES. It combines a public event discovery and registration experience with a protected admin console for managing events and registrations.

## Features

- Home hero, club introduction, stats, upcoming events and featured event banner
- Searchable and filterable event catalog with upcoming/past views
- Registration modal with client/server validation and duplicate protection
- JWT-protected admin login and dashboard
- Event CRUD, featured event toggle, delete confirmation and registration management
- Registration search/filter and CSV export
- Three-layer motion system: GSAP + ScrollTrigger, Motion (`motion/react`), and Anime.js
- Mobile-first responsive layout, reduced-motion support, loading/empty/error states and toasts

## Admin credentials

- Email: `admin@club.com`
- Password: `admin123`

Change these credentials before using a deployed instance with real data.

## Local setup

```bash
npm install
npm run dev
```

The Vite client runs on `http://localhost:5173` and proxies `/api` to the Express server on `http://localhost:3000`.

For a production build:

```bash
npm run build
PORT=3000 npm start
```

The app uses a managed MySQL-compatible database when `DATABASE_URL` is present. Without it, the server uses an in-memory seeded store so the UI is fully runnable for local preview. See `server/src/db/schema.sql` for the durable schema and the idempotent seed version marker.

## Environment variables

- `PORT` — Express listener port (defaults to `3000`)
- `DATABASE_URL` — optional MySQL-compatible connection string
- `JWT_SECRET` — optional signing secret (defaults to a development-only value)
- `NODE_ENV` — `development` or `production`

## API overview

- `GET /api/events`
- `POST /api/events` (admin)
- `PUT /api/events/:id` (admin)
- `DELETE /api/events/:id` (admin)
- `POST /api/registrations`
- `GET /api/registrations` (admin)
- `GET /api/registrations/export.csv` (admin)
- `POST /api/auth/login`
- `GET /api/health`

## Motion ownership

- **GSAP + ScrollTrigger:** hero text/gradient, section reveals, counters and featured-event parallax. Cleanup uses `gsap.context()` and effect teardown.
- **Motion:** page transitions, cards, dialogs, list layout changes, mobile nav and admin feedback state.
- **Anime.js:** decorative SVG paths, code-symbol particles, pulses, shimmer and spinners.

All non-essential motion honors `prefers-reduced-motion`; mobile reduces particle count and parallax work. Anime.js decorative instances are dynamically loaded after mount and removed on cleanup; skeleton shimmer and the button spinner remain lightweight CSS micro-interactions.

## Project structure

- `client/` — React/Vite/Tailwind client
- `server/` — Express API, database schema, migrations and seed
- `shared/` — API contracts shared by client and server

## Deployment

The app is prepared for a hybrid deployment: static Vite output for the browser shell and an Express container for `/api` plus SPA fallback. The Web Dev project configuration owns the published build/deploy/routing declarations.
