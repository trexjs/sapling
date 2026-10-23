# Low-Level Design

## Existing schema
- `consent.records`: tenant-scoped generic records for 12 modules.
- `compliance.records`: tenant-scoped generic records for 6 modules.
- `consent.decisions`: append-only consent choices keyed by tenant, subject and domain.
- `compliance.monitor_runs`: recorded control check results.

## Existing REST API
For each service: `GET /health`, `GET /v1/modules`, `GET|POST /v1/:module`, `GET|PATCH|DELETE /v1/:module/:id`.
Consent: `POST /v1/decisions`, `GET /v1/decisions/:subjectId`, `GET /v1/decisions/:subjectId/latest`.
Compliance: `POST /v1/control-checks`, `GET /v1/control-checks`.

## Proposed domain entities (not yet implemented)
- Consent: sites, verified_domains, banner_versions, consent_policies, tracker_inventory, scan_runs, vendor_purposes, subject_preferences, receipts, dsar_cases, dsar_tasks.
- Compliance: framework_versions, requirements, controls, control_mappings, evidence_artifacts, evidence_links, connectors, monitoring_schedules, risk_items, treatments, audit_engagements, findings.

## Proposed state machines
Banner: draft → review → approved → published → retired.
DSAR: submitted → verification → triage → processing → review → completed/rejected.
Evidence: requested → collected → validated → accepted/rejected → expired.
Audit: planned → collecting → review → findings → closed.

## Event contract examples
`consent.decision.recorded.v1`, `consent.withdrawn.v1`, `scan.completed.v1`, `control.failed.v1`, `evidence.accepted.v1`, `audit.finding.created.v1`. Include tenantId, eventId, schemaVersion, occurredAt, traceId and idempotency key.

## Security constraints
Current tenant header is untrusted; production must derive tenant from validated identity context. Generic JSON metadata is not adequate for regulatory-grade domain invariants.
