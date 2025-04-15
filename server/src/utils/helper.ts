export function generateSlug(title: string, suffix?: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  return suffix ? `${base}-${suffix}` : base;
}
