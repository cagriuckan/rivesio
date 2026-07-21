# Rivesio

Centralized feedback widget server and admin panel.

Drop a lightweight script on any site, collect bug reports and ideas into a shared inbox, and reply from the dashboard — with screenshots, attachments, site approval, and team agents.

## Features

- Embeddable feedback widget (categories, message, **screen capture**, up to 4 image attachments, `⌘/Ctrl + /` shortcut)
- Multi-tenant accounts via **Better Auth** (sign up / login)
- Per-project widgets: own `widget_key`, colors, categories, and placement
- Site registration with domain + approval / block controls
- Shared inbox: status, priority, replies, attachments
- **Widget agents** — invite teammates into a project inbox without handing over ownership
- Email notifications (Resend) and optional web push (VAPID)
- Attachments on Cloudflare R2 (local disk fallback)
- i18n panel (`en` / `tr`) via next-intl

## Stack

Next.js 15 (App Router) · React 19 · PostgreSQL + Drizzle · Better Auth · Cloudflare R2 · Resend · web-push · Tailwind v4 · esbuild (widget)

> **Node:** 20–22 (see `.nvmrc`).  
> **Database:** PostgreSQL 16. Schema lives under `drizzle/`.

## Local development

```bash
nvm use            # node 22
npm install

# Copy or create .env (see Environment variables below)
# Minimum for local: DATABASE_URL, BETTER_AUTH_SECRET, PUBLIC_BASE_URL

# PostgreSQL (Docker example):
docker run -d --name rivesio-pg \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=rivesio \
  -p 5432:5432 postgres:16-alpine

npm run db:push    # sync schema (dev)
# or: npm run db:generate && npm run db:migrate

npm run dev        # http://localhost:3000
# production-style:
# npm run build && npm start
```

Create a project/widget from the panel, copy its widget key, then try `demo.html` (set `WIDGET_KEY` and the server URL). New sites start as **pending** until you approve them under **Sites**.

### Useful scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Build widget (esbuild) then Next |
| `npm start` | Production server via `server.js` |
| `npm run build:widget` | Widget bundle only → `public/widget.bundle.js` |
| `npm run icons` | Derive `icon-192.png` / favicon from `public/icon-512.png` |
| `npm run db:push` / `db:migrate` / `db:studio` | Drizzle schema tools |

## Embed the widget

```html
<script>
  window.RivesioFeedback = {
    domain: location.host,
    // optional: user: "signed-in-user-id"
  };
</script>
<script src="https://YOUR_HOST/api/widget/YOUR_WIDGET_KEY.js" async></script>
```

## Environment variables

| Variable | Description |
|---|---|
| `BETTER_AUTH_SECRET` | Auth secret (required in production) |
| `PUBLIC_BASE_URL` | Public origin, no trailing slash (e.g. `http://localhost:3000`) |
| `DATABASE_URL` | Postgres URL (`postgres://user:pass@host:5432/rivesio`) |
| `UPLOAD_DIR` | Local attachment fallback dir (unused when R2 is configured) |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET` | Cloudflare R2 for attachments |
| `R2_ENDPOINT` | Optional custom S3 endpoint |
| `AUTO_APPROVE_SITES` | Default auto-approve for new sites (`1` / `0`) |
| `RESEND_API_KEY` | Resend API key; if empty, emails are logged only |
| `EMAIL_FROM` | From address (password reset, reply notifications) |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT` | Web push (optional) |

## Deploy (Node host / Hostinger)

This is a **Node.js server app**, not a static site. Use a Node runtime that can run `server.js` (Hostinger: **hPanel → Advanced → Node.js** / Phusion Passenger).

1. Create a Node.js app (Node 20 or 22).
2. **Application root:** repo directory  
   **Startup file:** `server.js`  
   Do **not** set `PORT` yourself on Passenger — it assigns the port.
3. Install and build:

   ```bash
   npm install --include=dev
   npm run build
   npm run db:migrate
   ```

4. Set environment variables from the table above. Set `PUBLIC_BASE_URL` to your domain.
5. Restart the app after each deploy (`npm install` if deps changed, then `npm run build`, then restart).

Burst rate limits are in-memory (single instance). Daily submission limits are stored in the database.

## API (overview)

| Endpoint | Description |
|---|---|
| `GET /api/widget/<key>.js` | Project-configured embeddable widget |
| `POST /api/v1/register` | Site register / refresh; returns `enabled` + `status` |
| `POST /api/v1/feedback` | Create feedback (key + approval required) |
| `POST /api/v1/feedback/<id>/attachment` | Upload screenshot/image (max 4, `image/*`) |
| `/api/auth/*` | Better Auth (login, signup, session) |
| `/api/admin/*` | Authenticated panel APIs (projects, sites, feedbacks, agents, …) |
| `/api/v1/conversation/*` | End-user conversation / reply flows |

Panel routes (locale-prefixed): `/`, `/feedbacks`, `/sites`, `/projects`, `/settings`, `/login`, `/signup`.

## Security notes

- Public endpoints allow CORS; access is gated by `widget_key`, domain, and site approval — not by origin alone.
- Attachments are stored outside the app root (or on R2) and served to signed-in users via admin APIs.
- Login and public submit routes are rate-limited by IP.
