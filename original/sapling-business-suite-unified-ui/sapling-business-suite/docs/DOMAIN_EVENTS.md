# Proposed Domain Event Contracts

Events: `lead.qualified.v1`, `deal.won.v1`, `subscription.activated.v1`, `invoice.paid.v1`, `customer.onboarded.v1`, `ticket.escalated.v1`, `employee.hired.v1`, `purchase.approved.v1`.

Envelope: `{eventId, eventType, eventVersion, organizationId, aggregateId, occurredAt, correlationId, causationId, payload}`.

Production requirements: transactional outbox, consumer inbox/deduplication, retries, DLQ, ordering per aggregate, tracing, schema evolution. **Not yet implemented.**
