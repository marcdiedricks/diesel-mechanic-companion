# Diesel Mechanic Companion™

An installable multilingual field companion for South African diesel mechanic learners, with safety gates, workshop calculators, diagnostic reference matrices, and Red Seal curriculum resources.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- No database or external integrations are required; the companion is intentionally local-first and works offline after its first load.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/diesel-mechanic-companion/src/App.tsx` — product UI, multilingual copy, calculations, diagnostic matrices, and curriculum modal.
- `artifacts/diesel-mechanic-companion/src/index.css` — workshop theme tokens, typography, responsive layout, and interaction states.
- `artifacts/diesel-mechanic-companion/public/manifest.json` — standalone home-screen installation metadata.
- `artifacts/diesel-mechanic-companion/public/icon.svg` — amber turbocharger and inline-injector app mark.
- `artifacts/diesel-mechanic-companion/public/sw.js` — cache-first offline app shell.

## Architecture decisions

- Keep the first release local-first: all calculations and reference content are deterministic and available without a network connection.
- Preserve the English safety gate verbatim and expose localized guidance through a persistent language selector.
- Use exact YouTube search URLs rather than embedding third-party content, keeping the companion lightweight and respectful of resource owners.

## Product

- Safety-first welcome and statutory controls for Common Rail injection, tilted cabs, heavy lifting, air discharge, wet tanks, and maxi-brakes.
- Liner protrusion/shimming calculator with live D − F + S evaluation against the 0.08–0.15 mm target.
- Air-brake threshold and Bosch/Denso CRD return-flow reference matrices.
- Searchable English, Afrikaans, isiXhosa, and isiZulu trade-term reference plus 10-unit curriculum resource modal.

## User preferences

The user specified a high-contrast slate workshop theme with diesel yellow/amber accents and compact field-oriented information density.

## Gotchas

- The service worker uses a versioned shell cache; bump `CACHE_NAME` when changing the static app shell or installable assets.
- The app is rooted at `/`; keep manifest `start_url`, scope, and service-worker shell paths aligned with the artifact preview path.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
