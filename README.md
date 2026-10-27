sapling ecosystem

For Sapling Cloud, this distinction is extremely important because it determines which capabilities should be reusable platform primitives, which should be optional modules, and which should belong to the actual application.

The first thing to understand is that SaaS, B2B, B2C, D2C, and single-login applications are not necessarily five mutually exclusive categories.

A product can be B2B + SaaS + multi-tenant, or D2C + SaaS + single-user accounts simultaneously.

## 1. Understanding the application categories

| Category     | What it means                                                       | Examples                        | Typical characteristics                                |
| ------------ | ------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------ |
| SaaS         | Software delivered as an ongoing service                            | Notion, Canva                   | Subscriptions, accounts, feature entitlements          |
| B2B          | Business sells to another business                                  | Salesforce, HubSpot             | Organizations, teams, RBAC, contracts                  |
| B2C          | Business serves individual consumers                                | Netflix, Duolingo               | Personal accounts, engagement, consumer billing        |
| D2C          | Brand sells directly to consumers                                   | Lenskart, Mamaearth             | Catalog, orders, inventory, fulfillment                |
| Single-login | One individual account, without requiring an organization workspace | Personal notes, expense tracker | Individual identity, personal data, simple permissions |

A single-login application is really an identity and tenancy model, not a business category. It can support one person signing in from multiple devices and can still offer subscriptions.

Similarly, SaaS describes how software is delivered, while B2B/B2C describes the customer relationship.

## 2. The reusable capabilities every application can draw from

For Sapling, I would organize the platform into five architectural layers.
<img width="844" height="674" alt="image" src="https://github.com/user-attachments/assets/b4d5cf82-0538-4632-8fb3-1ef7c145210b" />


Layer 5 — Application Experience

B2B SaaS · B2C · D2C · Personal Apps · Marketplaces

Layer 4 — Domain Modules

Commerce · CRM · LMS · CMS · HRMS · Booking · Marketplace

Layer 3 — Shared Business Primitives

Identity · Billing · Notifications · Tenancy · Permissions · Workflows · Documents · Audit

Layer 2 — Developer Framework

CLI · Templates · SDKs · APIs · UI Kits · Configuration · Code Generation

Layer 1 — Infrastructure Adapters

AWS · Proxmox · Kubernetes · OpenTofu · PostgreSQL · S3 · Valkey

The key is that Sapling does not need to own the infrastructure. It can provide reusable code, configuration, contracts, and adapters that deploy onto infrastructure chosen by the developer.

## 3. Common reusable capabilities across application categories

The following matrix represents what I would consider the foundation of Sapling's reusable packages.

Legend: ● Commonly needed · ◐ Depends on product · — Usually unnecessary

| Reusable capability            | B2B SaaS | B2C | D2C | Personal app |
| ------------------------------ | -------- | --- | --- | ------------ |
| Authentication                 | ●        | ●   | ●   | ●            |
| User profiles                  | ●        | ●   | ●   | ●            |
| Organization/tenant management | ●        | ◐   | ◐   | —            |
| RBAC / ABAC                    | ●        | ◐   | ◐   | ◐            |
| API gateway                    | ●        | ◐   | ◐   | ◐            |
| Notifications                  | ●        | ●   | ●   | ◐            |
| Subscription billing           | ●        | ◐   | ◐   | ◐            |
| Payment processing             | ●        | ●   | ●   | ◐            |
| File/document storage          | ●        | ◐   | ●   | ◐            |
| Audit trails                   | ●        | ◐   | ◐   | ◐            |
| Analytics                      | ●        | ●   | ●   | ◐            |
| Feature flags                  | ●        | ●   | ●   | ◐            |
| Background jobs                | ●        | ●   | ●   | ◐            |
| Search                         | ◐        | ◐   | ●   | ◐            |
| CMS                            | ◐        | ●   | ●   | ◐            |
| Workflow orchestration         | ●        | ◐   | ●   | ◐            |
| Rate limiting                  | ●        | ●   | ●   | ●            |
| Observability                  | ●        | ●   | ●   | ●            |

These are architectural defaults, not mandatory rules. For example, a B2C application may have organization accounts, and a personal application may require detailed audit logs.

## 4. Features specific to each application category

