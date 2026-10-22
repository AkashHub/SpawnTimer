# Story index

98 stories (92 for agents, 6 for a human). Generated from the dependency graph; **status lives in each story's front matter**, not here.

Use `pnpm stories:next` (or `node scripts/stories.mjs next`) to see what is ready right now. See `docs/WORKFLOW.md` and `prompts/`.

## Epics

| Prefix | Epic | Stories |
|---|---|---|
| `H` | Human tasks (things agents cannot do) | 6 |
| `INF` | Platform and dev environment | 12 |
| `LIB` | Shared domain logic (packages/shared) | 15 |
| `DB` | Data store (D1 schema, migrations, repositories) | 10 |
| `API` | Backend API (Cloudflare Worker, Hono) | 12 |
| `REC` | Spawn recording (web) | 11 |
| `SYN` | Sync finder (web) | 6 |
| `OVR` | Overview and visualization (web) | 7 |
| `ADM` | Epochs and admin | 6 |
| `SEC` | Security and abuse prevention | 8 |
| `QA` | Quality and observability | 3 |
| `LAB` | Period lab (assumption validation) | 2 |

Priorities: 69 must, 23 should, 6 could. Verification types: api 25, e2e 3, human 6, infra 14, ui 28, unit 22.

## How waves work

A story's wave is its depth in the dependency graph: wave 0 has no dependencies, wave N depends on something in wave N-1. **Stories in the same wave never depend on each other and are designed not to edit the same files**, so they can be given to agents in parallel. (A story is startable as soon as its own dependencies are done; you do not have to wait for the whole previous wave.)

## Where to start

1. Wave 0-3 (`INF-001` onward) builds the toolchain. Do these first, in order of `pnpm stories:next`.
2. Once `LIB-*` and `DB-*` stories are unblocked they are highly parallel: shared math, migrations and repositories are independent of each other.
3. To check the design's core assumptions early, prioritize `REC-001..003`, `REC-007`, `LAB-001`, `LAB-002`, then human task `H-006` (about 15 minutes in game).
4. Human tasks (`H-*`) are listed by `pnpm stories:next` when they unblock work; do `H-001` and `H-002` before the first deploy.

## Stories by wave

### Wave 0

| ID | Title | Priority | Verify | Depends on |
|---|---|---|---|---|
| [H-005](H/H-005-check-the-maplelegends-rules-before.md) | Check the MapleLegends rules before publicizing | could | human | - |
| [INF-001](INF/INF-001-monorepo-scaffold-with-pnpm-workspaces.md) | Monorepo scaffold with pnpm workspaces | must | infra | - |

### Wave 1

| ID | Title | Priority | Verify | Depends on |
|---|---|---|---|---|
| [INF-002](INF/INF-002-add-eslint-and-prettier.md) | Add ESLint and Prettier | must | infra | INF-001 |
| [INF-003](INF/INF-003-vitest-setup-for-the-shared-package.md) | Vitest setup for the shared package | must | infra | INF-001 |
| [INF-005](INF/INF-005-cloudflare-worker-scaffold-with-health.md) | Cloudflare Worker scaffold with health endpoint | must | api | INF-001 |
| [INF-007](INF/INF-007-web-app-scaffold-with-routes-and-layout.md) | Web app scaffold with routes and layout | must | ui | INF-001 |

### Wave 2

| ID | Title | Priority | Verify | Depends on |
|---|---|---|---|---|
| [H-001](H/H-001-create-cloudflare-account-d1-database.md) | Create Cloudflare account, D1 database and API token | must | human | INF-005 |
| [INF-004](INF/INF-004-github-actions-ci-workflow.md) | GitHub Actions CI workflow | must | infra | INF-002, INF-003 |
| [INF-006](INF/INF-006-api-test-harness-with-local-d1.md) | API test harness with local D1 | must | unit | INF-005, INF-003 |
| [INF-008](INF/INF-008-web-test-harness-vitest-react-testing.md) | Web test harness (Vitest + React Testing Library) | must | ui | INF-007, INF-003 |
| [LIB-001](LIB/LIB-001-constants-and-phaseof.md) | Constants and phaseOf | must | unit | INF-003 |

### Wave 3

