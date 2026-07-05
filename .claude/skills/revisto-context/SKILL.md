---
name: revisto-context
description: Project map and conventions for the Revisto codebase. Load at the start of any coding task in this repo instead of re-exploring from scratch — covers stack, directory layout, DB conventions, and gotchas.
---

# Revisto Context

Centralized feedback widget server + admin panel.

## Stack
- Next.js 15 App Router under `src/app/[locale]/` (next-intl, messages in `messages/`), React 19, Tailwind v4.
- Postgres (local port **5433**) + Drizzle. Schema in `src/lib/` / `drizzle/`. Conventions: snake_case Row mapping, timestamps as **epoch-ms bigint**.
- Better Auth (multi-tenant), Resend email (`src/lib/email.ts`), web-push, S3 uploads.
- Embeddable widget: source in `widget/`, built via `npm run build:widget` (runs before `next build`). Production serves through custom `server.js`.

## Layout
- `src/components/` — feature folders: `agents`, `auth`, `dashboard`, `feedbacks`, `sites`, `projects`, `settings`, `layout` (Header/Sidebar), `ui` (Avatar, Dropdown, ThemedLogo…).
- App routes: `feedbacks`, `sites`, `projects`, `settings`, `login`, `signup`, `agent-invite`.
- Branding: use `src/components/ui/ThemedLogo.tsx` with `public/logo-light.png` / `logo-dark.png` — don't hardcode logo `<img>`s.
- Icons: single source of truth is `public/icon.png` (512px). `icon-192.png` is derived via `npm run icons` (sips). No favicon.ico / apple-icon / icon-512 — metadata (`[locale]/layout.tsx`) and `manifest.ts` all point at `/icon.png` + `/icon-192.png`. To change the icon: replace `icon.png`, run `npm run icons`.

## Gotchas
- Node 20–22 only (see `engines`).
- zsh: quote globs like `src/app/[locale]` in shell commands.
- Update `DASHBOARD.md` at session end (see the `dashboard` skill).

## Keeping this current
When you learn something non-obvious about this repo (a convention, a trap, a build quirk), add it here instead of leaving it in conversation.
