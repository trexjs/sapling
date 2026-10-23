# Sapling Business Suite — Consolidated HLD

## 22-to-10 consolidation
- **ReachOS**: Marketing, GrowthOS
- **DealOS**: CRM, PartnerOS
- **RevenueOS**: RevenueOS
- **CareOS**: CareOS, SuccessOS, KnowledgeOS
- **PeopleOS**: PeopleOS, TalentOS, WorkforceOS
- **FinanceOS**: FinanceOS, SpendOS, ProcureOS
- **GovernanceOS**: LegalOS, TrustOS
- **ProductOS**: ProductOS, ProjectOS
- **OperationsOS**: ServiceOS, WorkOS, AssetOS
- **BusinessIntelligence**: InsightOS

## Runtime
One Node.js/Express deployment, one PostgreSQL database with logical domain ownership, React portal, TypeScript workspaces, Drizzle. Internal module contracts should eventually replace direct cross-domain SQL.

## Sequence: deal closed won
1. DealOS validates opportunity transition.
2. In one transaction, persist transition and outbox event.
3. Worker publishes `deal.won.v1` with tenant, aggregate ID, event ID and correlation ID.
4. RevenueOS idempotently provisions subscription through Kubera contract.
5. CareOS starts customer onboarding; Pingora sends notifications.
6. InsightOS consumes analytics events.

**Status:** sequence is architectural target, not implemented end-to-end.

## Security
OIDC/JWKS verification, tenant-level RLS or enforced scoped repositories, RBAC/ABAC, secrets, immutable audit, encryption, privacy and legal review are required for production.
