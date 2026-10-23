/**
 * Permission primitives for RBAC and ABAC.
 * Share policy definitions between UI visibility checks and server authorization,
 * but ALWAYS enforce authorization on the server/API; client checks are UX only.
 */
export type PrincipalId = string;
export type ResourceType = string;
export type Action = string;
export type AttributeValue = string | number | boolean | null | readonly string[];
export interface Principal {
  id: PrincipalId;
  roles?: readonly string[];
  attributes?: Record<string, AttributeValue>;
}
export interface Resource {
  type: ResourceType;
  id?: string;
  ownerId?: string;
  attributes?: Record<string, AttributeValue>;
}
export interface PermissionRequest {
  principal: Principal;
  action: Action;
  resource: Resource;
  context?: Record<string, AttributeValue>;
}
export type Effect = "allow" | "deny";
export type ConditionOperator = "eq" | "neq" | "in" | "notIn" | "contains" | "startsWith" | "exists" | "gt" | "gte" | "lt" | "lte";
export interface AttributeCondition {
  /** Resolve a value from principal.*, resource.*, context.*, or literal. */
  path: string;
  operator: ConditionOperator;
  value?: AttributeValue;
}
export interface Policy {
  id: string;
  effect: Effect;
  actions: readonly string[];
  resources: readonly string[];
  roles?: readonly string[];
  conditions?: readonly AttributeCondition[];
  priority?: number;
}
export interface AuthorizationDecision {
  allowed: boolean;
  reason: "explicit-deny" | "matched-allow" | "no-matching-policy";
  policyId?: string;
}
const wildcardMatch = (pattern: string, value: string): boolean =>
  pattern === "*" || pattern === value || (pattern.endsWith(":*") && value.startsWith(pattern.slice(0, -1)));
function resolvePath(request: PermissionRequest, path: string): unknown {
  const [root, ...parts] = path.split(".");
  let value: any = root === "principal" ? request.principal
    : root === "resource" ? request.resource
    : root === "context" ? request.context : undefined;
  for (const part of parts) value = value == null ? undefined : value[part];
  return value;
}
function evaluateCondition(condition: AttributeCondition, request: PermissionRequest): boolean {
  const actual = resolvePath(request, condition.path), expected = condition.value;
  switch (condition.operator) {
    case "exists": return condition.value === false ? actual === undefined : actual !== undefined;
    case "eq": return actual === expected;
    case "neq": return actual !== expected;
    case "in": return Array.isArray(expected) && expected.includes(actual as never);
    case "notIn": return Array.isArray(expected) && !expected.includes(actual as never);
    case "contains": return Array.isArray(actual) ? actual.includes(expected as never) : typeof actual === "string" && typeof expected === "string" && actual.includes(expected);
    case "startsWith": return typeof actual === "string" && typeof expected === "string" && actual.startsWith(expected);
    case "gt": return typeof actual === "number" && typeof expected === "number" && actual > expected;
    case "gte": return typeof actual === "number" && typeof expected === "number" && actual >= expected;
    case "lt": return typeof actual === "number" && typeof expected === "number" && actual < expected;
    case "lte": return typeof actual === "number" && typeof expected === "number" && actual <= expected;
  }
}
export class PermissionEngine {
  private policies: Policy[];
  constructor(policies: readonly Policy[] = []) { this.policies = [...policies]; }
  addPolicy(policy: Policy): void { this.policies = [...this.policies.filter(p => p.id !== policy.id), policy]; }
  removePolicy(id: string): void { this.policies = this.policies.filter(policy => policy.id !== id); }
  listPolicies(): readonly Policy[] { return this.policies; }
  explain(request: PermissionRequest): AuthorizationDecision {
    const candidates = this.policies.filter(policy =>
      policy.actions.some(pattern => wildcardMatch(pattern, request.action)) &&
      policy.resources.some(pattern => wildcardMatch(pattern, request.resource.type)) &&
      (!policy.roles?.length || policy.roles.some(role => request.principal.roles?.includes(role))) &&
      (policy.conditions ?? []).every(condition => evaluateCondition(condition, request))
    ).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    const deny = candidates.find(policy => policy.effect === "deny");
    if (deny) return { allowed: false, reason: "explicit-deny", policyId: deny.id };
    const allow = candidates.find(policy => policy.effect === "allow");
    return allow
      ? { allowed: true, reason: "matched-allow", policyId: allow.id }
      : { allowed: false, reason: "no-matching-policy" };
  }
  can(request: PermissionRequest): boolean { return this.explain(request).allowed; }
  canAll(requests: readonly PermissionRequest[]): boolean { return requests.every(request => this.can(request)); }
  canAny(requests: readonly PermissionRequest[]): boolean { return requests.some(request => this.can(request)); }
}
export const definePolicy = (policy: Policy): Policy => policy;
export const hasRole = (principal: Principal, role: string): boolean => principal.roles?.includes(role) ?? false;
export const hasAnyRole = (principal: Principal, roles: readonly string[]): boolean => roles.some(role => hasRole(principal, role));
export const hasAllRoles = (principal: Principal, roles: readonly string[]): boolean => roles.every(role => hasRole(principal, role));
export const isOwner = (principal: Principal, resource: Resource): boolean => resource.ownerId !== undefined && principal.id === resource.ownerId;
export const createRbacPolicy = (id: string, roles: readonly string[], actions: readonly string[], resources: readonly string[], effect: Effect = "allow"): Policy =>
  ({ id, roles, actions, resources, effect });
export const createAbacPolicy = (id: string, actions: readonly string[], resources: readonly string[], conditions: readonly AttributeCondition[], effect: Effect = "allow"): Policy =>
  ({ id, actions, resources, conditions, effect });
export const ownerMatches = (request: PermissionRequest): boolean =>
  request.resource.ownerId !== undefined && request.resource.ownerId === request.principal.id;
