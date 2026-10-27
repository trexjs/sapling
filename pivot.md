Now the direction of Sapling Cloud is much clearer. I think this is a better-defined product than attempting to build another AWS, GCP, or Azure.

What you're describing is essentially a SaaS Application Development Framework + Infrastructure Orchestration Platform.

The key distinction is that Sapling doesn't need to own infrastructure. It needs to understand how to generate, configure, provision, deploy, and operate applications on infrastructure that somebody else provides.

## 1. How I would define Sapling Cloud

Think about these existing tools:

| Product                 | What it simplifies                         |
| ----------------------- | ------------------------------------------ |
| Create React App / Vite | Frontend project scaffolding               |
| Next.js                 | Application development conventions        |
| NestJS                  | Backend architecture and reusable patterns |
| Supabase                | Backend services and integrations          |
| Terraform / OpenTofu    | Infrastructure provisioning                |
| Kubernetes              | Container orchestration                    |
| Backstage               | Developer portals and software templates   |

Sapling combines selected capabilities from these categories into a unified developer experience, without necessarily rebuilding their underlying engines.

For example, a developer could say:

> Create a multi-tenant SaaS application with React, Express, PostgreSQL, authentication, billing, notifications, file storage, background jobs, and Kubernetes deployment on AWS.

Sapling would generate the application and its configuration, connect the selected reusable packages, and produce a deployable infrastructure plan.

## 2. The architecture I would recommend

Sapling CLI / Developer Portal / AI App Builder

Project creation • Templates • Configuration • Deployment UI

<img width="776" height="765" alt="image" src="https://github.com/user-attachments/assets/3dc8cfeb-f51a-4991-b65a-d8ce8b5273ad" />


Sapling Application Framework

Identity SDK

Database SDK

Billing SDK

Notification SDK

Storage SDK

Workflow SDK

Observability

Feature Flags

API Gateway

Sapling Infrastructure Adapter Layer

OpenTofu • Helm • Kubernetes manifests • Provider adapters

AWS / GCP / Azure

Public cloud

Proxmox

Private virtualization

Bare Metal

Self-hosted infrastructure

Infrastructure is provisioned and operated by the selected provider, not owned by Sapling.

One important architectural decision: the application framework should not depend directly on AWS, Proxmox, or OpenTofu.

It should depend on capability contracts.

For example:

```
interface StorageProvider {
  upload(file: File): Promise<string>;
  download(key: string): Promise<Uint8Array>;
  delete(key: string): Promise<void>;
}
```

A developer could select AWS S3, MinIO, or another compatible implementation without changing the application's business logic.

The same approach applies to databases, queues, authentication, notifications, and other services.

## 3. Where OpenTofu and Proxmox fit

These two technologies are complementary, not competitors.

