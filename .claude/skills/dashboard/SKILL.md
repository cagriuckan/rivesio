---
name: dashboard
description: Update DASHBOARD.md at the end of every work session in this repo — progress, remaining work, decisions. Trigger whenever a task is completed, a session is wrapping up, or the user asks to update the dashboard/pano.
---

# Dashboard Update

Keep `DASHBOARD.md` at the repo root current. It is the single source of truth for session-to-session continuity.

## When
- At the end of every session, or after completing any significant piece of work.
- Do it proactively; the user should not have to ask.

## How
1. Read `DASHBOARD.md`.
2. Update the "Son güncelleme" date (today, absolute date).
3. **Mevcut Durum**: current branch, last commit, notable uncommitted work.
4. **Kalanlar**: check off finished items, add newly discovered TODOs.
5. **Alınan Kararlar**: append any decision made this session with a date prefix (`2026-07: ...`). Never delete old decisions.
6. Keep it short — prune stale detail instead of appending forever. Write in Turkish (matches the file).

## Don't
- Don't duplicate what git history already shows; record the *why* and the *next step*, not diffs.
- Don't move architecture docs here — those live in Claude memory and code.
