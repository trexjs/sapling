# Onboarding — Data Lifecycle

## Prerequisites
- Node.js 22+ and npm 10+ recommended.
- TypeScript is configured at workspace root.
- No infrastructure credentials or test framework required for this starter.

## First steps
1. From repository root, run `npm install`.
2. Run `npm run build` to compile all packages.
3. Read `references/I_Data_Lifecycle_Schema_Evolution.pdf` and this package's `docs/HLD.md` / `docs/LLD.md`.
4. Import exports from `@platform/data-lifecycle` in a workspace consumer.
5. Check source in `src/index.ts` for the actual exported interfaces.

## Development workflow
- Extend the typed contract with backwards compatibility in mind.
- Preserve tenant/actor boundary validation and documented failure modes.
- Keep domain business rules outside shared mechanics.
- Add required infrastructure using explicit adapters rather than coupling this package to a single vendor.
- Update HLD, LLD and the gaps document together with the code.

## Source acceptance expectations
I Schema changes can roll out across mixed application versions. I Retention and deletion policies are enforceable and auditable. I Restore tests validate usable data and application recovery. I Tenant migrations include integrity checks and a defined recovery path.

## Known limitations
This is a TypeScript **implementation foundation**, not a production-ready distributed platform. No test suites have been added, per request.
