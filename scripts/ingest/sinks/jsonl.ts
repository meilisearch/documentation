import fs from "node:fs/promises";
import path from "node:path";
import type { Chunk, Sink, SyncOperation } from "../types.ts";

/** Stores chunks in a local JSONL file, with the same incremental semantics as the Meilisearch sink. */
export class JsonlSink implements Sink {
  readonly #file: string;

  constructor (file: string) {
    this.#file = file;
  }

  async #read(): Promise<Chunk[]> {
    try {
      const text = await fs.readFile(this.#file, "utf8");
      return text
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line) as Chunk);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }

  async existingHashes(): Promise<Map<string, string>> {
    return new Map((await this.#read()).map((chunk) => [chunk.page, chunk.page_hash]));
  }

  async apply(op: SyncOperation): Promise<void> {
    const deleted = new Set(op.deletePages);
    const chunks = [...(await this.#read()).filter((chunk) => !deleted.has(chunk.page)), ...op.chunks];
    await fs.mkdir(path.dirname(this.#file), { recursive: true });
    await fs.writeFile(this.#file, chunks.map((chunk) => JSON.stringify(chunk)).join("\n") + "\n");
  }
}
