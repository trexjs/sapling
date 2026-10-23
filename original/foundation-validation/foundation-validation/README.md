# @foundation/validation

A TypeScript-first, framework-independent schema validation library for browser UI, Node.js APIs, configuration, and shared data contracts.

> Early foundation release (0.1.0). Review the roadmap before relying on this package for security-critical or production-critical validation.

## Requirements

- Node.js 18+
- TypeScript 5.8+

## Install and build

```bash
npm install
npm test
npm run typecheck
npm run build
```

## Quick start

```ts
import { v, type Infer } from "@foundation/validation";

const UserSchema = v.object({
  name: v.string().min(2).max(80),
  email: v.string().email(),
  age: v.number().int().min(18).optional(),
  role: v.enum(["admin", "member", "viewer"])
});

type User = Infer<typeof UserSchema>;

const result = UserSchema.safeParse({
  name: "Alex",
  email: "alex@example.com",
  role: "member"
});

if (result.success) {
  const user: User = result.data;
} else {
  console.log(result.issues);
}
```

## Node.js API example

Framework-neutral validation can run in any request handler:

```ts
import { v } from "@foundation/validation";

const CreateAccount = v.object({
  email: v.string().email(),
  displayName: v.string().min(2).max(60)
}).strict();

export async function createAccountHandler(req: { body: unknown }, res: {
  status(code: number): { json(body: unknown): unknown };
  json(body: unknown): unknown;
}) {
  const result = CreateAccount.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "VALIDATION_FAILED",
      issues: result.issues
    });
  }

  // Use result.data only after validation.
  return res.json({ account: result.data });
}
```

This is an illustrative handler shape; adapt it to your framework's request/response types. Validate untrusted input on the server even when the UI also validates it.

## Available primitives

- `v.string()`: `min`, `max`, `length`, `email`, `url`, `uuid`, `regex`, `startsWith`, `endsWith`, `trim`, `toLowerCase`
- `v.number()`: `min`, `max`, `int`, `positive`, `nonnegative`, `finite`
- `v.boolean()`, `v.date()`, `v.literal(value)`, `v.enum([...])`
- `v.array(schema)`: `min`, `max`
- `v.object(shape)`: `strict`, `extend`, `pick`
- `v.union([schemaA, schemaB])`, `v.record(valueSchema)`
- Common schema methods: `optional`, `nullable`, `nullish`, `default`, `refine`, `transform`, `safeParse`, `parse`, `safeParseAsync`

## Result contract

Successful validation returns `{ success: true, data }`. Failure returns `{ success: false, issues }`, where each issue has a stable `code`, human-readable `message`, and structured `path`. `parse()` throws `ValidationError`; `safeParse()` does not throw for invalid input.

## Important limitations in this release

- `safeParseAsync()` currently wraps synchronous validation; asynchronous refinements and remote checks are not implemented.
- Email validation is pragmatic format checking, not proof that an address exists or can receive mail.
- Coercion is intentionally limited to `v.coerce.number()`.
- No JSON Schema/OpenAPI generation, React hooks/components, localization catalogue, or built-in Express/Fastify adapter yet.
- This is an initial implementation. Run the test suite and review it before production use; schema validation does not replace authorization, business rules, or database constraints.

See [WHAT_CAN_BE_THE_WAY_FORWARD.md](./WHAT_CAN_BE_THE_WAY_FORWARD.md) for the P0–P2 backlog.
