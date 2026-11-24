const ISO_DATE = new Intl.DateTimeFormat("en-CA", {
  timeZone: "UTC",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const LONG_DATE = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function isoDate(now: Date): string {
  return ISO_DATE.format(now);
}

export function longDate(now: Date): string {
  return LONG_DATE.format(now);
}

/** Cuts `text` to at most `max` characters, on a paragraph boundary when possible. */
export function truncate(text: string, max: number): { text: string; truncated: boolean } {
  if (text.length <= max) return { text, truncated: false };
  const cut = text.lastIndexOf("\n\n", max);
  return { text: text.slice(0, cut > 0 ? cut : max), truncated: true };
}

export function elapsedMs(started: number): number {
  return Math.round(performance.now() - started);
}

export function average(scores: number[]): number | null {
  if (scores.length === 0) return null;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

export function formatScore(score: number | null): string {
  return score === null ? "n/a" : score.toFixed(3);
}

export function formatDuration(value: number): string {
  if (value >= 10_000) return `${Math.round(value / 1000)}s`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}s`;
  return `${Math.round(value)}ms`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 0) return "n/a";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)}kB`;
  return `${bytes}B`;
}

export function formatCount(value: number | undefined): string {
  return value === undefined ? "n/a" : String(value);
}

export function utf8Bytes(value: unknown): number {
  try {
    return new TextEncoder().encode(JSON.stringify(value)).length;
  } catch {
    return -1;
  }
}
