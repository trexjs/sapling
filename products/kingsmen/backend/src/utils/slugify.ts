const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]+/g;

export function slugify(value: string): string {
  const normalized = value.trim().toLowerCase();
  return normalized
    .replace(NON_ALPHANUMERIC_REGEX, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}
