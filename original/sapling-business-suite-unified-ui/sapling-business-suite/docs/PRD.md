# Product Requirements Document
## Vision
Unified internal business operations workspace spanning demand generation, workforce operations, revenue operations and customer success. Four bounded contexts with a shared identity and audit layer.
## Personas
Marketing operator, HR administrator, recruiter, employee, sales representative, sales manager, support agent, customer success manager, platform administrator.
## Functional scope
### ReachOS
Campaign lifecycle, audience segmentation, editorial content, marketing touchpoints; roadmap: SEO research, attribution, consent, paid media and email/SMS channel connectors.
### PeopleOS
Job requisitions, candidate pipeline, employee directory, leave requests, reviews, courses/enrollments; roadmap: onboarding checklists, policy attestations, attendance, payroll connectors, statutory compliance, separation.
### DealOS
Contacts, leads, opportunities, quotes, contracts; roadmap: account hierarchies, forecasting, price books, approval chains, e-signature, order handoff.
### CareOS
Customers, onboarding, cases/tickets, SLA definitions, feedback, renewals; roadmap: SLA timers, escalation, omnichannel inbox, knowledge base, health scoring.
### Cross cutting
Tasks and activity timeline, tenant isolation, audit, role controls; roadmap: notifications, event bus, automation engine, file storage, BI and consent management.
## Acceptance criteria for foundation
Authenticated callers can list, create and update records inside their organization; users cannot read other organizations' records; viewers cannot write; audit entries created for writes; UI exposes all 24 resource types.
## KPIs
Marketing: MQL conversion, campaign ROI, CAC. HR: headcount, attrition, retention, time to hire, time to fill, absenteeism, training ROI, eNPS. Sales: pipeline velocity, win rate, average deal size. Care: first response, resolution time, CSAT, retention and renewal rate. **KPI computation is roadmap, not implemented.**
