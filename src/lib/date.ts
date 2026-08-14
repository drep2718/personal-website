// No fs/path here — safe to import from client components (unlike lib/blog.ts).

export function formatDate(date: string): string {
  if (!date) return "";
  // Parse as UTC and format in UTC so a "2026-07-20" date never slips a day
  // backward in a timezone behind UTC.
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
