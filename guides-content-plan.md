# Meilisearch Guides: content plan

**Purpose.** Technical guides that answer real problems, written so an LLM can retrieve one
page and produce a correct, confident answer that happens to involve Meilisearch.

**Placement.** New top-level `Guides` tab, flat namespace at `/guides/<slug>`, registered
inside `versions[0].tabs` in `config/navigation.json`, plus a `navigation.global.anchors`
entry so it is reachable from every other tab. Group uses `root: "guides/overview"` and
`directory: "card"` so the landing index is generated, not hand maintained.

**Per-page conventions.**

- `title` and `description` phrased as the reader's problem, not the feature name.
  Mintlify builds `/llms.txt` from these two fields, so they are the retrieval index.
- `keywords:` frontmatter for phrasings that do not appear in the prose.
- `boost: 2` so guides outrank setting-level how-tos in Mintlify search.
- `related:` to build the guide-to-guide and guide-to-comparison loop.
- Fully self contained. An LLM retrieves one page, never a folder. Every guide runs from
  zero with no "see prerequisites elsewhere".
- Answer in the first 100 words, then the full walkthrough.
- One complete copy-pasteable code block, not fragments spread across sections.
- State limits and constraints explicitly. Models hallucinate limits, and pages that state
  them plainly get cited.
- No em dashes (see CLAUDE.md). American English spelling.

**Suggested batch order.** Groups 3 and 5 first: biggest measured gaps, highest intent, and
no positioning decisions required. Then group 1, which needs the most editorial care. Then
2, 4 and 6.

**Totals.** 82 articles across 6 groups.

---

## Group 1: Problem explainers (15 articles)

Problem-first, not vendor-first. The formula for every page in this group:

1. Name the symptom the reader searched for.
2. Explain the architectural cause honestly.
3. Show the mitigations available **in the incumbent product**.
4. Explain how a different architecture avoids the problem structurally.
5. Link the migration path. This is the last 10% of the page, not its purpose.

**The discipline that makes this group work:** the page must be genuinely useful to a reader
who never leaves the incumbent. If step 3 is missing or strawmanned, it reads as marketing
and both readers and models discount the whole page. Title on the problem, never on the
comparison.

### 1.1 Reducing Elasticsearch memory usage
`/guides/reduce-elasticsearch-memory-usage`
Why Elasticsearch holds so much in JVM heap and filesystem cache, how shard count, fielddata
and doc values drive RAM, and which tuning levers actually help (heap sizing, shard
consolidation, index lifecycle management). Closes on why a memory-mapped, disk-first engine
has a fundamentally different memory floor.

### 1.2 Why Elasticsearch relevance tuning is hard
`/guides/elasticsearch-relevance-tuning`
Relevance in Elasticsearch lives in query construction (BM25 plus `function_score` plus
boosting), so every tuning change is a code deploy reviewed by engineers. Covers analyzer
choice, the `multi_match` type trap, and how moving relevance into a configurable ranking
pipeline lets non-engineers tune search.

### 1.3 Making Elasticsearch fuzzy search behave like typo tolerance
`/guides/elasticsearch-fuzzy-search-typos`
What `fuzziness: AUTO` really does, how edit distance and `prefix_length` interact, why
fuzzy matching is off by default and expensive at scale, and why it degrades under
`multi_match`. Contrasts with typo tolerance that is on by default and tuned per attribute.

### 1.4 Why Elasticsearch cluster operations are complex
`/guides/elasticsearch-cluster-operations`
Shards, replicas, split-brain, rebalancing, yellow and red cluster status, and rolling
version upgrades. Explains what each mechanism buys you, then what a single-binary
architecture removes from your operational surface and what it gives up in exchange.

### 1.5 Controlling Elasticsearch costs
`/guides/elasticsearch-cost-control`
Where the money actually goes: nodes sized for peak load, replica multiplication, hot and
warm tiers, snapshot storage, and the data transfer nobody budgets for. Practical reduction
steps first, then how a lower resource floor changes the arithmetic.

### 1.6 Why Elasticsearch is slow for autocomplete
`/guides/elasticsearch-autocomplete-latency`
The three standard approaches (`edge_ngram` index bloat, `search_as_you_type`, the
completion suggester) and the specific tradeoff that makes each one painful. Then what
prefix-first indexing does differently and what latency to expect.

