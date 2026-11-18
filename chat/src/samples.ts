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

const METHOD_NAME = /^[A-Za-z_]\w*$/;

/** Drops one trailing `()` / `(...)` call so dots inside the arguments are not the callee separator. */
function stripTrailingCall(input: string): string {
  if (!input.endsWith(")")) return input;
  let depth = 0;
  let quote: '"' | "'" | null = null;
  let open = -1;
  for (let index = 0; index < input.length; index++) {
    const char = input[index];
    if (quote) {
      if (char === "\\") {
        index += 1;
        continue;
      }
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === "(") {
      if (depth === 0) open = index;
      depth += 1;
      continue;
    }
    if (char === ")" && depth > 0) {
      depth -= 1;
      if (depth === 0 && index === input.length - 1 && open >= 0) return input.slice(0, open).trimEnd();
    }
  }
  return input;
}

/** Last call-site identifier in a snippet, or [] when the input is not a method.
 *  `client.index('movies').updateEmbedders()` -> ["updateEmbedders"]
 *  A method path, slug, or URL returns [].
 */
export function methodCandidates(input: string): string[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const body = stripTrailingCall(trimmed);
  const separators = [
    { at: body.lastIndexOf("."), length: 1 },
    { at: body.lastIndexOf("::"), length: 2 },
    { at: body.lastIndexOf("->"), length: 2 },
  ].filter((separator) => separator.at >= 0);

  if (separators.length === 0) {
    const bare = body.split("<")[0] ?? "";
    return METHOD_NAME.test(bare) ? [bare] : [];
  }

  const last = separators.reduce((best, separator) =>
    separator.at + separator.length > best.at + best.length ? separator : best,
  );
  let candidate = body.slice(last.at + last.length);
  const cut = candidate.search(/[(\[{<\s]/);
  if (cut >= 0) candidate = candidate.slice(0, cut);
  if (
    candidate.length >= 2 &&
    ((candidate.startsWith('"') && candidate.endsWith('"')) || (candidate.startsWith("'") && candidate.endsWith("'")))
  ) {
    candidate = candidate.slice(1, -1);
  }
  return METHOD_NAME.test(candidate) ? [candidate] : [];
}
