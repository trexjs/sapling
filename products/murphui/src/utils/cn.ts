type ClassValue = string | number | boolean | undefined | null;

export function cn(...classes: (ClassValue | ClassValue[])[]): string {
  return classes
    .flat()
    .filter((c) => typeof c === "string" && c.length > 0)
    .join(" ");
}