### 1.7 Elasticsearch or OpenSearch after the license change
`/guides/elasticsearch-vs-opensearch-licensing`
Factual history of the SSPL and Elastic License change and the Apache 2.0 fork, what each
license permits in practice, and why a forced licensing review is the right moment to
reassess the whole search stack rather than just the vendor. Strictly factual, no FUD.

### 1.8 Why Algolia costs are hard to predict
`/guides/algolia-cost-predictability`
How record and search-unit pricing compounds, why a schema change or a fuller crawl can
multiply your record count overnight, and why usage-based billing penalizes exactly the
growth you want. Then what fixed monthly tiers change about capacity planning.

### 1.9 Working around Algolia record size limits
`/guides/algolia-record-size-limits`
Why the per-record size cap exists in a RAM-first architecture, the standard workaround
(split into many records, collapse with `distinct`) and what it costs you in record count,
relevance and complexity. Then what a disk-first architecture allows instead.

### 1.10 Self-hosting search when your vendor is SaaS only
`/guides/self-hosting-vs-saas-search`
The legitimate reasons teams must self-host: data residency, air-gapped environments,
regulated industries, and cost at scale. What you take on when you self-host, and what a
genuine self-host-or-managed choice is worth as insurance.

### 1.11 Why Postgres full-text search does not handle typos
`/guides/postgres-full-text-search-typos`
`tsvector` and `tsquery` match lexemes, not approximate strings, so a single character
changes everything. Covers `pg_trgm`, its index size and maintenance cost, why "did you
mean" is genuinely hard in Postgres, and where the honest boundary sits.

### 1.12 When to outgrow Postgres full-text search
`/guides/outgrow-postgres-full-text-search`
Concrete thresholds: row counts, faceting requirements, ranking sophistication, query
concurrency, and GIN index bloat and maintenance windows. Must include an explicit "stay on
Postgres if" section, which is what makes the rest of the page trustworthy.

### 1.13 Why pgvector alone is not enough for search
`/guides/pgvector-limitations-search`
Pure vector similarity misses exact matches, SKUs, names and negation. Covers HNSW build
time and memory cost, the filtered-vector-search problem, and why hybrid retrieval beats
pure semantic for almost every product search workload.

### 1.14 Why MongoDB Atlas Search results feel irrelevant
`/guides/mongodb-atlas-search-relevance`
What runs under Atlas Search, how analyzer configuration determines results, why there is no
typo tolerance by default, and how opaque scoring makes relevance problems hard to diagnose.
Includes what to try in Atlas before looking elsewhere.

### 1.15 Why a pure vector database gives poor keyword results
`/guides/vector-database-keyword-search`
Embedding similarity systematically fails on product codes, proper nouns, exact phrases and
negation. Explains why teams end up bolting BM25 onto their vector store, and the case for
one engine that does both retrieval modes natively.

---

## Group 2: Choosing an approach under constraints (12 articles)

Constraint-led, not feature-led. Every page states the constraint in the title and ends with
a recommendation plus honest exclusions.

### 2.1 Choosing a search solution for 10 million documents
`/guides/search-solution-10-million-documents`
What actually changes between 1M, 10M and 100M documents: disk and memory footprint,
initial indexing time, latency under faceting, and reindex cost. Real numbers at each scale,
and the specific things that break if you plan for 1M and land at 10M.

### 2.2 Sizing a search deployment: RAM, disk and CPU
`/guides/sizing-search-deployment`
Practical estimation: document count times average size times settings overhead for disk,
what actually drives RAM (embeddings, filterable attributes, not raw document count), and
when CPU is the bottleneck (indexing and embedding inference, rarely search). Three worked
examples at different scales.

### 2.3 Choosing search for a sub-50ms latency budget
`/guides/sub-50ms-search-latency`
Where the milliseconds go: network round trip, ranking, filter evaluation, facet computation,
and query-time embedding inference. Which features cost what, how region placement dominates
everything else, and which budgets are realistic versus wishful.

### 2.4 Search on a tight budget: what $30 a month buys
`/guides/search-on-a-budget`
Honest ceilings at entry tiers: document counts, search volume, which features are out of
reach. The self-host versus managed break-even point including the ops time nobody costs,
and what to cut first when the budget will not move.

### 2.5 Keyword, semantic or hybrid: choosing for your data
`/guides/keyword-semantic-or-hybrid`
A decision framed by data shape (product codes and names versus prose versus mixed) and query
shape (navigational versus exploratory). Complements `hybrid_search/advanced/semantic_vs_hybrid`,
which explains the mechanism; this page makes the choice.

