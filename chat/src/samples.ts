/**
 * Language selection for code samples returned to the docs chat.
 * Keep `scripts/ingest/languages.ts` in sync: a test compares the two.
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

const FENCE: Record<string, string> = {
  http: "bash",
  cli: "bash",
  js: "javascript",
  csharp: "csharp",
};

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
  note: string | null;
};

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

export function fenceLanguage(language: string): string {
  return FENCE[language] ?? language;
}

/** Turns a method path, slug, site path, or docs URL into the strings stored on `lookup_keys`. */
export function lookupCandidates(input: string): string[] {
  const trimmed = input.trim().split("#")[0]?.trim().replace(/\/+$/, "") ?? "";
  const values = new Set<string>();
  const add = (value: string) => {
    const normalized = value.trim();
    if (normalized) values.add(normalized);
  };

  add(trimmed);
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      add(`${url.origin}${url.pathname}`.replace(/\/+$/, ""));
      add(url.pathname.replace(/\/+$/, "") || "/");
    } catch {
      // Keep the raw value when it is not a URL.
    }
  }

  // A second pass picks up paths produced by stripping `/docs`.
  for (const value of [...values]) {
    if (value.startsWith("/docs/")) add(value.slice("/docs".length));
  }
  for (const value of [...values]) {
    if (value.startsWith("/reference/")) add(value.slice(1));
    if (value.startsWith("reference/")) add(`/${value}`);
  }
  return [...values];
}

export function quoteFilter(value: string): string {
  return `"${value.replace(/[\\"]/g, "\\$&")}"`;
}
