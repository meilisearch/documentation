import { vi } from "vitest";
import { Meilisearch, MeilisearchApiError } from "meilisearch";
import type { ChatUser } from "../../shared/user.ts";
import type { ChatConfig } from "../config.ts";
import { createSpanRecorder } from "../lib/meili.ts";
import { createSourcePool } from "../lib/sources.ts";
import type { AgentContext } from "../state.ts";

export const testConfig: ChatConfig = {
  openrouterKey: "openrouter-key",
  meiliUrl: "http://meili.test",
  meiliKey: "meili-key",
  voyageKey: "voyage-key",
  model: "openai/test",
  queryModel: "openai/test-fast",
  allowedOrigins: ["meilisearch.com", "*.meilisearch.com"],
  docsIndex: "docs-chunks",
  routesIndex: "api-routes",
  changelogIndex: "changelog-chunks",
  embedder: "voyage",
};

export const testUser: ChatUser = { codeLanguage: "JS" };

type Index = ReturnType<Meilisearch["index"]>;

export function fakeIndex(): Index {
  return { search: vi.fn() } as unknown as Index;
}

/** An AgentContext whose Meilisearch calls are mocks and whose pool and spans are real. */
export function fakeContext(partial: Partial<AgentContext> = {}): AgentContext & {
  meili: AgentContext["meili"] & {
    client: { multiSearch: ReturnType<typeof vi.fn> };
    docs: { search: ReturnType<typeof vi.fn> };
    routes: { search: ReturnType<typeof vi.fn> };
    changelog: { search: ReturnType<typeof vi.fn> };
  };
} {
  const docs = fakeIndex();
  const routes = fakeIndex();
  const changelog = fakeIndex();
  const client = { multiSearch: vi.fn(), index: vi.fn() } as unknown as Meilisearch;
  const context: AgentContext = {
    config: testConfig,
    user: testUser,
    meili: { client, docs, routes, changelog },
    spans: createSpanRecorder(),
    pool: createSourcePool(),
    details: {
      searches: [],
      byCall: new Map(),
      reads: new Map(),
      releaseLists: new Map(),
      opened: [],
    },
    answer: { text: "" },
    started: 0,
    ...partial,
  };
  if (partial.meili) context.meili = partial.meili;
  if (partial.details) context.details = partial.details;
  return context as ReturnType<typeof fakeContext>;
}

export function missingIndex(): MeilisearchApiError {
  return new MeilisearchApiError(new Response(null, { status: 404, statusText: "Not Found" }), {
    message: "Index `changelog-chunks` not found.",
    code: "index_not_found",
    type: "invalid_request",
    link: "https://docs.meilisearch.com/errors#index_not_found",
  });
}