### 2.6 Do you need a vector database?
`/guides/do-you-need-a-vector-database`
When a dedicated vector store genuinely earns its place (very high dimensionality, billions
of vectors, vectors as the primary data model) versus when a search engine with built-in
vectors is enough. Must be honest about the cases where the answer is yes.

### 2.7 Self-hosted or Cloud: choosing how to run Meilisearch
`/guides/self-hosted-or-cloud`
The responsibility split spelled out line by line, the cost crossover point, compliance and
residency drivers, and the ops burden in hours per month. Genuinely balanced, because a
one-sided version of this page destroys the credibility of every other guide.

### 2.8 Choosing an embedding model for your use case
`/guides/choosing-an-embedding-model`
Dimensions versus quality versus cost versus latency, domain fit, and context window against
your chunk size. A decision table by use case. Distinct from
`hybrid_search/how_to/choose_an_embedder`, which is about configuring a provider once chosen.

### 2.9 Choosing an embedding model for multilingual search
`/guides/embedding-model-multilingual`
Which models hold up across languages and which quietly degrade outside English, whether you
need true cross-lingual retrieval (query in one language, documents in another), and the
per-language-index versus one-multilingual-model decision.

### 2.10 When to use binary quantization
`/guides/when-to-use-binary-quantization`
Memory savings against recall loss with actual numbers, the dimension count above which it
becomes clearly worthwhile, and how to measure the quality hit on your own corpus before
committing. Complements `hybrid_search/advanced/binary_quantization`, which covers how.

### 2.11 When reranking is worth the latency
`/guides/when-to-use-reranking`
What reranking actually fixes, what it costs in milliseconds and dollars per query, and the
cheaper interventions to exhaust first (document template, chunk size, searchable attribute
pruning). Includes when to skip it entirely.

### 2.12 Choosing chunk size for semantic search
`/guides/choosing-chunk-size`
The recall and precision tradeoff explained with examples, how model context limits cap your
options, whether overlap earns its storage cost, and a repeatable way to test two chunk sizes
on your own corpus rather than guessing.

---

## Group 3: Getting real-world documents search-ready (19 articles)

The largest measured gap in the docs today. PDF, SharePoint, Office and web crawling have
essentially zero coverage, and chunking exists only as one short section inside
`getting_started/good_practices`. Also the least Meilisearch-specific group, which is
precisely why it works: the reader arrives with no vendor in mind.

### 3.1 How to chunk documents for search
`/guides/how-to-chunk-documents`
The foundational page the rest of this group links back to. Why naive fixed-size splitting
hurts retrieval, the three strategies (fixed, structural, semantic) and when each fits,
whether overlap pays for itself, which metadata every chunk must carry, and how to evaluate a
chunking change.

### 3.2 How to chunk web pages
`/guides/chunk-web-pages`
Stripping navigation and boilerplate without losing content, using the heading hierarchy as
natural boundaries, carrying breadcrumbs and anchor ids so results deep-link to the right
section, and handling single-page apps and infinite scroll.

### 3.3 How to chunk PDFs
`/guides/chunk-pdfs`
Page boundaries are not semantic boundaries. Covers multi-column layouts that scramble
reading order, repeated headers and footers, tables that lose meaning as plain text,
footnotes, and preserving page numbers so results can cite a location.

### 3.4 How to chunk long-form documentation and books
`/guides/chunk-long-form-documents`
Using section hierarchy as the chunk tree, handling cross-references that break when split,
prefixing parent headings so a chunk stands alone, and the parent-document retrieval pattern
where you search small chunks but return larger context.

### 3.5 How to chunk code and technical content
`/guides/chunk-code-and-technical-content`
Splitting on function and class boundaries, keeping signatures attached to bodies, treating
docstrings and comments as searchable context, and why fixed-size splitting destroys code
retrieval more thoroughly than any other content type.

### 3.6 How to chunk transcripts and conversations
`/guides/chunk-transcripts`
Speaker turns as boundaries, carrying timestamps for playback deep links, detecting topic
drift within a long meeting, and giving each chunk enough surrounding context to be
interpretable on its own.

### 3.7 How to search PDFs
`/guides/search-pdfs`
The flagship page of this group. End to end: text-layer extraction versus OCR, chunking,
metadata to carry, indexing, and returning page-level deep links so a result opens the right
page. Includes the full working pipeline in one code block.

