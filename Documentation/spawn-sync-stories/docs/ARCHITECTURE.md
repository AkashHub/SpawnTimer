# Architecture (condensed reference for agents)

The full architecture document lives outside the repo; this is the part agents need. If this file and a story disagree, **the story wins**; report the discrepancy.

## 1. Concept

Monsters respawn every 10 000 ms. Each (map, channel) "combination" has a fixed offset ("phase") inside that cycle. Players tap a button when they see a spawn; we turn each tap into a phase, aggregate per combination, then find combinations whose phases are within a tolerance (default 300 ms) of each other.

- `PERIOD_MS = 10000`
- `phase = serverTimestampMs mod 10000` (integer 0..9999)
- Phases live on a **circle**: 9900 and 100 are 200 ms apart. Always use circular math.
- Tolerance default 300 ms (min 50, max 1000).
- An **epoch** is a period during which phases are assumed stable (e.g. between server restarts). Only the current epoch (highest id) is queried.

## 2. System

```
Browser (React SPA)  --/api/*-->  Cloudflare Worker (Hono)  -->  D1 (SQLite)
        ^                               |
        +------ static assets ----------+   (same Worker serves the built SPA)
```

The browser syncs its clock to the server (`GET /api/time`, 5 samples, lowest round-trip wins) and sends tap timestamps in **server time**. The server recomputes the phase itself and never trusts a client-supplied phase.

## 3. Database (SQLite / D1)

```sql
CREATE TABLE maps (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, region TEXT);
CREATE TABLE epochs (id INTEGER PRIMARY KEY AUTOINCREMENT, started_at INTEGER NOT NULL, note TEXT);
CREATE TABLE observations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  map_id INTEGER NOT NULL REFERENCES maps(id),
  channel INTEGER NOT NULL CHECK (channel >= 1),
  server_ts_ms INTEGER NOT NULL,
  phase_ms INTEGER NOT NULL CHECK (phase_ms BETWEEN 0 AND 9999),
  client_id TEXT NOT NULL,
  epoch_id INTEGER NOT NULL REFERENCES epochs(id),
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_obs_combo ON observations (map_id, channel, epoch_id, created_at DESC);
CREATE TABLE phase_estimates (
  map_id INTEGER NOT NULL, channel INTEGER NOT NULL, epoch_id INTEGER NOT NULL,
  mean_phase_ms INTEGER NOT NULL, r REAL NOT NULL, spread_ms INTEGER NOT NULL,
  n INTEGER NOT NULL, updated_at INTEGER NOT NULL,
  PRIMARY KEY (map_id, channel, epoch_id)
);
```

## 4. Algorithms (canonical rules)

- **circMean(phases)**: unit-vector average. `r` = resultant length (0..1). `spread = sqrt(-2 ln r) * (P / 2pi)` (r=1 gives 0; r near 0 gives 5000).
- **circMedian(phases)**: the input value minimizing the sum of circular distances to all inputs; ties go to the smallest value.
- **trimOutliers**: drop values more than `OUTLIER_MS` (500) from the circular median.
- **Estimate update**: read the newest `WINDOW` (50) phases of a combination in the current epoch, trim outliers, circMean, upsert into `phase_estimates`.
- **Confidence**: `low` if n < 5 or spread > 250; `high` if n >= 10 and spread < 120; otherwise `medium`.
- **Sync match**: other combinations with `|diff(candidate, reference)| <= tolMs` (inclusive), sorted by absolute distance, then confidence (high first), then n (desc), then mapId, then channel.
- **Sync groups**: sort by phase, chain neighbours whose gap <= tolMs, merge across the 9999/0 wrap, keep groups with >= 2 members.

## 5. API contract summary

All schemas are defined once in `packages/shared/src/schemas/` (LIB-009, LIB-010); this table is only a map.

| Endpoint | Purpose | Success body |
|---|---|---|
| `GET /api/health` | Liveness | `{ ok: true }` |
| `GET /api/time` | Clock sync | `{ serverNow }` |
| `GET /api/maps` | Map list | `{ maps: [{id,name,region}], channelCount }` |
| `POST /api/observations` | Record taps | `{ accepted, estimate }` |
| `GET /api/phases?mapId=` | Estimates for one map | `{ epochId, mapId, estimates[] }` |
| `GET /api/sync?mapId=&channel=&tol=` | Matches for a reference | `{ epochId, tolMs, reference, matches[] }` |
| `GET /api/overview?tol=` | All estimates + groups | `{ epochId, tolMs, estimates[], groups[] }` |
| `GET /api/epoch` | Current epoch | `{ id, startedAt, note }` |
| `POST /api/admin/epoch` | Start new epoch (admin) | `{ id, startedAt, note }` |

`EstimateDto = { mapId, channel, epochId, meanPhaseMs, r, spreadMs, n, confidence, updatedAt }`.

## 6. Configuration

| Variable | Where | Meaning |
|---|---|---|
| `MAX_CHANNEL` | `wrangler.toml` `[vars]` | Number of channels (default 20, confirm with the real server) |
| `CACHE_ENABLED` | `[vars]` / `--var` | `"true"` enables edge caching of read endpoints; off in local dev and tests |
| `ADMIN_TOKEN` | secret / `.dev.vars` | Bearer token for admin endpoints |
| `TURNSTILE_SECRET` | secret / `.dev.vars` | Optional; enables Turnstile verification |
| `VITE_TURNSTILE_SITE_KEY` | build-time env | Optional; shows the Turnstile widget |
