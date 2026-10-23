# Engineering notes

- Preferred ORM: Drizzle ORM + `pg`, not Prisma. PostgreSQL is source of truth.
- Isolation: service boundaries are modular inside a single Express deployment for now; extract only when team/domain scale demands.
- Prefer migrations (`db:generate`, `db:migrate`) over `db:push` outside local development.
- `@kubera/contracts` is used for Zod inputs, but SDK return types use `any` in this starter. Replace with inferred response schemas/OpenAPI-generated DTO types before release.
- TypeScript strict mode applies, but no CI build validation has been performed for this generated ZIP.
- For deployment, provision a secure separate control plane and secrets manager, not shared admin browser keys.
