# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build (must pass before deploying)
npm run lint     # ESLint via next lint
npm run start    # run the production build locally
make docker-build  # build Docker image
make k8s-deploy    # apply k8s manifests
```

No test suite is configured.

## Architecture

**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · SQLite (better-sqlite3) · Docker + Kubernetes

### Data flow

The DB layer is entirely synchronous (`better-sqlite3`). All queries run inside Next.js API route handlers (server-side only — never imported in client components). The singleton is in `src/lib/db.ts`, which auto-runs schema migrations on first call to `getDb()`.

Player data has two layers:
- `src/lib/players.ts` — static TypeScript config (names, nicknames, colors, house words). Source of truth for display. Import `PLAYERS`, `PLAYER_BY_ID`, or `PLAYER_BY_SLUG`.
- `players` table in SQLite — exists only as a FK target. IDs are stable: Alay=1, Komal=2, Hiren=3, Ishani=4.

### Soft-delete pattern

Games are never hard-deleted. `DELETE /api/games/[id]` sets `deleted_at` + `deleted_by`. All active-game queries filter `WHERE deleted_at IS NULL`. The Admin Vault (`/admin`) fetches deleted games via `GET /api/admin/trash` and restores via `POST /api/games/[id]/restore`. Both require `Authorization: Bearer <MASTER_PASSWORD>`.

### Stats computation

`src/lib/queries/stats.ts` → `getLeaderboardStats()` fetches all participant rows for non-deleted games in one SQL query, then computes win rates, streaks, H2H, and funny stats in TypeScript. Streak logic walks results pre-sorted newest-first. Home page calls this directly as a server component (`export const dynamic = 'force-dynamic'`).

### Auth

`MASTER_PASSWORD` env var, verified in `src/lib/auth.ts` via simple string equality (server-side only). In K8s it comes from a Secret named `dominion-secrets`.

### Routing

| Route | Type | Notes |
|---|---|---|
| `/` | Server component | Calls `getLeaderboardStats()` directly |
| `/add-game` | Client component | POSTs to `/api/games` |
| `/history` | Server shell + client `HistoryContent` | `useSearchParams` requires the Suspense wrapper in `page.tsx` |
| `/player/[id]` | Server component | Param is player slug (`alay`, `komal`, `hiren`, `ishani`) |
| `/admin` | Server shell + client `PasswordGate` | All vault logic is client-side fetch with Bearer token |

### Visual theme

Colors follow the actual Dominion card game palette — defined as CSS variables in `globals.css` and mirrored in `tailwind.config.ts`:

| Token | Hex | Use |
|---|---|---|
| `--dominion-navy` / `navy-800` | `#1E2D5C` | Navbar bg, headings, subtitle text |
| `--dominion-gold` / `gold-400` | `#C9A227` | Accents, dividers, card borders |
| `--dominion-brown` / `brown-800` | `#3B1F0A` | Body side borders, card frames |
| `--parchment` / `parchment-100` | `#EFE0BB` | Page background, card backgrounds |
| `--forest` / `forest-700` | `#2A5C2A` | Win indicators, victory-card accents |
| `crimson-700` | `#8B1A1A` | Loss indicators, delete actions |

Three card CSS classes: `card-parchment` (standard), `card-parchment-gold` (highlighted), `card-parchment-green` (victory).

### Static assets

- `public/logo.png` — hero logo image; rendered with `mix-blend-multiply` so white pixels become transparent against the parchment background. Always use `unoptimized` prop on the Next.js `<Image>` to bypass optimization pipeline (which breaks transparency).
- `public/vp-icon.png` — shield/VP icon; used in navbar and set as the browser favicon via `metadata.icons` in `layout.tsx`.

### Environment

```
MASTER_PASSWORD=...               # required; guards delete/restore/trash endpoints
DATABASE_URL=file:./dominion.db   # local default; prod uses file:/data/dominion.db
```

### Deployment

Push to `main` → GitHub Actions builds Docker image → pushes to `ghcr.io/alaydeliwala/dominion-leaderboard:latest` → `kubectl rollout restart deployment/dominion-leaderboard`. K8s PVC mounts at `/data` for the SQLite file. First deploy requires:
```bash
kubectl create secret generic dominion-secrets --from-literal=MASTER_PASSWORD=yourpassword
```
