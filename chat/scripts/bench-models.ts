import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, tool } from "ai";
import { z } from "zod";

const RUNS = 3;
const TARGET_CONTEXT_CHARS = 40_000;

const HYBRID_QUESTION = "How do I set up hybrid search?";
const QUESTIONS = [
  HYBRID_QUESTION,
  "How do I add a Next.js ecommerce search with filters, sorting, and InstantSearch?",
  "How do I add documents and update filterable attributes with the JavaScript SDK?",
] as const;

const QUERY_MODELS = ["openai/gpt-6-luna", "openai/gpt-6.1-terra"] as const;
const QUERY_EFFORTS = ["none", "low"] as const;
const ANSWER_MODELS = ["openai/gpt-6-luna", "openai/gpt-6.1-terra", "openai/gpt-6.2-sol"] as const;

type ReasoningEffort = (typeof QUERY_EFFORTS)[number];
type OpenRouterClient = ReturnType<typeof createOpenRouter>;

const QUERY_SYSTEM = `You search the Meilisearch documentation. Call the search tool before answering. Write 1 short, keyword-rich query of about 12 words at most. If the question has distinct parts, call search twice in the same turn, one query per part. Do not answer in prose.`;

const ANSWER_SYSTEM = `You are the Meilisearch documentation assistant. Answer only from the documentation context in the user message. Be concise. Link sources as Markdown using only URLs that appear in the context. If the context does not contain the answer, say so. Write for readers who may not be native English speakers.`;

const search = tool({
  description: "Search the Meilisearch documentation.",
  inputSchema: z.object({
    q: z.string(),
  }),
});

type DocChunk = {
  title: string;
  url: string;
  body: string;
};

