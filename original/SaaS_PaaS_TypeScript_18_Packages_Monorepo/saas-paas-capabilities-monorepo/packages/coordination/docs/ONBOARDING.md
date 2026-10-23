# Onboarding — Coordination

## Prerequisites
- Node.js 22+ and npm 10+ recommended.
- TypeScript is configured at workspace root.
- No infrastructure credentials or test framework required for this starter.

## First steps
1. From repository root, run `npm install`.
2. Run `npm run build` to compile all packages.
3. Read `references/J_Concurrency_Coordination.pdf` and this package's `docs/HLD.md` / `docs/LLD.md`.
4. Import exports from `@platform/coordination` in a workspace consumer.
5. Check source in `src/index.ts` for the actual exported interfaces.

## Development workflow
- Extend the typed contract with backwards compatibility in mind.
- Preserve tenant/actor boundary validation and documented failure modes.
- Keep domain business rules outside shared mechanics.
- Add required infrastructure using explicit adapters rather than coupling this package to a single vendor.
- Update HLD, LLD and the gaps document together with the code.

## Source acceptance expectations
I Concurrent updates cannot silently overwrite each other. I Duplicate delivery does not duplicate protected side effects. I Queue saturation has bounded and documented behavior. I Coordination guarantees are described accurately and tested under failure.

## Known limitations
This is a TypeScript **implementation foundation**, not a production-ready distributed platform. No test suites have been added, per request.
