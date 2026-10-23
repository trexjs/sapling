# REST API v1 — working implementation

All private project routes require `x-project-key`; environment can be specified by `x-environment` (`production` default). In local demo use `pi_demo_public` for ingestion/SDK and `pi_demo_admin` for management. `/v1/admin/organizations` and `/v1/admin/projects` are **unauthenticated development bootstrap routes**. Disable or protect them in any real environment.

| Method | Route | Credential | Body / behavior |
|---|---|---|---|
| GET | `/health` | none | Health check |
| POST | `/v1/admin/organizations` | none (dev-only) | `{name}` |
| POST | `/v1/admin/projects` | none (dev-only) | `{orgId,name}`; returns new credentials |
| GET | `/v1/admin/project` | admin | Project usage and environments |
| POST | `/v1/events/batch` | public | `{events:[{event,distinctId,properties?,eventId?,timestamp?}]}` |
| POST | `/v1/identify` | public | `{distinctId,anonymousId?,properties?}` |
| GET | `/v1/users/:id` | admin | User profile and event history |
| GET | `/v1/events` | admin | Recent event explorer |
| GET | `/v1/analytics/trends?days=14&event=` | admin | Daily event counts and distinct users |
| POST | `/v1/analytics/funnel` | admin | `{steps:['page_view','checkout']}` |
| GET | `/v1/analytics/retention?event=page_view` | admin | Daily cohorts, day-1/day-7 |
| GET | `/v1/flags` | admin | Flag definitions |
| POST | `/v1/flags` | admin | `{key,enabled,defaultValue,rules,rollout,variants?}` |
| POST | `/v1/flags/evaluate` | public | `{key,distinctId,attributes?}` |
| GET | `/v1/flags/config` | public | SDK remote flag config |
| GET/POST | `/v1/experiments` | admin | List/create `{name,flagKey,goalEvent}` |
| PATCH | `/v1/experiments/:id` | admin | `{status:'running'|'paused'|'completed'}` |
| POST | `/v1/experiments/:id/expose` | public | `{distinctId,variant}` |
| GET | `/v1/experiments/:id/results` | admin | Exposures and conversions (descriptive) |
| POST | `/v1/errors` | public | `{message,name?,stack?,release?,distinctId?,context?}` |
| GET | `/v1/issues` | admin | Grouped errors |
| GET | `/v1/issues/:id` | admin | Issue with occurrences |
| PATCH | `/v1/issues/:id` | admin | `{status:'open'|'resolved'|'ignored'}` |
| GET/POST | `/v1/releases` | admin | Release history/create `{version}` |
| POST | `/v1/metrics` | public | `{name,value,sessionId?,properties?}` |
| GET | `/v1/metrics` | admin | Aggregated metric names |
| GET | `/v1/audit` | admin | Recent configuration audit records |

Errors: JSON `{error,code}` with corresponding HTTP status. Batch ingestion returns 202 `{accepted,duplicates}`. No HTTP contract is generated yet: source of truth is `apps/api/src/server.ts`.
