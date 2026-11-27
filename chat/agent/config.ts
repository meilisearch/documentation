export const DEFAULT_MODEL = "openai/gpt-6-luna";
export const DEFAULT_QUERY_MODEL = "openai/gpt-6-luna";
/** Reasoning ciphertext only decrypts on the upstream that created it. */
export const OPENAI_PROVIDER = { only: ["openai"], allow_fallbacks: false };
const DEFAULT_ALLOWED_ORIGINS = "meilisearch.com,*.meilisearch.com,*.mintlify.site";

export const MAX_MESSAGES = 30;
export const MAX_TEXT_LENGTH = 4000;
/** About 8k tokens. Safety net for the largest pages. */
export const MAX_PAGE_CHARS = 30_000;
/** Default `pagination.maxTotalHits`. */
export const MAX_PAGE_CHUNKS = 1000;
/** Federated multi-search pool. Meilisearch merges docs and routes by ranking score. */
export const RETRIEVE = 50;
/** Guardrail for the tool loop. Unused steps are not called. */
export const STEP_BUDGET = 8;

export type ChatConfig = {
  openrouterKey: string | undefined;
  meiliUrl: string | undefined;
  meiliKey: string | undefined;
  voyageKey: string | undefined;
  model: string;
  queryModel: string;
  allowedOrigins: string[];
  docsIndex: string;
  routesIndex: string;
  changelogIndex: string;
  embedder: string;
  posthogToken: string | undefined;
  posthogHost: string | undefined;
};

/** Reads every setting once. Empty strings fall back to the defaults. */
export function readConfig(env: NodeJS.ProcessEnv = process.env): ChatConfig {
  return {
    openrouterKey: env.OPENROUTER_API_KEY,
    meiliUrl: env.MEILISEARCH_URL,
    meiliKey: env.MEILISEARCH_KEY,
    voyageKey: env.VOYAGE_API_KEY,
    model: env.CHAT_MODEL || DEFAULT_MODEL,
    queryModel: env.CHAT_QUERY_MODEL || DEFAULT_QUERY_MODEL,
    allowedOrigins: (env.CHAT_ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS)
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
    docsIndex: env.MEILISEARCH_DOCS_INDEX || "docs-chunks",
    routesIndex: env.MEILISEARCH_ROUTES_INDEX || "api-routes",
    changelogIndex: env.MEILISEARCH_CHANGELOG_INDEX || "changelog-chunks",
    embedder: env.MEILISEARCH_EMBEDDER || "voyage",
    posthogToken: env.POSTHOG_PROJECT_TOKEN,
    posthogHost: env.POSTHOG_HOST,
  };
}

/** Env var names that are unset. The check matches what the process actually has. */
export function missingSettings(env: NodeJS.ProcessEnv = process.env): string[] {
  return (["OPENROUTER_API_KEY", "MEILISEARCH_URL", "MEILISEARCH_KEY", "VOYAGE_API_KEY"] as const).filter(
    (name) => !env[name],
  );
}
