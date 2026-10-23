# Production-grade domain workflow specifications (not yet implemented)

## Subscription lifecycle
Trial -> Active -> PastDue -> Suspended -> Cancelled. Create subscription under a DB transaction with plan version snapshot, idempotency key, entitlement provision request, outbox event. Invoice creation uses immutable line items, currency minor units, taxes and immutable invoice numbering. Payment webhook is verified, deduplicated and persisted before settlement; use provider reconciliation jobs. Never mark paid based on browser return.

## Payroll
Attendance + approved leave + effective compensation revision -> payroll run draft -> review -> lock -> payslip -> payment instruction -> reconciled. Payroll requires jurisdiction-specific statutory deductions, maker-checker approvals, encrypted salary data, immutable run snapshots and ledger postings. No payroll calculation is implemented in this release.

## Workflow orchestration
Definitions are versioned. Instances track durable steps, attempts, leases, deadlines, cancellation, compensating actions and human approvals. Worker execution must be at-least-once and activities idempotent. Use Sapling FlowForge when available; do not implement a second execution engine without an explicit boundary.

## Accounting
Double-entry journal posts must balance per currency and be immutable after posting. Reversals are new entries. Close periods prevent backdated mutation. Expense and procurement approval must not bypass authorization.

## Lead-to-cash
Marketing lead qualified -> sales opportunity -> signed contract -> customer and subscription provisioned -> onboarding -> renewal. Use transactional outbox with event IDs, inbox deduplication, retries and DLQ. No cross-module orchestration is executed in this release.
