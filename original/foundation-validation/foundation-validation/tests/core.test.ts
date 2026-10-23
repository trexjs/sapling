import { describe, expect, it } from "vitest";
import { ValidationError, v } from "../src/index.js";

describe("foundation validation core", () => {
  it("validates strings and accumulates rule issues", () => {
    const result = v.string().min(3).email().safeParse("x");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.issues.length).toBe(2);
  });

  it("returns typed parsed object data", () => {
    const schema = v.object({
      name: v.string().min(2),
      age: v.number().int().min(18),
      nickname: v.string().optional()
    });
    const result = schema.safeParse({ name: "Alex", age: 22 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Alex");
  });

  it("tracks nested issue paths", () => {
    const result = v.object({ tags: v.array(v.string().min(2)) })
      .safeParse({ tags: ["ok", "x"] });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.issues[0]?.path).toEqual(["tags", 1]);
  });

  it("supports strict objects", () => {
    const result = v.object({ name: v.string() }).strict().safeParse({ name: "A", extra: true });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.issues.some(i => i.code === "unrecognized_key")).toBe(true);
  });

  it("supports union, enum, and transforms", () => {
    expect(v.union([v.string(), v.number()] as const).parse(4)).toBe(4);
    expect(v.enum(["small", "large"]).parse("large")).toBe("large");
    expect(v.string().trim().parse("  hi  ")).toBe("hi");
  });

  it("throws a structured ValidationError from parse()", () => {
    expect(() => v.number().parse("wrong")).toThrow(ValidationError);
  });

  it("supports number coercion", () => {
    expect(v.coerce.number().parse("42")).toBe(42);
  });
});