const DOC_CHUNKS: readonly DocChunk[] = [
  {
    title: "Getting started with hybrid search",
    url: "https://www.meilisearch.com/docs/capabilities/hybrid_search/getting_started",
    body: `Hybrid search mixes keyword search and semantic search in one request. Keyword search matches words. Semantic search matches meaning, using vectors called embeddings. Meilisearch creates those embeddings with an embedder.

Setup has three parts. First, choose an index, such as movies or products. Second, add an embedder to the index settings and wait until that task succeeds. Third, send a search request that includes both q and hybrid.

A first OpenAI embedder looks like this:

{
  "embedders": {
    "movies-openai": {
      "source": "openAi",
      "model": "text-embedding-3-small",
      "apiKey": "YOUR_OPENAI_API_KEY",
      "documentTemplate": "A movie titled '{{doc.title}}'. {{doc.overview}}"
    }
  }
}

Send that object with PATCH /indexes/movies/settings. The source must be openAi for OpenAI's built-in integration. The model text-embedding-3-small is a common, lower-cost choice. text-embedding-3-large is larger and more precise. The apiKey is your OpenAI key, not the Meilisearch key. The documentTemplate is a Liquid template. It tells Meilisearch which fields to embed. Keep it short. Include title, overview, or description. Skip prices, ids, and other fields that have no meaning for similarity.

After the settings task succeeds, Meilisearch embeds the documents already in the index. New and updated documents are embedded automatically. Embeddings are cached, so unchanged documents are not sent to the provider again.

The first hybrid search is a normal search plus a hybrid object:

{
  "q": "film about a spirit world",
  "hybrid": {
    "embedder": "movies-openai",
    "semanticRatio": 0.5
  }
}

embedder must be the name you configured. semanticRatio 0.5 gives equal weight to keywords and meaning. You can also set rankingScoreThreshold, for example 0.5, to drop weak semantic hits. Use the same index you configured. Wait for embedding tasks before you judge result quality.`,
  },
  {
    title: "Configure an embedder",
    url: "https://www.meilisearch.com/docs/capabilities/hybrid_search/configuring_embedders",
    body: `An embedder is a named configuration on an index. The name is yours. movies-openai and products are both fine. One index can store several embedders, but each search picks one embedder name.

OpenAI fields:

- source: openAi
- model: text-embedding-3-small (1536 dimensions) or text-embedding-3-large (3072 dimensions)
- apiKey: the OpenAI API key
- documentTemplate: Liquid text built from document fields
- dimensions: optional. Lower it, for example to 512, to save space. Very small values can hurt quality.
- distribution: optional. It rescales semantic scores. mean is the score you treat as somewhat relevant. sigma is the typical gap between relevance tiers. Changing distribution does not re-embed documents.

You can also use a user-provided embedder when your application computes vectors:

{
  "embedders": {
    "manual": {
      "source": "userProvided",
      "dimensions": 1536
    }
  }
}

Documents then include a _vectors field:

{
  "id": 1,
  "title": "Spirited Away",
  "overview": "Chihiro enters a world of spirits.",
  "_vectors": {
    "manual": [0.012, -0.044, 0.381]
  }
}

The array length must equal dimensions. Queries are not embedded by Meilisearch for this source. Pass the query vector yourself, or use a provider source so Meilisearch embeds the query.

Other built-in sources include huggingFace, mistral, google, cohere, voyage, ollama, and rest. Each source has its own required fields. The rest source calls an HTTP embedding endpoint you host. For a first setup, prefer openAi or userProvided.

Update embedders with the settings route or with the embedders sub-route. Both replace the embedders object you send:

PATCH /indexes/movies/settings/embedders

JavaScript:

const task = await index.updateEmbedders({
  "movies-openai": {
    source: "openAi",
    model: "text-embedding-3-small",
    apiKey: process.env.OPENAI_API_KEY,
    documentTemplate: "A movie titled '{{doc.title}}'. {{doc.overview}}",
  },
});
await task.waitTask();

Store provider API keys on the server. Do not commit them. A free-tier OpenAI key can make indexing slow. Meilisearch retries rate limits, and a higher tier is safer for production.

Changing source, model, dimensions, or documentTemplate embeds documents again. Plan for that task to take time on large indexes.`,
  },
  {
    title: "Choose semanticRatio",
    url: "https://www.meilisearch.com/docs/capabilities/hybrid_search/semantic_ratio",
    body: `semanticRatio is a number from 0.0 to 1.0 on the hybrid object. You set it on each search, not in the index settings.

- 0.0 uses keyword results only.
- 0.5 blends keyword and semantic results equally. This is the default when you omit semanticRatio but still pass hybrid.embedder.
- 1.0 uses semantic results only.
- 0.7 favors meaning. 0.3 favors exact words.

Start at 0.5. Collect queries that look wrong, then move in steps of 0.1.

If a shopper searches for a brand or sku and the exact product is not first, the ratio is too high. Lower it toward 0.3 so keywords win. If a shopper describes a need, such as "something to mix cake batter", and only exact word matches appear, the ratio is too low. Raise it toward 0.7 so similar products can surface.

Examples:

Brand query, keyword leaning:

{
  "q": "KitchenAid mixer",
  "hybrid": { "semanticRatio": 0.3, "embedder": "products" }
}

Descriptive query, semantic leaning:

{
  "q": "something to mix cake batter",
  "hybrid": { "semanticRatio": 0.7, "embedder": "products" }
}

Balanced query:

{
  "q": "stand mixer for baking",
  "hybrid": { "semanticRatio": 0.5, "embedder": "products" }
}

Different screens can use different ratios against the same embedder. A site search box can stay near 0.5. A "similar products" block can use a higher ratio. You do not reindex when you only change semanticRatio.

If semantic hits all look somewhat relevant, adjust the embedder distribution so strong hits score near 1 and weak hits score near 0. Then set rankingScoreThreshold on the search request to hide hits under that score. Threshold 0 returns every hit. Threshold 1 keeps near-perfect matches. 0.5 is a practical start. distribution and rankingScoreThreshold do not replace semanticRatio. Ratio chooses the blend. The threshold drops low scores after ranking.`,
  },
  {
    title: "Index documents for hybrid search",
    url: "https://www.meilisearch.com/docs/capabilities/hybrid_search/indexing",
    body: `Hybrid search needs documents in the index and embeddings for those documents. Order the work so you do not search an index that is still embedding.

1. Create the index if it does not exist.
2. Add the embedder and wait until the settings task is succeeded.
3. Add or update documents and wait until those tasks succeed.
4. Search with hybrid.

If the index already has documents, saving the embedder is enough to start embedding them. You do not have to upload the documents again. If you add documents before the embedder exists, Meilisearch embeds them when you later save the embedder.

JavaScript:

const client = new Meilisearch({
  host: "http://127.0.0.1:7700",
  apiKey: "MASTER_OR_ADMIN_KEY",
});
const index = client.index("movies");

await index.addDocuments([
  { id: 1, title: "Spirited Away", overview: "Chihiro enters a world of spirits." },
  { id: 2, title: "The Grand Budapest Hotel", overview: "A concierge is framed for murder." },
]).then((task) => task.waitTask());

Primary keys should be stable. Reusing an id updates that document and refreshes its embedding when the template text changes.

Watch task status with GET /tasks or task.waitTask(). Search while status is enqueued or processing and semantic hits will be missing or stale. Keyword search can still return documents that are already indexed.

The document template only sees fields present on each document. If overview is missing, that part of the template is empty and the vector is weaker. Prefer a few text fields that describe the record. Do not paste the whole document, binary data, or long HTML if a short description exists.

Code and API reference pages in a docs index follow the same rule. Put the title and the passage in the template. Leave urls and anchors out of the embedding text if they are only identifiers, but keep them in the document so you can display them.

User-provided vectors must be present at index time. A document without _vectors.manual is not semantically searchable for that embedder. Provider sources do not accept _vectors for the same embedder name. Do not mix a provider source and a hand-written vector under one embedder.

Large batches are normal. Meilisearch chunks provider calls. Failed batches appear as failed tasks. Fix the key, the model name, or the template, then retry the task or update the documents again.`,
  },
  {
    title: "Send a hybrid search request",
    url: "https://www.meilisearch.com/docs/capabilities/hybrid_search/search_request",
    body: `The search route is the same route as keyword search. Hybrid mode is the hybrid field on that body.

POST /indexes/movies/search
Content-Type: application/json
Authorization: Bearer MEILISEARCH_SEARCH_KEY

{
  "q": "film about a spirit world",
  "hybrid": {
    "embedder": "movies-openai",
    "semanticRatio": 0.5
  },
  "limit": 10,
  "attributesToRetrieve": ["id", "title", "overview"],
  "showRankingScore": true
}

q is the user text. hybrid.embedder is required for hybrid search. If the name does not match an embedder on the index, the request fails. semanticRatio is optional and defaults to 0.5.

JavaScript SDK:

const results = await index.search("film about a spirit world", {
  hybrid: {
    embedder: "movies-openai",
    semanticRatio: 0.5,
  },
  limit: 10,
  attributesToRetrieve: ["id", "title", "overview"],
  showRankingScore: true,
});

results.hits are the merged list. A high _rankingScore is a better match when showRankingScore is true. Scores are comparable only after you understand that embedder's distribution. Do not treat 0.2 on one model as equal to 0.2 on another.

You may combine hybrid with filter and sort when those settings exist. The filter still uses filterable attributes. The hybrid object does not turn a field into a filter. See the filterable attributes page for that setup. A search key is enough for this request. Updating embedders needs a key that can change settings.

cURL shape:

curl -X POST 'MEILISEARCH_URL/indexes/movies/search' \\
  -H 'Authorization: Bearer SEARCH_KEY' \\
  -H 'Content-Type: application/json' \\
  --data-binary '{
    "q": "film about a spirit world",
    "hybrid": { "embedder": "movies-openai", "semanticRatio": 0.5 }
  }'

Empty q with a hybrid embedder still runs a semantic search only if you pass a vector for a user-provided embedder. For OpenAI, send a non-empty q so Meilisearch can embed the query. Very long queries cost more and rarely rank better than a short description of the need.

Pagination uses limit and offset, as with keyword search. Facets, if configured, are independent of the embedder. Request only the attributes you render.`,
  },
  {
    title: "Filterable attributes",
    url: "https://www.meilisearch.com/docs/learn/filtering_and_sorting/filterable_attributes",
    body: `Filters are not hybrid search. A filter keeps or removes documents before ranking. You must list every field you filter on in filterableAttributes. Until that task succeeds, filters on that field return an error.

PATCH /indexes/movies/settings

{
  "filterableAttributes": ["genres", "releaseYear", "language"]
}

JavaScript:

await index.updateFilterableAttributes([
  "genres",
  "releaseYear",
  "language",
]).then((task) => task.waitTask());

A search can then send a filter expression:

{
  "q": "drama",
  "filter": "genres = drama AND releaseYear > 2000"
}

Strings can be quoted. Numbers are compared with =, !=, >, >=, <, <=. Use AND, OR, and NOT to combine clauses. Array fields match if any element matches. Changing filterable attributes reindexes those fields. It does not create embeddings and it does not set semanticRatio.

Sortable attributes are a separate list. Add releaseYear to sortableAttributes before you send sort: ["releaseYear:desc"]. Filterable does not imply sortable.

Displayed attributes control which fields come back in hits. Searchable attributes control which fields keyword search scans. Neither setting configures an embedder. The document template is the only place that chooses fields for embeddings.

If a product index needs color and price filters, declare those attributes, wait for the task, then add "filter" to the search body. You can do that on a keyword search or on a hybrid search. The filter syntax stays the same. Hybrid does not accept a filter inside the hybrid object. Put filter next to q.`,
  },
  {
    title: "API keys",
    url: "https://www.meilisearch.com/docs/learn/security/api_keys",
    body: `Meilisearch checks the Authorization bearer token on every route except health. The master key is the key you set when the server starts, often with MEILI_MASTER_KEY. It can create other keys and can do every action. Use it only on a trusted server. Do not ship it in a browser or a mobile app.

Create a narrower key with POST /keys:

{
  "name": "Docs search",
  "description": "Search the public docs index",
  "actions": ["search"],
  "indexes": ["docs"],
  "expiresAt": null
}

actions limit what the key can call. search allows search and multi-search. documents.add allows indexing. settings.update allows embedder and filterable attribute changes. indexes limits which index uids the key can touch. ["*"] means every index. expiresAt is an ISO date or null.

A public site needs a search-only key. Hybrid search from the browser uses that key. It still cannot PATCH settings or read your OpenAI key. The OpenAI key lives in the embedder settings on the server.

An admin key used by a backend worker can update embedders and add documents. Give that key indexes: ["movies"] if it should not touch other indexes. Rotate a key by creating a new one and deleting the old uid. Deleting the master key is not how you rotate it. Change the server environment and restart.

Requests without a token fail when a master key is set. Requests with a key that lacks settings.update cannot configure hybrid search. Requests with a search key can send hybrid at query time, because that is a search, as long as the embedder already exists.

Keys do not select semanticRatio, document templates, or models. They only authorize the route.`,
  },
];

