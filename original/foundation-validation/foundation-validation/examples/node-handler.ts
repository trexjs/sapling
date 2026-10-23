import { v } from "../src/index.js";

const CreateProject = v.object({
  name: v.string().min(3).max(100),
  visibility: v.enum(["private", "public"]),
  seats: v.number().int().min(1).max(500)
}).strict();

export function validateCreateProject(body: unknown) {
  const result = CreateProject.safeParse(body);
  if (!result.success) {
    return {
      status: 400,
      body: {
        code: "VALIDATION_FAILED",
        issues: result.issues.map(({ code, message, path }) => ({ code, message, path }))
      }
    };
  }

  return { status: 200, body: { data: result.data } };
}
