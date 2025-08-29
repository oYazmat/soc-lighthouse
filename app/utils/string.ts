export function toKebabCase(str: string): string {
  return str
    .replace(/["']/g, "")
    .replace(/\./g, "-")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