| ID | Title | Priority | Verify | Depends on |
|---|---|---|---|---|
| [DB-001](DB/DB-001-migration-tooling-and-maps-table.md) | Migration tooling and maps table | must | infra | INF-006 |
| [H-002](H/H-002-configure-github-repository-branch.md) | Configure GitHub repository, branch protection and secrets | must | human | INF-004 |
| [INF-009](INF/INF-009-playwright-end-to-end-harness.md) | Playwright end-to-end harness | should | e2e | INF-007, INF-004 |
| [LIB-002](LIB/LIB-002-circular-distance-and-mean.md) | Circular distance and mean | must | unit | LIB-001 |
| [LIB-006](LIB/LIB-006-confidence-classification.md) | Confidence classification | must | unit | LIB-001 |
| [LIB-009](LIB/LIB-009-request-schemas-zod.md) | Request schemas (Zod) | must | unit | LIB-001, INF-003 |
| [LIB-011](LIB/LIB-011-deterministic-test-data-generator.md) | Deterministic test-data generator | should | unit | LIB-001 |
| [LIB-012](LIB/LIB-012-server-clock-anchor-math.md) | Server clock anchor math | must | unit | LIB-001 |
| [LIB-013](LIB/LIB-013-display-formatting-helpers.md) | Display formatting helpers | should | unit | LIB-001 |
| [LIB-014](LIB/LIB-014-period-and-drift-fit.md) | Period and drift fit | should | unit | LIB-001 |
| [OVR-007](OVR/OVR-007-about-page-content.md) | About page content | should | ui | INF-007, INF-008, LIB-001 |
| [REC-005](REC/REC-005-anonymous-client-id-utility.md) | Anonymous client id utility | must | unit | INF-008 |
| [REC-006](REC/REC-006-usetapsession-hook.md) | useTapSession hook | must | ui | INF-008, LIB-001 |
| [SYN-002](SYN/SYN-002-tolerancecontrol-component.md) | ToleranceControl component | must | ui | INF-008, LIB-001 |
| [SYN-003](SYN/SYN-003-url-backed-sync-parameters-hook.md) | URL-backed sync parameters hook | must | ui | INF-008, LIB-001 |

### Wave 4

| ID | Title | Priority | Verify | Depends on |
|---|---|---|---|---|
| [DB-002](DB/DB-002-epochs-table-with-initial-epoch.md) | Epochs table with initial epoch | must | infra | DB-001 |
| [DB-005](DB/DB-005-map-seed-data-and-idempotent-seed-script.md) | Map seed data and idempotent seed script | must | infra | DB-001 |
| [DB-006](DB/DB-006-repository-maps.md) | Repository: maps | must | unit | DB-001 |
| [LIB-003](LIB/LIB-003-circular-median.md) | Circular median | must | unit | LIB-002 |
| [LIB-007](LIB/LIB-007-sync-match-search.md) | Sync match search | must | unit | LIB-002, LIB-006 |
| [LIB-008](LIB/LIB-008-sync-group-clustering.md) | Sync group clustering | must | unit | LIB-002 |
| [LIB-010](LIB/LIB-010-response-schemas-zod.md) | Response schemas (Zod) | must | unit | LIB-009, LIB-006 |
| [OVR-002](OVR/OVR-002-spawnring-svg-component.md) | SpawnRing SVG component | must | ui | INF-008, LIB-006, LIB-013 |
| [OVR-004](OVR/OVR-004-heatmap-component-and-phasetocolor.md) | Heatmap component and phaseToColor | must | ui | INF-008, LIB-006, LIB-013 |
| [REC-007](REC/REC-007-tapbutton-component-with-space-hotkey.md) | TapButton component with Space hotkey | must | ui | INF-008, LIB-013 |

### Wave 5

| ID | Title | Priority | Verify | Depends on |
|---|---|---|---|---|
| [API-001](API/API-001-config-parsing-and-route-skeleton.md) | Config parsing and route skeleton | must | api | INF-006, LIB-010 |
| [DB-003](DB/DB-003-observations-table-and-index.md) | Observations table and index | must | infra | DB-002 |
| [DB-007](DB/DB-007-repository-epochs.md) | Repository: epochs | must | unit | DB-002 |
| [INF-010](INF/INF-010-single-worker-deployment-config-and.md) | Single-Worker deployment config and deploy workflow | must | infra | INF-005, INF-007, H-001, H-002, DB-005 |
| [LIB-004](LIB/LIB-004-outlier-trimming.md) | Outlier trimming | must | unit | LIB-003, LIB-001 |
| [OVR-003](OVR/OVR-003-spawnring-interactions-tooltip-highlight.md) | SpawnRing interactions: tooltip, highlight, select | should | ui | OVR-002 |
| [OVR-005](OVR/OVR-005-syncgroupslist-component.md) | SyncGroupsList component | must | ui | INF-008, LIB-010, LIB-013 |
| [REC-001](REC/REC-001-web-api-client-core-and-time-sampler.md) | Web API client core and time sampler | must | ui | INF-008, LIB-010, LIB-012 |
| [REC-004](REC/REC-004-map-and-channel-selector-with-remembered.md) | Map and channel selector with remembered choice | must | ui | INF-008, LIB-010 |
| [REC-009](REC/REC-009-estimatecard-component.md) | EstimateCard component | must | ui | INF-008, LIB-010, LIB-013 |
| [SYN-004](SYN/SYN-004-matchestable-component.md) | MatchesTable component | must | ui | INF-008, LIB-010, LIB-013 |

