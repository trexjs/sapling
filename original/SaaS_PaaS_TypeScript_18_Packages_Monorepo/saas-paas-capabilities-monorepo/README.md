# SaaS / PaaS Cross-Cutting Capabilities Monorepo

18 TypeScript capability packages (A–R), derived from the 18 user-provided architecture PDF briefs. Each package contains working starter code plus HLD, LLD, onboarding, and gaps/improvements documents. Original PDFs are preserved in `references/`.

## Start
```bash
npm install
npm run build
```

## Scope and important limitations
- Packages are **implemented starter slices**; the briefs describe target architectures with broader scope.
- Memory implementations do **not** supply durability, multi-node safety, evidence integrity, billing correctness or legally compliant processing.
- Provider interfaces are intentionally unbound until infrastructure, credentials, ownership and security review are selected.
- No automated tests/test scripts/frameworks were created, per request. The Q package is a quality-policy registry, not a test harness.

See [capability map](docs/CAPABILITY-MAP.md) and [architecture](docs/ARCHITECTURE.md).
