# ESTARA Architecture

ESTARA is a multi-tenant real estate platform organized as a pnpm/Turborepo monorepo.

## Runtime

`apps/web` provides Next.js 15, TypeScript, Tailwind, 3D scenes, localized UI and responsive views.

`apps/api` provides NestJS modules for authentication, property discovery, CRM leads, appointments, analytics, notifications, audit, storage and integrations.

`apps/worker` owns asynchronous jobs such as media processing, reindexing, saved-search matching and appointment reminders.

## Data

PostgreSQL is the system of record. PostGIS supports geographic operations. Redis supports queues, rate limiting and short-lived coordination. OpenSearch is an adapter target for hybrid/faceted search. S3-compatible object storage keeps media bytes while PostgreSQL stores metadata and keys.

## Tenant model

Agency ownership is represented by `agencyId`. Application services scope records by agency and APIs accept `x-agency-id` until a production JWT guard injects the tenant from verified claims. Cross-tenant operations must be denied before repository calls.

## Scheduling

Working hours are stored per agency/day. Appointment creation checks agency opening hours and overlapping active appointments. Availability returns actual free slots computed from persisted rules.

## UI

English and Chinese use LTR. Persian uses RTL. Themes include system, light, dark, red and blue. Motion-sensitive users get reduced animation behavior through the platform media query.
