export type ChunkingConfig = {
  /** Headings at this depth or shallower start a new chunk. */
  splitDepth: number;
  maxChars: number;
  minChars: number;
};

export type EmbedderConfig = {
  name: string;
  model: string;
  apiKey: string;
  documentTemplateMaxBytes: number;
};

export type MeilisearchConfig = {
  host: string;
  apiKey: string;
  /** Guide and concept chunks, including code samples mounted on those pages. */
  indexUid: string;
  /** API route contracts. Separate from `indexUid` so route identifiers are not typo-matched. */
  routesIndexUid: string;
  /** Release notes. Separate so release dates can be a ranking rule without touching the docs. */
  changelogIndexUid: string;
  embedder: EmbedderConfig;
};

export type IngestConfig = {
  /** Absolute path of the docs root (where the navigation file and MDX pages live). */
  rootDir: string;
  /** Path of the navigation file, relative to `rootDir`. */
  navigation: string;
  /** Page globs (for example `changelog/**`) to skip. */
  exclude: string[];
  sources: { mdx: boolean; codeSamples: boolean; images: boolean };
  chunking: ChunkingConfig;
  /** Absolute path of the JSONL file written by dry runs of guide pages. */
  dryRunOutput: string;
  /** Absolute path of the JSONL file written by dry runs of API routes. */
  routesDryRunOutput: string;
  /** Absolute path of the JSONL file written by dry runs of changelog releases. */
  changelogDryRunOutput: string;
};

/** A code sample mounted on a guide page. `codes` only contains languages the snippet has. */
export type CodeSample = {
  /** Component name in the MDX source, for example "JoinsDefineRelationship1". */
  alias: string;
  /** Snippet key, for example "joins_define_relationship_1". */
  key: string;
  /** Canonical language key ("http", "js", "python") to source text. */
  codes: Record<string, string>;
};

export type RawPage = {
  /** Page path without extension, as listed in the navigation: "capabilities/personalization/overview". */
  page: string;
  tab: string;
  /** Navigation groups from outermost to innermost, joined with " > ". Empty when the page has no group. */
  group: string;
  frontmatter: { title: string; description?: string } & Record<string, unknown>;
  /** MDX source without frontmatter. */
  body: string;
  pageHash: string;
  /** Samples mounted in `body`, in source order. Empty when code samples are disabled. */
  samples?: CodeSample[];
};

export type Chunk = {
  id: string;
  page: string;
  page_hash: string;
  anchor: string | null;
  title: string;
  description: string;
  tab: string;
  group: string;
  hierarchy: string[];
  breadcrumb: string;
  content: string;
  content_type: "prose" | "code_sample" | "api_route";
  chunk_index: number;
  /** Language key to source. Set on code samples, and on the first chunk of an API route. */
  codes?: Record<string, string>;
  /**
   * Non-HTTP samples joined for search. `content` already holds the HTTP sample, and `codes` is an object,
   * which Meilisearch does not index.
   */
  code_text?: string;
  /** Changelog release, for example "v1.56". Searchable on the changelog index. */
  version_label?: string;
  /** ISO release date, for example "2025-08-04". Sortable on the changelog index. */
  released_on?: string;
  /** Top section of a release note, for example "New Features". */
  release_section?: string;
  /** Keys of `codes`. Filterable on the docs index. */
  code_language?: string[];
  /**
   * Exact lookup strings for an API route: method and path, page path, slug, site path, and canonical URL.
   * Filterable on the routes index.
   */
  lookup_keys?: string[];
  /** SDK call names from the route samples. Filterable on the routes index. */
  sdk_methods?: string[];
};

export type SyncOperation = { deletePages: string[]; chunks: Chunk[] };

export interface Sink {
  ensureSettings?(): Promise<void>;
  /** Map of page to page_hash for every page currently stored. */
  existingHashes(): Promise<Map<string, string>>;
  apply(op: SyncOperation): Promise<void>;
}