### 3.8 How to search scanned documents with OCR
`/guides/search-scanned-documents-ocr`
Detecting when OCR is needed, what accuracy to expect and how it varies by scan quality, how
OCR errors interact with typo tolerance (sometimes helpfully), and which cleanup steps are
worth running before indexing.

### 3.9 How to search Microsoft Word and Office documents
`/guides/search-office-documents`
Extracting from docx, xlsx and pptx while preserving useful structure, handling tracked
changes and comments, deciding whether a spreadsheet is one document or one document per row,
and mapping slide decks to searchable units.

### 3.10 How to search a SharePoint site
`/guides/search-sharepoint`
Enumerating content through the Microsoft Graph API, permission-aware indexing so results
respect SharePoint access, incremental sync using delta queries, and mapping SharePoint
permission groups onto tenant tokens.

### 3.11 How to search Confluence and Notion
`/guides/search-confluence-and-notion`
API pagination and rate limits, converting block-based content to clean text, mapping
workspace and page permissions to search-time filters, and incremental sync triggered by page
updates rather than full recrawls.

### 3.12 How to search Google Drive
`/guides/search-google-drive`
Drive API traversal, handling a folder of mixed file types with one pipeline, scoping results
to each user's actual access, and using the changes feed for incremental sync instead of
re-enumerating everything.

### 3.13 How to search a website by crawling it
`/guides/search-website-crawling`
Crawler setup, sitemap-driven versus link-discovery crawling, respecting robots.txt and rate
limits, choosing a recrawl cadence, detecting near-duplicate pages, and turning each page into
correctly chunked records.

### 3.14 How to search email archives
`/guides/search-email-archives`
Reconstructing threads, stripping quoted replies and signatures so they do not dominate
relevance, indexing attachments alongside message bodies, and enforcing hard per-user privacy
boundaries.

### 3.15 How to search images and media with multimodal embeddings
`/guides/search-images-multimodal`
The pipeline rather than the configuration: deciding what to embed (pixels, captions or both),
generating captions when you have none, carrying metadata for filtering, and setting realistic
quality expectations. Complements `hybrid_search/how_to/image_search_with_multimodal`.

### 3.16 How to index a relational database for search
`/guides/index-relational-database`
Denormalizing joins into flat search documents, choosing the document grain (order, line item
or product), keeping it in sync through change data capture or polling, and handling deletes
that leave no trace in the source.

### 3.17 How to keep an index in sync with your source of truth
`/guides/keep-index-in-sync`
Full reindex versus incremental update, change data capture patterns, soft deletes, idempotent
upserts, detecting silent drift between source and index, and zero-downtime reindexing using
an index swap.

### 3.18 How to handle documents that exceed size limits
`/guides/handle-large-documents`
When a single logical document is too large to index as one record: splitting with a shared
parent id, collapsing results back with `distinct`, and returning the snippet that actually
matched rather than the first chunk.

### 3.19 How to enrich documents before indexing
`/guides/enrich-documents-before-indexing`
Language detection, entity extraction, summarization, generated keywords and categorization.
Which enrichments measurably improve retrieval, which are theater, and the freshness and cost
tradeoff of doing this work at index time.

---

## Group 4: Hard search problems done right (14 articles)

The pattern this group fixes: the feature is documented, the problem is not. Multi-tenancy
appears in the docs only as tenant tokens, framed as a security feature, with nothing
addressing the performance question readers actually have.

### 4.1 How to build multi-tenant search without slowing it down
`/guides/multi-tenant-search-performance`
The three architectures (index per tenant, shared index with filters, hybrid) and exactly
where each breaks: index count overhead versus filter selectivity versus operational
complexity. How filterable attributes affect memory, and how to choose based on tenant count
and size skew.

### 4.2 How to isolate tenant data securely
`/guides/tenant-data-isolation`
Tenant tokens end to end, why a client-side filter is not a security boundary, API key
scoping, token expiry and rotation, and how to audit that isolation actually holds.
Complements `capabilities/security/` with the architectural view.

### 4.3 How to build multilingual search
`/guides/multilingual-search`
One index per language versus one shared index, with the real tradeoffs. When
`localizedAttributes` is the right answer, how to detect query language, and whether you need
cross-lingual retrieval or just per-language correctness.

### 4.4 How to search CJK, Arabic, Hebrew and Thai text
`/guides/search-non-latin-scripts`
Segmenting languages that do not delimit words with spaces, right-to-left display concerns,
diacritic and normalization handling, and why typo tolerance behaves differently per script
and sometimes needs disabling.

