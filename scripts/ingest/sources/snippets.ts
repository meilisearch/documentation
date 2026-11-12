import fs from "node:fs/promises";
import path from "node:path";
import { normalizeLanguage } from "../languages.ts";
import type { CodeSample } from "../types.ts";

export type Snippet = {
  /** Canonical language key to source text. Only languages present in the file. */
  codes: Record<string, string>;
  /** Raw snippet file, included in the page hash of every guide that mounts it. */
  source: string;
};

const FENCE = /```(\w+) ([^\n]*)\n([\s\S]*?)```/g;
const IMPORT =
  /^import\s+(\w+)\s+from\s+['"]\/snippets\/generated-code-samples\/code_samples_([A-Za-z0-9_]+)\.mdx['"]/gm;

/** Reads `snippets/generated-code-samples/*.mdx`. Missing directory yields an empty map. */
export async function loadSnippets(rootDir: string): Promise<Map<string, Snippet>> {
  const dir = path.join(rootDir, "snippets/generated-code-samples");
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return new Map();
    throw error;
  }

  const snippets = new Map<string, Snippet>();
  for (const file of files) {
    if (!file.startsWith("code_samples_") || !file.endsWith(".mdx")) continue;
    const key = file.slice("code_samples_".length, -".mdx".length);
    const source = await fs.readFile(path.join(dir, file), "utf8");
    snippets.set(key, { codes: parseSnippet(source), source });
  }
  return snippets;
}

/** One entry per fence label. The first fence wins when two labels normalize to the same key. */
export function parseSnippet(source: string): Record<string, string> {
  const codes: Record<string, string> = {};
  for (const match of source.matchAll(FENCE)) {
    const language = normalizeLanguage(match[2].trim() || match[1]);
    if (!language || codes[language]) continue;
    codes[language] = match[3].replace(/\s+$/, "");
  }
  return codes;
}

/**
 * Resolves `import Alias from '.../code_samples_<key>.mdx'` to `<Alias />` usages.
 * The component name is not always `CodeSamples…`; guides alias it.
 */
export function mountedSamples(body: string, snippets: Map<string, Snippet>): CodeSample[] {
  const found: { alias: string; key: string; index: number }[] = [];
  for (const match of body.matchAll(IMPORT)) {
    const alias = match[1];
    const key = match[2];
    if (!snippets.has(key)) continue;
    const use = new RegExp(`<${alias}(?=[\\s/>])`).exec(body);
    if (!use) continue;
    found.push({ alias, key, index: use.index });
  }
  found.sort((a, b) => a.index - b.index);

  const seen = new Set<string>();
  const samples: CodeSample[] = [];
  for (const item of found) {
    if (seen.has(item.alias)) continue;
    seen.add(item.alias);
    samples.push({ alias: item.alias, key: item.key, codes: snippets.get(item.key)!.codes });
  }
  return samples;
}
