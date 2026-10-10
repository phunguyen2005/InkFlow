export function label(value: string) {
  return value
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
export function genreSlug(genre: string) {
  return genre.toLowerCase().replaceAll(" ", "-");
}
export function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
export function readingTime(body: string) {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 220));
}
export function initials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");
}