### Wave 6

| ID | Title | Priority | Verify | Depends on |
|---|---|---|---|---|
| [API-002](API/API-002-error-handling-and-404.md) | Error handling and 404 | must | api | API-001 |
| [DB-004](DB/DB-004-phase-estimates-table.md) | Phase estimates table | must | infra | DB-003 |
| [DB-008](DB/DB-008-repository-observations.md) | Repository: observations | must | unit | DB-003, DB-006, DB-007 |
| [H-003](H/H-003-provide-the-real-map-list-and-channel.md) | Provide the real map list and channel count | must | human | DB-005, API-001 |
| [INF-012](INF/INF-012-record-verified-commands-and-versions-in.md) | Record verified commands and versions in AGENTS.md | should | infra | INF-009, INF-010 |
| [LIB-005](LIB/LIB-005-phase-estimate-from-observations.md) | Phase estimate from observations | must | unit | LIB-004, LIB-002 |
| [OVR-001](OVR/OVR-001-overview-client-and-hook.md) | Overview client and hook | must | ui | REC-001, LIB-010 |
| [REC-002](REC/REC-002-maps-client-and-usemaps-hook.md) | Maps client and useMaps hook | must | ui | REC-001 |
| [REC-003](REC/REC-003-useserverclock-hook.md) | useServerClock hook | must | ui | REC-001, LIB-012 |
| [REC-008](REC/REC-008-submit-client-hook-and-error-messages.md) | Submit client, hook and error messages | must | ui | REC-001, LIB-009, LIB-010 |
| [SEC-001](SEC/SEC-001-index-for-per-client-rate-limiting.md) | Index for per-client rate limiting | should | infra | DB-003 |
| [SYN-001](SYN/SYN-001-sync-client-and-hook.md) | Sync client and hook | must | ui | REC-001, LIB-010 |

### Wave 7

| ID | Title | Priority | Verify | Depends on |
|---|---|---|---|---|
| [ADM-001](ADM/ADM-001-admin-token-middleware.md) | Admin token middleware | must | api | API-002 |
| [ADM-003](ADM/ADM-003-get-api-epoch.md) | GET /api/epoch | must | api | API-002, DB-007 |
| [API-003](API/API-003-request-validation-helpers.md) | Request validation helpers | must | api | API-002, LIB-009 |
| [API-004](API/API-004-get-api-time.md) | GET /api/time | must | api | API-002 |
| [API-005](API/API-005-get-api-maps.md) | GET /api/maps | must | api | API-002, DB-006, API-001 |
| [DB-009](DB/DB-009-repository-phase-estimates.md) | Repository: phase estimates | must | unit | DB-004, DB-006 |
| [DB-010](DB/DB-010-fake-data-seeder-for-local-development.md) | Fake-data seeder for local development | should | infra | LIB-005, LIB-011, DB-005, DB-004, DB-007 |
| [INF-011](INF/INF-011-weekly-d1-backup-workflow.md) | Weekly D1 backup workflow | could | infra | H-001, H-002, DB-004 |
| [LAB-001](LAB/LAB-001-period-lab-page-tap-capture.md) | Period Lab page: tap capture | must | ui | REC-003, REC-007, INF-008 |
| [LIB-015](LIB/LIB-015-reset-suspicion-detector.md) | Reset suspicion detector | could | unit | LIB-005 |
| [OVR-006](OVR/OVR-006-overview-page-assembly.md) | Overview page assembly | must | ui | OVR-001, OVR-003, OVR-004, OVR-005, SYN-002, REC-002, INF-009 |
| [QA-001](QA/QA-001-request-logging-middleware.md) | Request logging middleware | should | api | API-002 |
| [REC-010](REC/REC-010-record-page-assembly.md) | Record page assembly | must | ui | REC-002, REC-003, REC-004, REC-005, REC-006, REC-007, REC-008, REC-009, INF-009 |
| [SEC-005](SEC/SEC-005-security-headers-and-no-cors.md) | Security headers and no CORS | should | api | API-002 |
| [SYN-005](SYN/SYN-005-sync-page-assembly.md) | Sync page assembly | must | ui | SYN-001, SYN-002, SYN-003, SYN-004, REC-002, REC-004, REC-009, INF-009 |