[OpenTofu: A beginners guide to a Terraform fork including migration from Terraform Course | KodeKloud](https://images.openai.com/static-rsc-4/_xoCdQ84zspBomsxQkwWniG6AVCYXtyvGpNFk-CCkShDBXmVrWDh42djirJ_fihmu-6r9_dx5VPhS_9S2XUZF6QpLJvHplsr78VHTjzvXe4KBQTxoRsYl0LjB-xDXUHIfqDbU5tIaIJZmSk09M7uhyOR1XhQjorM_3nyAAeTVx4?purpose=inline)

OpenTofu — Infrastructure provisioning engine

Sapling generates or configures OpenTofu modules to provision VMs, networks, managed databases, Kubernetes infrastructure, and other provider-supported resources.

[Self-Host Weekly (8 August 2025)](https://images.openai.com/static-rsc-4/m8r4Oc_-WU9DWB8K2kCL0xqaW0qdxW51NrO4AYVN0rM33NxeV5mAlS2NvVpvVA68vZFVbRMBFdSOeZvEpW_wfguuYNVW8Rg1czSFoc3phIPvEvhRY_m0TzpipHyM3whgyrLB70N3Q6Z1VAOxqvSwhdE3TVkTGbC4uO-9nwQapwc?purpose=inline)

Proxmox VE — Infrastructure provider

Proxmox runs virtual machines and containers on physical hosts. Sapling can provision VMs through an appropriate OpenTofu provider, then bootstrap Kubernetes on those VMs.

[PaperMC/Velocity - k8s 中文文档](https://images.openai.com/static-rsc-4/xi6TSQ0skPuUlRXG_yQsCenukJdUTpwX0I5p70Fxu9gutts9s7jCWqCVYcgRyFR4JHGah6XHYlF7eIOCBqDU_f2bSjztMqsMRPWmofsZICIVf3tV_VeXgKYG3K3Zsrgc9excjLt3HqqqLIEcUS0ULnVL1IlqTDhafuNXJmeNShM?purpose=inline)

Kubernetes — Application runtime

Once the cluster exists, Sapling can deploy workloads through Helm or Kubernetes manifests, regardless of whether the nodes run on AWS or Proxmox.

A Proxmox deployment might look like:

`Sapling → OpenTofu → Proxmox VMs → Kubernetes → SaaS Application`

An AWS deployment might look like:

`Sapling → OpenTofu → AWS EKS/RDS/S3 → SaaS Application`

The underlying infrastructure differs, but the developer-facing workflow remains largely consistent.

## 4. I would divide Sapling into four products

| Layer            | Responsibility                                       | Example                                            |
| ---------------- | ---------------------------------------------------- | -------------------------------------------------- |
| Sapling Kit      | Application scaffolding and reusable packages        | `create-sapling-app`                               |
| Sapling Services | Optional integrations and deployable PaaS components | IdentityOS, InsightOS, NotificationOS              |
| Sapling Deploy   | Infrastructure configuration and deployment          | OpenTofu, Helm, Kubernetes                         |
| Sapling Console  | Unified developer experience                         | Project creation, configuration, deployment status |

This distinction is important because not every application needs all the services.

A small SaaS application might use only authentication, PostgreSQL, and storage. A larger enterprise application might add Kafka, workflow orchestration, audit trails, observability, and multiple independently deployed services.

Sapling should support both without imposing unnecessary complexity.

## 5. The developer experience

For example:

```
npx create-sapling-app my-saas

cd my-saas

sapling add auth
sapling add database --provider postgres
sapling add storage --provider s3
sapling add billing
sapling add notifications

sapling dev
```

For infrastructure:

```
sapling infra init

sapling infra plan --provider proxmox

sapling infra apply

sapling deploy --environment production
```

These are proposed Sapling CLI commands, not existing implemented commands.

The generated project could contain:

```
my-saas/
├── apps/
│   ├── web/
│   ├── api/
│   └── worker/
├── packages/
│   ├── auth/
│   ├── database/
│   ├── billing/
│   └── shared/
├── infrastructure/
│   ├── opentofu/
│   ├── kubernetes/
│   └── helm/
├── sapling.config.ts
└── package.json
```

The crucial feature is that the developer owns the generated application code. Sapling should not require a permanently running proprietary control plane for that code to function.

## 6. What I would deliberately avoid building

I would not initially build a custom hypervisor, container runtime, Kubernetes distribution, database engine, or Terraform replacement.

Those technologies already solve complex infrastructure problems.

Instead, invest in the capabilities that differentiate Sapling:

- High-quality SaaS templates and opinionated TypeScript packages.
- Reusable service integrations with consistent SDK contracts.
- Infrastructure-independent configuration and deployment recipes.
- Automated environment setup, secrets integration, migrations, and service wiring.
- Upgradeable templates and packages without overwriting developer customizations.
- AI-assisted application generation, architecture selection, and configuration.
- A developer portal that makes local development and production deployment feel like one workflow.

I would also keep the first release focused on a modular monolith by default, with optional workers and services. Kubernetes and microservices should be available when necessary, rather than mandatory for every application.

## 7. The biggest architectural decision

I see two possible deployment models:

Model A — Bring Your Own Infrastructure (BYOI)

Developers use Sapling to generate applications and deploy them into their own AWS, Proxmox, or Kubernetes environment.

This should be Sapling's initial model.

Model B — Sapling Managed Cloud

Sapling operates a control plane that provisions and manages infrastructure for customers, potentially on third-party providers.

This could be a later commercial offering, but it adds significant operational, security, billing, and support responsibilities.

My recommendation is to build Model A first, with an architecture that does not prevent Model B later.

The product positioning then becomes:

> Sapling is an open-source, TypeScript-first SaaS development framework that combines reusable application capabilities, opinionated architecture, and infrastructure-as-code deployment workflows to help developers build and ship production-ready applications faster.

One question that will significantly shape the architecture: Should Sapling be primarily a CLI/framework that developers install locally, with the web console being optional, or should the web-based AI application builder be the primary experience, with the CLI supporting it?

Both can share the same underlying engine, but choosing the primary experience will determine how we structure Sapling's core packages and orchestration layer.