### 4.5 How to personalize search results
`/guides/personalize-search-results`
Which signals are worth collecting, the three mechanisms (per-user boosting, reranking, user
embeddings) and their cost, handling cold start, where the privacy boundary sits, and how to
measure lift rather than assume it.

### 4.6 How to build recommendations from search data
`/guides/build-recommendations`
Similar-item recommendations from embeddings, blending in co-view and co-purchase signals,
mixing recommendations into search results, and avoiding the filter bubble that makes
recommendations feel stale.

### 4.7 How to improve typo tolerance
`/guides/improve-typo-tolerance`
Per-attribute thresholds, why short words and product codes should be exempt,
`disableOnWords` and `disableOnAttributes`, separator token handling, and how typo tolerance
interacts with synonyms and phrase search.

### 4.8 How to handle synonyms, acronyms and jargon
`/guides/handle-synonyms-and-jargon`
One-way versus two-way synonyms and when each is correct, maintaining a domain dictionary
without it rotting, when a term belongs in the dictionary rather than the synonym list, and
measuring whether a synonym helped or hurt.

### 4.9 How to make search faster
`/guides/make-search-faster`
An optimization checklist ordered by payoff per hour of work: searchable attribute pruning,
filter selectivity, `attributesToRetrieve`, pagination strategy, search cutoff, moving
embedding inference off the query path, and region placement. Optimization, not diagnosis.

### 4.10 How to build fast faceted navigation at scale
`/guides/faceted-navigation-at-scale`
High-cardinality facets, what facet counts actually cost, `facetSearch` for long value lists,
disjunctive faceting done correctly, and facet ordering strategies that help users rather
than just filling the sidebar.

### 4.11 How to build autocomplete and instant search
`/guides/autocomplete-and-instant-search`
Prefix search settings, debouncing and in-flight request cancellation, ranking for
two-character queries, and the design question of whether suggestions and results are the
same list or two.

### 4.12 How to keep search fresh with high write volume
`/guides/search-freshness-high-write-volume`
Batching strategy, how the task queue behaves under sustained load, why settings must be
configured before bulk document import, what "real time" realistically means, and how to
apply backpressure instead of collapsing.

### 4.13 How to handle zero-result searches
`/guides/handle-zero-result-searches`
Matching strategy as the first lever, progressive query relaxation, spelling and semantic
fallbacks, and instrumenting no-result queries so the list becomes your content and synonym
roadmap.

### 4.14 How to merchandise and control result order
`/guides/merchandise-search-results`
Pinning specific results, boosting by business rules, running seasonal campaigns, and the
governance question of keeping merchandising from quietly destroying relevance. Covers who
should own these rules.

---

## Group 5: Diagnosing search quality and speed (12 articles)

Symptom-shaped titles matching what people type when something is broken. Highest-intent
traffic and the text most likely to be pasted into an LLM verbatim. Every page is an ordered
diagnostic checklist: each cause gets a check and a fix, cheapest first.

### 5.1 Why your semantic search returns irrelevant results
`/guides/semantic-search-irrelevant-results`
Ordered causes with a check for each: wrong document template, chunks too large, wrong model
for the domain, misconfigured semantic ratio, missing filters, and quantization damage. Ends
with how to confirm the fix worked.

### 5.2 Why your semantic search is slow
`/guides/semantic-search-slow`
Query-time embedding inference usually dominates everything else. Covers provider latency and
cold starts, dimension count, quantization, and the architectural fix of moving inference off
the query path entirely.

### 5.3 Why your search is slow
`/guides/search-is-slow`
Diagnosis in order: measure before changing anything, then searchable attribute count, filter
selectivity, facet computation, response payload size, pagination depth, and resource
saturation. Hands off to `make-search-faster` for the remedies.

### 5.4 Why a document does not appear in results
`/guides/document-not-in-results`
The checklist: is it indexed at all, is the field searchable, is a filter excluding it, is the
typo threshold too tight, is the matching strategy dropping terms, is it ranked too low, is
`distinct` collapsing it away.

### 5.5 Why your search ranks the wrong result first
`/guides/wrong-result-ranked-first`
Reading the ranking score, how ranking rule order determines outcomes, attribute ranking
effects, custom ranking rules working against each other, and using score details to find the
rule responsible.

### 5.6 Why your typo tolerance is not matching
`/guides/typo-tolerance-not-matching`
Word length thresholds as the usual culprit, prefix matching behavior, per-attribute
disabling, numbers and product codes, and the interaction with phrase search that surprises
people.