function renderChunk(chunk: DocChunk): string {
  return `## ${chunk.title}\n${chunk.url}\n\n${chunk.body.trim()}\n`;
}

function buildDocumentationContext(): string {
  const bundle = DOC_CHUNKS.map(renderChunk).join("\n");
  if (bundle.length === 0) {
    throw new Error("Documentation context is empty.");
  }

  const parts: string[] = [];
  let total = 0;
  let copy = 1;
  while (total < TARGET_CONTEXT_CHARS) {
    const header =
      copy === 1
        ? ""
        : `\n## Documentation bundle copy ${copy}\nThe sections below repeat the same Meilisearch documentation excerpts.\n\n`;
    const block = `${header}${bundle}`;
    if (block.length === 0) {
      throw new Error("Documentation context stopped growing.");
    }
    parts.push(block);
    total += block.length;
    copy += 1;
    if (copy > 40) {
      throw new Error("Documentation context did not reach 40000 characters.");
    }
  }

  let context = parts.join("\n");
  if (context.length > 42_000) {
    const cut = context.lastIndexOf("\n", 40_800);
    if (cut >= TARGET_CONTEXT_CHARS) {
      context = `${context.slice(0, cut).trimEnd()}\n`;
    }
  }
  return context;
}

function answerUserMessage(context: string): string {
  return `${HYBRID_QUESTION}\n\nDocumentation context:\n\n${context}`;
}

