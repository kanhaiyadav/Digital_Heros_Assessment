# LeadDesk Mini

A small lead-capture product: a public landing page collects leads (name, email, budget range,
message), and an authenticated `/admin` view lets a single admin search, filter, and progress
leads through **New → Contacted → Closed**.

Built for the Digital Heroes full-stack assessment (Task A + Task B).

- **Live landing page:** `TODO — add deployed Vercel URL`
- **Live admin view:** `TODO — add deployed Vercel URL/admin`
- **Repo:** `TODO — add public GitHub repo URL`
- **Loom walkthrough (form submission → status change):** `TODO — add Loom link`

Every page carries the required footer credit line: *"Built for Digital Heroes Training Task"*,
linked to [digitalheroesco.com](https://digitalheroesco.com).

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, shadcn/ui (base-ui flavor), lucide-react icons, React Router v7, TanStack Query v5, React Hook Form + Zod |
| Backend | Node.js, Express, TypeScript, Mongoose |
| Database | MongoDB |
| Auth | JWT access + refresh tokens in httpOnly cookies, bcrypt password hashing |
| Deployment target | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

---

## Data model

### `Lead`

| Field | Type | Notes |
|---|---|---|
| `name` | String | required, 2–100 chars |
| `email` | String | required, validated format, **not unique** — the same person may submit more than once |
| `budgetRange` | enum | `<5k`, `5k-15k`, `15k-50k`, `50k+` |
| `message` | String | required, 10–2000 chars |
| `status` | enum | `New` (default), `Contacted`, `Closed` |
| `createdAt` / `updatedAt` | Date | automatic timestamps |

`budgetRange` is a bounded enum rather than a free-text/numeric field so the UI can render a
simple `<select>` and the admin list can filter on it without extra parsing logic. Indexes:
`{ status: 1, createdAt: -1 }` for the admin list's default filter+sort, plus indexes on `name`
and `email` to back the search box (implemented as a case-insensitive substring `$or` regex
across name/email/message, not a MongoDB text index — text indexes only match whole tokens, so
typing a partial name like "jo" would fail to find "John").

### `AdminUser`

| Field | Type | Notes |
|---|---|---|
| `email` | String | required, unique |
| `passwordHash` | String | bcrypt hash, `select: false` (never returned by default queries) |
| `name` | String | required |

There is **no public registration route** anywhere in the API — this is intentional per the
assessment ("not a hardcoded string" doesn't mean "self-serve signup"). The only admin account is
created by a one-off, idempotent seed script (`npm run seed`) from environment variables.

### `RefreshToken`

| Field | Type | Notes |
|---|---|---|
| `admin` | ObjectId ref `AdminUser` | indexed |
| `tokenHash` | String | SHA-256 hash of the raw refresh token — the raw value is **never** stored |
| `expiresAt` | Date | TTL-indexed, MongoDB auto-purges expired rows |
| `revokedAt` | Date | set on logout, rotation, or reuse detection |

Storing a hash instead of the raw token means a database read or leak doesn't hand over a usable
credential, the same principle as password hashing.

---

## Auth approach

**JWT access token (15 min) + rotated JWT refresh token (30 days), both as httpOnly cookies.**

1. `POST /api/auth/login` verifies the password with `bcrypt.compare` (generic "Invalid email or
   password" for both a wrong email and a wrong password, to avoid leaking which one was wrong)
   and is rate-limited (10 attempts / 15 min / IP) to slow down brute-forcing.
2. On success, the server sets two httpOnly cookies: a short-lived access token used to
   authenticate API calls, and a longer-lived refresh token used only to mint new access tokens.
   Both are `secure` + `sameSite=none` in production (the frontend and backend are deployed on
   different domains) and `sameSite=lax` in local dev.
3. When an access token expires, the frontend's API client transparently calls
   `POST /api/auth/refresh` once and retries the original request — the user never sees a login
   prompt mid-session.
4. Refresh tokens are **rotated** on every use: the old one is marked revoked and a new one is
   issued. If a revoked refresh token is ever presented again (a sign of theft — e.g. a stolen
   cookie replayed after the legitimate client already rotated it), every session for that admin
   is revoked and re-login is required.
5. `POST /api/auth/logout` revokes the current refresh token and clears both cookies.

Why JWTs over `express-session`: verifying an access token needs no database round trip (only
`/refresh` touches Mongo), which matters on Render's free tier where the instance can spin down
and cold-start. Rotation + hashed storage + reuse detection also make "tokens handled properly"
an explicit, auditable property rather than trusting an opaque session id.

---

## API reference

Base path `/api`. Errors: `{ "error": { "message": string, "details"?: unknown } }`.

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/leads` | none | Create a lead (public form submission) |
| `GET` | `/leads` | admin | List leads — `search`, `status`, `page`, `limit` query params |
| `PATCH` | `/leads/:id/status` | admin | Update a lead's status |
| `POST` | `/auth/login` | none | Log in, sets auth cookies |
| `POST` | `/auth/logout` | admin | Revoke session, clears cookies |
| `POST` | `/auth/refresh` | cookie | Rotate tokens using the refresh cookie |
| `GET` | `/auth/me` | admin | Current admin session |
| `GET` | `/health` | none | Deploy/uptime smoke check |

---

## Local development

Requires Node 20+ and a MongoDB instance (local `mongod` or a free Atlas cluster).

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env       # then fill in real secrets, see below
npm run seed                # creates the single admin user from ADMIN_SEED_* env vars
npm run dev                  # starts on http://localhost:4000

# 2. Frontend (in a second terminal)
cd frontend
npm install
cp .env.example .env
npm run dev                  # starts on http://localhost:5173
```

Visit `http://localhost:5173` for the landing page and `http://localhost:5173/admin` for the
admin view (log in first at `/login` with the seeded credentials).

### Environment variables

**`backend/.env`**

| Var | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `CORS_ORIGIN` | Comma-separated allowed frontend origin(s) — never `*` |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Long random strings (`node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`) |
| `JWT_ACCESS_EXPIRES` / `JWT_REFRESH_EXPIRES` | Token lifetimes, e.g. `15m` / `30d` |
| `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` / `ADMIN_SEED_NAME` | Used only by `npm run seed`, never at runtime |
| `BCRYPT_COST` | bcrypt cost factor (12 recommended) |

**`frontend/.env`**

| Var | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL, e.g. `http://localhost:4000/api` |

---

## Deployment (free tier: Vercel + Render + MongoDB Atlas)

Deploy in this order — Render needs the Mongo URI, and Vercel needs the Render URL.

### 1. MongoDB Atlas

1. Create a free M0 cluster.
2. Create a database user (separate from your Atlas login).
3. Network Access → allow `0.0.0.0/0` (Render's free tier has no static egress IP, so
   IP-allowlisting isn't available on this combination — the accepted tradeoff is a strong,
   unique database password).
4. Copy the SRV connection string — this becomes `MONGODB_URI`.

### 2. Render (backend)

`backend/render.yaml` is a ready-to-use blueprint. Either:

- **Blueprint:** In Render, "New" → "Blueprint" → point at this repo. It reads `render.yaml`
  automatically.
- **Manual:** "New" → "Web Service" → Root Directory `backend` → Build Command
  `npm install && npm run build` → Start Command `npm start` → Plan: Free.

Either way, set these env vars in the Render dashboard (they're marked `sync: false` in the
blueprint so they're never committed): `MONGODB_URI`, `CORS_ORIGIN` (the exact Vercel URL you'll
get in step 3 — you may need to update this after deploying the frontend), `ADMIN_SEED_EMAIL`,
`ADMIN_SEED_PASSWORD`. `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET` are auto-generated by Render.

After the first successful deploy, open Render's Shell tab and run `npm run seed` once to create
the admin account.

Note: Render's free tier spins down after inactivity — the first request after idle can take
30–50 seconds. See "Keeping the backend warm" below for how this repo mitigates that.

### 3. Vercel (frontend)

Import the repo → Root Directory `frontend` → framework Vite is auto-detected → set env var
`VITE_API_BASE_URL=https://<your-render-service>.onrender.com/api` → Deploy.

`frontend/vercel.json` adds an SPA rewrite so a hard refresh on `/admin` or `/login` doesn't 404.

### 4. Close the loop

Go back to Render and set `CORS_ORIGIN` to the exact Vercel URL you were assigned (no trailing
slash, no wildcard), then redeploy the backend. **This is the most likely failure point**: for
cookies to survive the cross-origin Vercel↔Render round trip, the backend must set
`secure: true` + `sameSite: 'none'` (already handled automatically in production by
`backend/src/utils/cookies.ts`) *and* `CORS_ORIGIN` must exactly match the frontend's origin with
`credentials: true` — both are already wired up in `backend/src/app.ts`, they just need the right
value in the environment.

### Keeping the backend warm

Render's free tier sleeps a service after ~15 minutes with no requests, and the next request pays
a 30–50s cold start — a real problem for the "confirmed working from a fresh browser" requirement.
Two layers mitigate it, neither requiring a paid tier:

1. **`.github/workflows/keep-alive.yml`** — a GitHub Actions cron job that pings `/api/health`
   every 10 minutes, around the clock, independent of whether anyone is actually visiting the
   site. After deploying the backend, set the target: repo **Settings → Secrets and variables →
   Actions → Variables → New repository variable** named `RENDER_HEALTH_URL`, value
   `https://<your-render-service>.onrender.com/api/health`. Without it the workflow just logs a
   reminder and exits instead of failing.
2. **`frontend/src/hooks/useKeepAlive.ts`** — while the app is open in a browser tab, it pings the
   same health endpoint every 4 minutes (paused when the tab isn't visible, via the Page
   Visibility API). This is a supplement for long admin sessions, not a replacement for #1 — a
   tab has to already be open for it to help, which is exactly the gap the GitHub Actions cron
   covers instead.

---

## Test admin credentials

Provided separately (via the submission email / not committed here in plaintext) — created by
`ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` at deploy time and by `backend/.env` locally.