### Wave 8

| ID | Title | Priority | Verify | Depends on |
|---|---|---|---|---|
| [ADM-002](ADM/ADM-002-post-api-admin-epoch.md) | POST /api/admin/epoch | must | api | ADM-001, DB-007 |
| [API-006](API/API-006-post-api-observations-validate-and.md) | POST /api/observations: validate and persist | must | api | API-003, API-001, DB-008, LIB-001 |
| [API-007](API/API-007-estimate-recompute-service.md) | Estimate recompute service | must | api | DB-008, DB-009, LIB-005, LIB-006, LIB-010 |
| [H-004](H/H-004-set-production-secrets.md) | Set production secrets | should | human | ADM-001, INF-010 |
| [LAB-002](LAB/LAB-002-period-lab-page-results-panel.md) | Period Lab page: results panel | must | ui | LAB-001, LIB-014 |
| [REC-011](REC/REC-011-mobile-layout-and-accessibility-for-the.md) | Mobile layout and accessibility for the record page | should | e2e | REC-010 |

### Wave 9

| ID | Title | Priority | Verify | Depends on |
|---|---|---|---|---|
| [ADM-005](ADM/ADM-005-web-admin-page-to-start-a-new-epoch.md) | Web: admin page to start a new epoch | should | ui | ADM-002, INF-008 |
| [ADM-006](ADM/ADM-006-admin-endpoint-listing-suspected-resets.md) | Admin endpoint listing suspected resets | could | api | ADM-002, LIB-015, DB-008, DB-009 |
| [API-008](API/API-008-return-the-estimate-from-post-api.md) | Return the estimate from POST /api/observations | must | api | API-006, API-007 |
| [API-009](API/API-009-get-api-phases.md) | GET /api/phases | must | api | API-003, DB-009, DB-007, DB-006, API-007 |
| [API-010](API/API-010-get-api-sync.md) | GET /api/sync | must | api | API-003, DB-009, DB-007, DB-006, API-007, LIB-007, API-001 |
| [API-011](API/API-011-get-api-overview.md) | GET /api/overview | must | api | API-003, DB-009, DB-007, API-007, LIB-008 |
| [H-006](H/H-006-run-the-spawn-period-validation.md) | Run the spawn-period validation experiment | must | human | LAB-002 |
| [SYN-006](SYN/SYN-006-record-page-find-matches-link.md) | Record page: "Find matches" link | should | ui | REC-011, SYN-003 |

### Wave 10

| ID | Title | Priority | Verify | Depends on |
|---|---|---|---|---|
| [ADM-004](ADM/ADM-004-web-epoch-banner-component.md) | Web: epoch banner component | should | ui | ADM-003, SYN-006, SYN-005, OVR-006, INF-008 |
| [API-012](API/API-012-edge-cache-for-read-endpoints.md) | Edge cache for read endpoints | should | api | API-005, API-009, API-010, API-011 |
| [QA-002](QA/QA-002-simulation-test-end-to-end-sync-accuracy.md) | Simulation test: end-to-end sync accuracy | should | api | API-010, API-008, LIB-011 |
| [QA-003](QA/QA-003-full-stack-e2e-record-flow-against-the.md) | Full-stack e2e: record flow against the real API | should | e2e | REC-010, API-008, DB-005, INF-009 |
| [SEC-002](SEC/SEC-002-per-client-submission-rate-limit.md) | Per-client submission rate limit | should | api | SEC-001, API-008 |
| [SEC-007](SEC/SEC-007-sql-injection-and-hostile-input-tests.md) | SQL injection and hostile input tests | should | api | API-008, API-010, API-009 |

### Wave 11

| ID | Title | Priority | Verify | Depends on |
|---|---|---|---|---|
| [SEC-006](SEC/SEC-006-request-body-size-limit.md) | Request body size limit | should | api | SEC-002 |
| [SEC-008](SEC/SEC-008-privacy-audit-and-privacy-md.md) | Privacy audit and PRIVACY.md | should | unit | DB-004, SEC-002 |

### Wave 12

| ID | Title | Priority | Verify | Depends on |
|---|---|---|---|---|
| [SEC-003](SEC/SEC-003-per-ip-rate-limit-best-effort.md) | Per-IP rate limit (best effort) | could | api | SEC-006, INF-010 |

### Wave 13

| ID | Title | Priority | Verify | Depends on |
|---|---|---|---|---|
| [SEC-004](SEC/SEC-004-optional-turnstile-verification.md) | Optional Turnstile verification | could | api | SEC-003 |