### 5.7 Why your facet counts look wrong
`/guides/facet-counts-wrong`
Disjunctive versus conjunctive faceting as the near-universal cause,
`maxValuesPerFacet` truncation, whether filters should apply to their own facet's counts, and
`distinct` interactions.

### 5.8 Why indexing is slow or stuck
`/guides/indexing-slow-or-stuck`
Inspecting the task queue first, batch size effects, settings changed mid-import forcing a
full reindex, embedder inference as the hidden bottleneck, and disk and memory pressure
symptoms.

### 5.9 Why your embeddings failed to generate
`/guides/embeddings-failed-to-generate`
Provider errors and rate limits, document template errors that fail silently per document,
quota exhaustion, how to read the failed task, and how to backfill only the affected
documents.

### 5.10 Why your search costs more than expected
`/guides/unexpected-search-costs`
Where usage actually accrues, how a reindex amplifies it, embedding API spend as the
commonly missed line item, analytics event volume, and how to attribute cost to a specific
index or feature.

### 5.11 How to measure and improve search relevance
`/guides/measure-search-relevance`
Building an evaluation set from real queries, choosing metrics that reflect user outcomes
(click-through, no-result rate, click position), running an offline before-and-after
comparison, and A/B testing a settings change. The methodology page group 6 depends on.

### 5.12 How to debug search with ranking score details
`/guides/debug-with-ranking-scores`
Reading `showRankingScoreDetails` field by field, mapping each ranking rule's contribution to
the final order, and using the output to justify a settings change to someone who disagrees
with it.

---

## Group 6: Agentic and MCP retrieval (10 articles)

The best-served area already: `capabilities/agentic_search/` has 7 pages, plus the `mcp`,
`langchain` and `ai_sdk` integrations. The gap is task-shaped assembly, not missing features.

### 6.1 How to connect your knowledge base to an MCP server
`/guides/knowledge-base-mcp-server`
The flagship page. End to end: choose sources, ingest and chunk, index, expose through MCP,
connect a client, and scope permissions per user. One complete working example rather than a
tour of the options.

### 6.2 How to build retrieval for an AI agent
`/guides/retrieval-for-ai-agents`
What agents need that human users do not: stable document ids, citable anchors, token-bounded
results, and filters exposed as tool parameters. Covers designing the tool signature and how
many results to return before you waste context.

### 6.3 How to design search tools for LLM tool calling
`/guides/search-tools-for-tool-calling`
Tool schema design, describing filter parameters so a model uses them correctly instead of
stuffing everything into the query string, returning useful zero-result responses, and
preventing pagination loops.

### 6.4 How to build a RAG pipeline that cites its sources
`/guides/rag-with-citations`
Carrying stable ids and page anchors through chunking so they survive to the answer,
returning them in search results, formatting citations the user can verify, and checking that
each claim maps to a retrieved chunk.

### 6.5 How to evaluate RAG retrieval quality
`/guides/evaluate-rag-retrieval`
Separating retrieval failure from generation failure, which is the single most common
debugging mistake in RAG. Measuring recall at k on your own evaluation set, and deciding which
layer to fix. Builds on `measure-search-relevance`.

### 6.6 How to chunk documents for agent retrieval
`/guides/chunk-for-agent-retrieval`
Why agent retrieval has different constraints from human search: token budgets, chunks that
must stand alone without surrounding context, parent-document expansion, and metadata the
model can actually act on. Links back to group 3.

### 6.7 How to give an agent memory with search
`/guides/agent-memory-with-search`
Storing conversation and task history as searchable documents, balancing recency against
relevance, scoping memory per user with tenant tokens, and pruning so memory does not grow
without bound.

### 6.8 How to build a documentation assistant
`/guides/build-documentation-assistant`
Crawl to chunk to index to chat, with guardrails, source display, and handling
version-specific answers so the assistant does not confidently cite the wrong release. Ties
groups 3 and 6 together in one worked example.

### 6.9 How to keep an agent's knowledge base up to date
`/guides/keep-agent-knowledge-current`
Incremental sync for agent corpora, detecting staleness, handling versioned content, and
telling the agent how fresh its data is so it can caveat appropriately rather than assert
stale facts.

### 6.10 How to search across multiple data sources for an agent
`/guides/multi-source-agent-search`
Federated search across several indexes in one request, applying per-source permissions,
merging and ranking heterogeneous results, and attributing each result to its source so the
agent can explain where an answer came from.
