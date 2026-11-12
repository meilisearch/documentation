/**
 * Canonical language keys used on indexed code samples.
 * Mintlify tab labels ("HTTP request", "Meili CLI", "JS", "C#") and snippet fence
 * labels ("cURL", "CLI", "JS") both normalize through this table.
 * Keep `chat/src/samples.ts` in sync: a test compares the two.
 */

const LABELS: Record<string, string> = {
  "http request": "http",
  curl: "http",
  "meili cli": "cli",
  cli: "cli",
  js: "js",
  javascript: "js",
  "c#": "csharp",
  csharp: "csharp",
  python: "python",
  php: "php",
  java: "java",
  ruby: "ruby",
  go: "go",
  rust: "rust",
  dart: "dart",
  swift: "swift",
};

const DISPLAY: Record<string, string> = {
  http: "HTTP",
  cli: "CLI",
  js: "JavaScript",
  python: "Python",
  php: "PHP",
  java: "Java",
  ruby: "Ruby",
  go: "Go",
  rust: "Rust",
  csharp: "C#",
  dart: "Dart",
  swift: "Swift",
};

/** Missing or blank preference is HTTP, which every route sample has. */
export function normalizeLanguage(label: string | null | undefined): string {
  if (!label?.trim()) return "http";
  const key = label.trim().toLowerCase();
  return LABELS[key] ?? (key.replace(/[^a-z0-9]+/g, "") || "http");
}

export function languageName(key: string): string {
  return DISPLAY[key] ?? key.slice(0, 1).toUpperCase() + key.slice(1);
}

export type SampleSelection = {
  language: string;
  code: string;
  /** Set when the preferred language is missing and HTTP is returned instead. */
  note: string | null;
};

/** Picks the reader's language, otherwise the HTTP sample plus an explicit note. */
export function selectSample(
  codes: Record<string, string> | undefined,
  preference: string | null | undefined,
): SampleSelection {
  const available = codes ?? {};
  const language = normalizeLanguage(preference);
  if (available[language]) return { language, code: available[language], note: null };
  const code = available.http ?? "";
  if (language === "http") return { language: "http", code, note: null };
  return {
    language: "http",
    code,
    note: `No ${languageName(language)} sample for this route. Showing the HTTP request.`,
  };
}
