import { MeilisearchApiError, type EnqueuedTask, type Meilisearch, type Settings, type Task } from "meilisearch";
import type { Chunk, EmbedderConfig, Sink, SyncOperation } from "../types.ts";

export function buildSettings(embedder?: EmbedderConfig | null): Settings {
  const settings: Settings = {
    filterableAttributes: ["page", "tab", "group", "content_type"],
    searchableAttributes: ["title", "hierarchy", "content", "description"],
    sortableAttributes: ["chunk_index"],
  };
  if (embedder) {
    settings.embedders = {
      [embedder.name]: {
        source: "rest",
        apiKey: embedder.apiKey,
        url: "https://api.voyageai.com/v1/embeddings",
        request: { model: embedder.model, input: ["{{text}}", "{{..}}"] },
        response: { data: [{ embedding: "{{embedding}}" }, "{{..}}"] },
        documentTemplate: "{{doc.breadcrumb}}\n{{doc.content}}",
        documentTemplateMaxBytes: embedder.documentTemplateMaxBytes,
      },
    };
  }
  return settings;
}

const TASK_TIMEOUT_MS = 10 * 60 * 1000;
const FILTER_BATCH_SIZE = 100;

function batches<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
  return result;
}

function assertSucceeded(task: Task): void {
  if (task.status !== "succeeded") {
    throw new Error(`Meilisearch task ${task.uid} ${task.status}: ${task.error?.message ?? "no error message"}`);
  }
}

function isPermissionError(error: unknown): boolean {
  if (!(error instanceof MeilisearchApiError)) return false;
  return (
    error.response.status === 401 ||
    error.response.status === 403 ||
    error.cause?.code === "invalid_api_key" ||
    error.cause?.code === "missing_authorization_header"
  );
}

export type MeilisearchSinkOptions = {
  client: Meilisearch;
  indexUid: string;
  embedder?: EmbedderConfig | null;
  batchSize?: number;
};

export class MeilisearchSink implements Sink {
  readonly #client: Meilisearch;
  readonly #indexUid: string;
  readonly #embedder: EmbedderConfig | null;
  readonly #batchSize: number;

  constructor(options: MeilisearchSinkOptions) {
    this.#client = options.client;
    this.#indexUid = options.indexUid;
    this.#embedder = options.embedder ?? null;
    this.#batchSize = options.batchSize ?? 500;
  }

  async ensureSettings(): Promise<void> {
    try {
      const creation = await this.#client
        .createIndex(this.#indexUid, { primaryKey: "id" })
        .waitTask({ timeout: TASK_TIMEOUT_MS });
      if (creation.error?.code !== "index_already_exists") assertSucceeded(creation);
      const update = await this.#client
        .index(this.#indexUid)
        .updateSettings(buildSettings(this.#embedder))
        .waitTask({ timeout: TASK_TIMEOUT_MS });
      assertSucceeded(update);
    } catch (cause) {
      if (isPermissionError(cause)) {
        throw new Error(
          "MEILISEARCH_API_KEY lacks admin permissions (needs indexes.create, settings.update, documents.*, tasks.get)",
          { cause },
        );
      }
      throw cause;
    }
  }

  async existingHashes(): Promise<Map<string, string>> {
    const index = this.#client.index<Pick<Chunk, "page" | "page_hash">>(this.#indexUid);
    const hashes = new Map<string, string>();
    const limit = 1000;
    try {
      for (let offset = 0; ; offset += limit) {
        const response = await index.getDocuments({ fields: ["page", "page_hash"], limit, offset });
        for (const document of response.results) hashes.set(document.page, document.page_hash);
        if (response.results.length < limit) break;
      }
    } catch (error) {
      if (error instanceof MeilisearchApiError && error.cause?.code === "index_not_found") {
        return new Map();
      }
      throw error;
    }
    return hashes;
  }

  async apply(op: SyncOperation): Promise<void> {
    const index = this.#client.index<Chunk>(this.#indexUid);
    const enqueued: EnqueuedTask[] = [];
    for (const pages of batches(op.deletePages, FILTER_BATCH_SIZE)) {
      const values = pages.map((page) => `"${page.replace(/[\\"]/g, "\\$&")}"`).join(", ");
      enqueued.push(await index.deleteDocuments({ filter: `page IN [${values}]` }));
    }
    for (const chunks of batches(op.chunks, this.#batchSize)) {
      enqueued.push(await index.addDocuments(chunks, { primaryKey: "id" }));
    }
    const tasks = await this.#client.tasks.waitForTasks(enqueued, { timeout: TASK_TIMEOUT_MS });
    for (const task of tasks) assertSucceeded(task);
  }
}
