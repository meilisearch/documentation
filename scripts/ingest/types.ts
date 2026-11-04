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
  indexUid: string;
  embedder: EmbedderConfig;
};

export type IngestConfig = {
  /** Absolute path of the docs root (where the navigation file and MDX pages live). */
  rootDir: string;
  baseUrl: string;
  /** Path of the navigation file, relative to `rootDir`. */
  navigation: string;
  /** Page globs (for example `changelog/**`) to skip. */
  exclude: string[];
  sources: { mdx: boolean; codeSamples: boolean; images: boolean };
  chunking: ChunkingConfig;
  /** Absolute path of the JSONL file written by dry runs. */
  dryRunOutput: string;
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
};

export type Chunk = {
  id: string;
  page: string;
  page_hash: string;
  url: string;
  anchor: string | null;
  title: string;
  description: string;
  tab: string;
  group: string;
  hierarchy: string[];
  breadcrumb: string;
  content: string;
  content_type: "prose";
  chunk_index: number;
};

export type SyncOperation = { deletePages: string[]; chunks: Chunk[] };

export interface Sink {
  ensureSettings?(): Promise<void>;
  /** Map of page to page_hash for every page currently stored. */
  existingHashes(): Promise<Map<string, string>>;
  apply(op: SyncOperation): Promise<void>;
}
