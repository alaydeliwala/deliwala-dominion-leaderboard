# Dominion Deliwalas

> *Family. Cards. Absolute Chaos. Est. When Dad First Lost.*

Family leaderboard for tracking Dominion card game results. Medieval parchment aesthetic, Dominion color palette, zero mercy.

## Players

| Name | Title | House Words |
|------|-------|-------------|
| Alay Deliwala | The Algorithm | "I had the optimal engine." |
| Komal Deliwala | Mom-inion | "The hand that rocks the Duchy." |
| Hiren Deliwala | The Patriarch | "I was just letting you win." |
| Ishani Deliwala | Wild Card | "Chaos is a ladder." |

## Features

- **Leaderboard** — win rate rankings, head-to-head grid, win/loss streaks
- **Royal Gazette** — rotating banner of auto-generated trash talk (droughts, blowouts, dominant duos)
- **Battle Recorder** — log scores, kingdom cards, and post-game notes
- **Chronicles** — full filterable history; expand any game for details
- **The Vault** — password-gated page for viewing and restoring soft-deleted games

## Setup

```bash
npm install
cp .env.example .env.local   # set MASTER_PASSWORD
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MASTER_PASSWORD` | Guards all delete and restore actions |
| `DATABASE_URL` | SQLite path — defaults to `file:./dominion.db` locally |

## Deployment

Push to `main` → GitHub Actions → GHCR → Kubernetes rollout restart.

First deploy only:
```bash
kubectl create secret generic dominion-secrets --from-literal=MASTER_PASSWORD=yourpassword
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/deployment.yaml
```

## Stack

Next.js 14 · TypeScript · Tailwind CSS · SQLite (better-sqlite3) · Docker · Kubernetes
