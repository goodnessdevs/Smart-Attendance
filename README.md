# Smart Attendance

Attendance tracking for the Federal University of Agriculture, Abeokuta.
Next.js App Router frontend for the Smartendance API.

## Requirements

- Node 20+
- pnpm 10+

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev
```

The app runs at http://localhost:3000.

## Scripts

| Command | Does |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve a production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |

## Environment

See `.env.example`. `BACKEND_URL` and `GOOGLE_AUTH_URL` are server-only and
never reach the browser; `NEXT_PUBLIC_BACKEND_ORIGIN` is public and used only
to validate OAuth popup messages.

## How auth works

The session JWT lives in an **httpOnly cookie**, so client JavaScript cannot
read it and an XSS bug cannot exfiltrate it.

1. The sign-in button opens `/api/auth/login`, which redirects to Google.
2. The backend returns a token to the opener window.
3. The client posts it to `/api/auth/session`, which verifies it against the
   backend and sets the cookie. The token is never persisted client-side.
4. All data requests go to same-origin `/api/backend/*`. That route reads the
   cookie and attaches `Authorization: Bearer <token>` server-side.

`/api/auth/callback` implements a stronger variant: point the backend's OAuth
redirect at it and the token goes straight into the cookie without ever
touching client JavaScript. `NEXT_PUBLIC_BACKEND_ORIGIN` can then be removed.

### Route protection

`src/proxy.ts` (Next 16's name for middleware) checks the cookie is present,
and each area's layout calls `requireRole()`, which verifies the role against
the backend before rendering.
Neither is a security boundary — **the API must re-check every request.**

## Structure

```
src/
├── app/            routes only, kept thin
│   └── api/        BFF: session routes + the backend proxy
├── features/       one folder per domain (auth, courses, attendance, ...)
│                   each with api/ components/ schema.ts types.ts
├── components/
│   ├── ui/         shadcn primitives
│   ├── common/     PageHeader, DataTable, StatCard, states
│   └── layout/     AppShell, AppSidebar, footer
├── lib/            axios instance, query client, geolocation, device,
│                   server/{auth,session,backend}
└── config/         env, colleges, venues, navigation
```

Conventions: TanStack Query for all server state, one Axios instance, Zustand
for client state, React Hook Form + Zod for forms, shadcn/ui + Tailwind v4.

## Adding a backend endpoint

New endpoints must be added to the allow-list in
`src/app/api/backend/[...path]/route.ts`, otherwise the proxy returns 404. This
is deliberate — without it the route would relay any path on the upstream API.

## Deploying to Vercel

- **Root Directory**: `web` (if this lives in a monorepo alongside the old app)
- Add every variable from `.env.example` under Project Settings
- Framework preset: Next.js (auto-detected)