function median(values: readonly number[]): number {
  const sorted = [...values].sort((left, right) => left - right);
  const middle = sorted[Math.floor(sorted.length / 2)];
  if (middle === undefined) {
    throw new Error("Cannot take the median of an empty list of timings.");
  }
  return middle;
}

function slowest(values: readonly number[]): number {
  const first = values[0];
  if (first === undefined) {
    throw new Error("A run produced no timings.");
  }
  return values.reduce((max, value) => (value > max ? value : max), first);
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function modelSettings(effort: ReasoningEffort) {
  return {
    reasoning: { effort },
    provider: { sort: "latency" as const },
    // OpenRouter includes reasoning token counts in the stream when usage accounting is on.
    usage: { include: true },
  };
}

function latencyProviderOptions() {
  return {
    openrouter: {
      provider: { sort: "latency" },
    },
  };
}

type QueryTiming = {
  question: string;
  ms: number;
  inputs: string[];
  text: string;
  error: string | undefined;
};

async function timeQuery(
  openrouter: OpenRouterClient,
  modelId: string,
  effort: ReasoningEffort,
  question: string,
): Promise<QueryTiming> {
  const started = performance.now();
  const elapsed = (): number => Math.round(performance.now() - started);
  let toolCallMs: number | undefined;
  const inputs: string[] = [];
  let text = "";
  let error: string | undefined;

  try {
    const result = streamText({
      model: openrouter.chat(modelId, modelSettings(effort)),
      system: QUERY_SYSTEM,
      prompt: question,
      tools: { search },
      toolChoice: "required",
      maxRetries: 0,
      providerOptions: latencyProviderOptions(),
      onError: ({ error: streamError }) => {
        console.error(streamError);
        if (error === undefined) error = errorMessage(streamError);
      },
    });

    for await (const part of result.fullStream) {
      if (part.type === "text-delta") {
        text += part.text;
      } else if (part.type === "tool-call") {
        if (toolCallMs === undefined) toolCallMs = elapsed();
        inputs.push(JSON.stringify(part.input));
      } else if (part.type === "error") {
        console.error(part.error);
        if (error === undefined) error = errorMessage(part.error);
      }
    }
  } catch (caught) {
    console.error(caught);
    if (error === undefined) error = errorMessage(caught);
  }

  return {
    question,
    ms: toolCallMs ?? elapsed(),
    inputs,
    text,
    error,
  };
}

function printQueryTiming(result: QueryTiming): void {
  const labels: string[] = [];
  if (result.error !== undefined) labels.push("ERROR");
  if (result.inputs.length === 0) labels.push("NO TOOL CALL");
  const prefix = labels.length === 0 ? "" : `  ${labels.join("  ")}`;
  console.log(`  ${result.ms} ms${prefix}  ${result.question}`);
  if (result.error !== undefined) console.log(`    ${result.error}`);
  for (const input of result.inputs) console.log(`    ${input}`);
  if (result.inputs.length === 0 && result.text.trim() !== "") {
    console.log(`    ${result.text}`);
  }
}

type AnswerTiming = {
  ms: number;
  answer: string;
  reasoningTokens: number | undefined;
  sawText: boolean;
  error: string | undefined;
};

async function timeAnswer(
  openrouter: OpenRouterClient,
  modelId: string,
  userMessage: string,
): Promise<AnswerTiming> {
  const started = performance.now();
  const elapsed = (): number => Math.round(performance.now() - started);
  let firstTextMs: number | undefined;
  let answer = "";
  let reasoningTokens: number | undefined;
  let error: string | undefined;

  try {
    const result = streamText({
      model: openrouter.chat(modelId, modelSettings("low")),
      system: ANSWER_SYSTEM,
      prompt: userMessage,
      maxRetries: 0,
      providerOptions: latencyProviderOptions(),
      onError: ({ error: streamError }) => {
        console.error(streamError);
        if (error === undefined) error = errorMessage(streamError);
      },
    });

    for await (const part of result.fullStream) {
      if (part.type === "text-delta") {
        if (firstTextMs === undefined) firstTextMs = elapsed();
        answer += part.text;
      } else if (part.type === "finish-step") {
        const tokens = part.usage.outputTokenDetails.reasoningTokens;
        if (tokens !== undefined) reasoningTokens = tokens;
      } else if (part.type === "finish") {
        const tokens = part.totalUsage.outputTokenDetails.reasoningTokens;
        if (tokens !== undefined) reasoningTokens = tokens;
      } else if (part.type === "error") {
        console.error(part.error);
        if (error === undefined) error = errorMessage(part.error);
      }
    }

    try {
      const usage = await result.usage;
      const tokens = usage.outputTokenDetails.reasoningTokens;
      if (tokens !== undefined) reasoningTokens = tokens;
    } catch (usageError) {
      console.error(usageError);
    }
  } catch (caught) {
    console.error(caught);
    if (error === undefined) error = errorMessage(caught);
  }

  return {
    ms: firstTextMs ?? elapsed(),
    answer,
    reasoningTokens,
    sawText: firstTextMs !== undefined,
    error,
  };
}

function printAnswerTiming(run: number, result: AnswerTiming): void {
  const label = result.sawText ? "first text" : "no text";
  const errorLabel = result.error !== undefined ? "  ERROR" : "";
  console.log(`Run ${run}`);
  console.log(`  ${result.ms} ms  ${label}${errorLabel}`);
  if (result.error !== undefined) console.log(`    ${result.error}`);
  const tokens = result.reasoningTokens === undefined ? "unavailable" : String(result.reasoningTokens);
  console.log(`  reasoning tokens: ${tokens}`);
  console.log("  answer:");
  console.log(result.answer.trim() === "" ? "(empty)" : result.answer);
  console.log("");
}

function printSummary(rows: readonly { setup: string; medianMs: number }[]): void {
  const header = "setup";
  const width = Math.max(header.length, ...rows.map((row) => row.setup.length));
  console.log("");
  console.log("=== Summary ===");
  console.log(`${header.padEnd(width)}  median ms`);
  for (const row of rows) {
    console.log(`${row.setup.padEnd(width)}  ${String(row.medianMs).padStart(9)}`);
  }
}

async function main(): Promise<void> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (apiKey === undefined || apiKey === "") {
    console.error("OPENROUTER_API_KEY is missing. Set it in .env.local in the chat directory.");
    process.exit(1);
  }

  const context = buildDocumentationContext();
  const userMessage = answerUserMessage(context);
  const openrouter = createOpenRouter({ apiKey });
  const summary: { setup: string; medianMs: number }[] = [];

  console.log("OpenRouter model benchmark");
  console.log('Provider routing on every call: { "provider": { "sort": "latency" } }');
  console.log(`Runs per setup: ${RUNS}`);
  console.log("Query timing: first tool-call. A run is the slowest of the 3 questions.");
  console.log("Answer timing: first text-delta. Median: middle of the 3 run times.");

  for (const modelId of QUERY_MODELS) {
    for (const effort of QUERY_EFFORTS) {
      const setup = `query | ${modelId} | reasoning ${effort}`;
      console.log("");
      console.log(`=== ${setup} ===`);
      const runTimes: number[] = [];
      for (let run = 1; run <= RUNS; run += 1) {
        console.log(`Run ${run}`);
        const questionTimes: number[] = [];
        for (const question of QUESTIONS) {
          const timing = await timeQuery(openrouter, modelId, effort, question);
          questionTimes.push(timing.ms);
          printQueryTiming(timing);
        }
        const runMs = slowest(questionTimes);
        runTimes.push(runMs);
        console.log(`  run ${runMs} ms`);
      }
      const medianMs = median(runTimes);
      console.log(`median ${medianMs} ms`);
      console.log(`runs ${runTimes.map((ms) => `${ms} ms`).join(", ")}`);
      summary.push({ setup, medianMs });
    }
  }

  console.log("");
  console.log(`Documentation context: ${context.length} characters`);

  for (const modelId of ANSWER_MODELS) {
    const setup = `answer | ${modelId} | reasoning low`;
    console.log("");
    console.log(`=== ${setup} ===`);
    const runTimes: number[] = [];
    for (let run = 1; run <= RUNS; run += 1) {
      const timing = await timeAnswer(openrouter, modelId, userMessage);
      runTimes.push(timing.ms);
      printAnswerTiming(run, timing);
    }
    const medianMs = median(runTimes);
    console.log(`median ${medianMs} ms`);
    console.log(`runs ${runTimes.map((ms) => `${ms} ms`).join(", ")}`);
    summary.push({ setup, medianMs });
  }

  printSummary(summary);
}

await main();