[Nexora — Modern SaaS Workspace by Ovi Khan on Dribbble](https://images.openai.com/static-rsc-4/_A3RsQNR7WYaz_KM2m-UBdy7rGvXYnwyY505AG0DAqbBYfOcvVZVfBM_r_e9-u4j8N3w7XS52h0ukfU-CUVFRA9ifKAzxrquJuxHPgaI7XAsJfUc7AmRvZbCV-x8FRYtgc-1mec2zJkX_azPelytMnjLdALMdBkyDQfX7oxtA0U?purpose=inline)

A. B2B SaaS

Designed for companies, teams, and organizational workflows.

Distinctive features: organizations, workspaces, invitations, SSO/SAML, SCIM provisioning, seat-based billing, custom roles, approval chains, enterprise audit, service accounts, customer-specific integrations, contractual limits and SLAs.

[Poppins Mobile - Design | Engineering | Talent](https://images.openai.com/static-rsc-4/9fvfo0KU1hwk-lugc03QAE91WwBeqqXbDNKl1baHWV-tQ-Utm5lfWAid9RomniQB7fbivxRsxBl6OVHGYndb187lNEd0_ZbWEAx1DfOM6wC9xefWM_S6b0Eiy5UOZ_yxwT_b5ADiSEDiDh5kq5hcH5gj2YeuDAU6u-QCKxhZgn4?purpose=inline)

B. B2C application

Designed for high-volume individual users.

Distinctive features: social login, onboarding, preferences, recommendations, engagement campaigns, referrals, loyalty, consumer subscriptions, push notifications, device management and account deletion.

[Shopify Storefront Template | Parra Developer Documentation - Parra Documentation](https://images.openai.com/static-rsc-4/BO2ClSWuztyDwsWCcnIF9inxZBYkcwhBQI8RcQWTlTWflH2xBBZwaXDTVAbjHgSUwIHgbcJTcrsI7M4RUhtodtpL4q6ZEXkPIx4rr9RkbsRy-56t0TrBEjsLaf3FNdskYmQp_Y3I29s0pU6lF-4GZMnzo7mCAjYaYqvQcaMXgE0?purpose=inline)

C. D2C commerce

Designed for brands selling directly to customers.

Distinctive features: SKU catalog, product variants, inventory, carts, checkout, discounts, shipping, tax, order management, returns, refunds, fulfillment, customer support and abandoned-cart recovery.

[Note taking Web App | UI Design | To do app | Productivity by Meet Desai on Dribbble](https://images.openai.com/static-rsc-4/lnJISoC_EQY3uZW0JuLvLWmCkO8iCrYB9cOPikNkv2PIcqblCwZ4OlVQjuVkgzOQW6_5lvKOcQAeRJMbTlFuXQL_rr6NvwOcCIufsQ-270E2p5Sw0xUzL03wgE5_WpP2nAH-PrDxEzZEnrAzzkjnoMBhZi026dpBS6i7NRsyBPU?purpose=inline)

D. Single-user application

Designed around an individual account rather than an organization.

Distinctive features: private workspace, personal preferences, data export, cross-device synchronization, backup/restore, optional offline support and simplified account settings.

Notice something important: many apparently different features are variations of the same primitive.

For example, B2B seat billing, B2C recurring subscriptions, and D2C subscription boxes can all use the same billing foundation, but they require different pricing and fulfillment policies.

## 5. How common primitives specialize across products

| Sapling primitive | B2B implementation               | B2C implementation              | D2C implementation                        |
| ----------------- | -------------------------------- | ------------------------------- | ----------------------------------------- |
| IdentityOS        | Enterprise SSO, teams            | Social login, profiles          | Customer accounts, guest checkout         |
| BillingOS         | Per-seat, usage-based, invoicing | Monthly plans, in-app purchases | One-time checkout, refunds, subscriptions |
| NotificationOS    | Approvals, system alerts         | Engagement, reminders           | Order and delivery updates                |
| DocumentOS        | Contracts, business documents    | Personal uploads                | Invoices, product assets                  |
| AuditOS           | Compliance, employee actions     | Account/security history        | Order and payment history                 |
| GatewayOS         | Tenant API keys, quotas          | Consumer API protection         | Storefront and integration APIs           |
| WorkflowOS        | Multi-stage approvals            | User lifecycle automation       | Order fulfillment orchestration           |
| InsightOS         | Team usage, adoption             | Retention, engagement           | Conversion, cart abandonment              |

This leads to a particularly useful design rule:

Build the reusable mechanism once, then make its business behavior configurable or extensible.

For example, NotificationOS should not contain hardcoded order-shipped logic. The D2C commerce module should publish an `order.shipped` event, and NotificationOS should process it according to a configured template and delivery policy.

## 6. Other application archetypes Sapling should support

I would not stop with four or five categories. Sapling should also support these application archetypes, since they have meaningful differences in data models and workflows.

| Archetype                | Specialized capabilities                                            |
| ------------------------ | ------------------------------------------------------------------- |
| Marketplace              | Sellers, buyers, commissions, payouts, disputes                     |
| Multi-vendor commerce    | Vendor catalogs, seller inventory, settlements                      |
| LMS / EdTech             | Courses, enrollment, assessments, certificates                      |
| CRM                      | Leads, accounts, contacts, sales pipelines                          |
| HRMS                     | Employees, leave, attendance, payroll                               |
| Booking / Scheduling     | Availability, reservations, calendars, cancellations                |
| Social / Community       | Feeds, follows, moderation, messaging                               |
| Fintech                  | Ledgers, reconciliation, KYC, transaction controls                  |
| CMS / Content platform   | Content models, publishing, revisions, localization                 |
| Developer platform       | API keys, metering, webhooks, SDKs, developer portals               |
| Internal enterprise tool | Approvals, permissions, data connectors, audit                      |
| AI-native application    | Model gateways, prompt management, RAG, evaluations, token metering |

Each archetype should reuse the platform primitives but have its own domain module.

For example, an LMS and an HRMS may both use a document store, but course certificates and employee payroll documents have different business rules.

## 7. What this means for Sapling's package architecture

Instead of creating five separate frameworks for B2B, B2C, D2C, SaaS, and personal applications, I would create one composable framework with optional domain modules and starter templates.

Example Sapling package structure

&#x20;Copy

packages/\
├── core/\
│   ├── config, errors, events\
│   └── validation, observability\
├── platform/\
│   ├── identity, tenancy, permissions\
│   ├── gateway, notifications, billing\
│   ├── documents, audit, analytics\
│   └── workflows, search\
├── domains/\
│   ├── commerce, crm, lms\
│   └── hrms, booking, marketplace\
├── adapters/\
│   ├── aws, proxmox, kubernetes\
│   └── opentofu, postgres, s3\
├── sdk/\
│   ├── typescript, react\
│   └── react-native\
├── ui/\
│   ├── components, forms, layouts\
├── cli/\
└── templates/\
&#x20;   ├── personal, b2b-saas\
&#x20;   ├── b2c, d2c-commerce\
&#x20;   └── marketplace, enterprise

The template should decide which modules to compose. The module should own its own business logic. The infrastructure adapter should decide how its dependencies are provisioned.

## 8. An interactive example: What Sapling generates

Here is a conceptual configuration builder to demonstrate how different product types would use the same platform.

## Sapling App Composer

Select an archetype to see its reusable and domain-specific modules.

Application archetype

Personal app

Individual productivity

B2B SaaS

Company and team software

B2C app

Consumer subscription service

D2C commerce

Direct-to-consumer storefront

Marketplace

Multi-sided business

Optional modules

Search

CMS

AI gateway

File storage

Webhooks

Generated application composition

Reusable platform modules

Identity

Organizations

RBAC

SSO

Billing

Notifications

Audit

API gateway

Analytics

Search

AI gateway

Webhooks

CMS

Domain-specific modules

Team management

Seat billing

Invitations

Design this Sapling template&#x20;

## 9. Three important design decisions

First: separate identity from tenancy. A user, an organization, a workspace, and a membership are different concepts. Even if a personal application initially has only one user, Sapling should avoid assuming that every resource belongs to an organization.

Second: separate billing from commerce. Billing handles plans, subscriptions, invoices, metering, and entitlements. Commerce handles products, carts, orders, inventory, fulfillment, and returns. They can share payment and tax integrations without becoming one oversized module.

Third: distinguish SDKs from hosted services. An authentication SDK can integrate with an identity service, but an SDK alone does not provide an identity database or authentication server. Sapling can offer a local implementation, a self-hosted implementation, or an external-provider adapter depending on the module.

## 10. My recommendation for Sapling

I would organize Sapling into three distributable product families:

Sapling Core

Shared primitives, SDKs, UI components, identity, billing, notifications, workflows, configuration, and infrastructure adapters.

Sapling Modules

Optional business capabilities such as commerce, CRM, LMS, HRMS, CMS, marketplaces, and AI application building blocks.

Sapling Starters

Preconfigured application templates for B2B SaaS, B2C, D2C, personal applications, marketplaces, and enterprise software.

This aligns with your vision of Sapling being closer to a framework and application accelerator than a traditional cloud provider.

The ultimate developer experience could be as simple as:

```
npx create-sapling-app my-product
```

The CLI would ask what type of application to build, which capabilities to include, which database and infrastructure providers to use, and then generate a consistent TypeScript monorepo.

The central architectural principle is: Sapling should not build five different authentication systems, billing engines, notification services, or gateways for five types of applications. It should build one composable foundation with different policies, domain modules, and application templates.

That is how Sapling can support everything from a simple personal notes app to a complex multi-tenant enterprise SaaS or D2C commerce platform without duplicating its core functionality.
