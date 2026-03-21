# Meilisearch Documentation Review: Capabilities Tab

**Date:** March 20, 2026
**Model:** Claude 4.6 Opus (High Thinking)
**Scope:** Full review of all 80+ files across 11 capability sections
**Methodology:** Every file was read in full and analyzed for content quality, accuracy, structure, and completeness.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Overall Architecture & Organization](#overall-architecture--organization)
3. [Section-by-Section Analysis](#section-by-section-analysis)
   - [Full-Text Search](#1-full-text-search-22-files)
   - [Hybrid & Semantic Search](#2-hybrid--semantic-search-14-files)
   - [Conversational Search](#3-conversational-search-7-files)
   - [Indexing](#4-indexing-11-files)
   - [Filtering, Sorting & Faceting](#5-filtering-sorting--faceting-8-files)
   - [Multi-Search](#6-multi-search-6-files)
   - [Geo Search](#7-geo-search-7-files)
   - [Security & Tenant Tokens](#8-security--tenant-tokens-7-files)
   - [Analytics](#9-analytics-8-files)
   - [Personalization](#10-personalization-4-files)
   - [Teams](#11-teams-4-files)
4. [Cross-Cutting Issues](#cross-cutting-issues)
5. [Critical Bugs & Factual Errors](#critical-bugs--factual-errors)
6. [Content Gaps & Missing Pages](#content-gaps--missing-pages)
7. [Priority Action Items](#priority-action-items)
8. [Appendix: Per-File Summary](#appendix-per-file-summary)

---

## Executive Summary

The Capabilities tab is **well-structured and generally high quality**. The consistent Overview → Getting Started → How To → Advanced pattern across all 11 sections creates a predictable learning path. Writing quality is strong, examples are practical, and the content covers Meilisearch's feature set comprehensively.

However, the review identified **23 critical/high-priority issues** that need immediate attention, including broken links, factual contradictions, outdated timestamps, and duplicated content. The most systemic problems are:

1. **Content duplication** — Multiple pages cover the same material at similar depth (especially in Full-Text Search and Filtering sections)
2. **Stale content** — Five analytics pages still reference a "November 2025 rollout" that is long past
3. **Inconsistent conventions** — URL placeholders (`MEILISEARCH_URL` vs `http://localhost:7700`), code sample approaches (imported snippets vs inline curl), and ranking rule names (legacy `attribute` vs new `attributeRank`/`wordPosition`) vary between pages
4. **Contradictory information** — The two SSO pages contradict each other on protocol support; geo search pages contradict each other on `_geoPolygon` behavior with `_geo` vs `_geojson`

### Quality Scorecard

| Section | Files | Quality | Critical Issues | Priority |
|---------|-------|---------|-----------------|----------|
| Full-Text Search | 22 | ★★★★☆ | 6 | Medium |
| Hybrid Search | 14 | ★★★★☆ | 4 | High |
| Conversational Search | 7 | ★★★★☆ | 5 | High |
| Indexing | 11 | ★★★★☆ | 3 | Medium |
| Filtering/Sorting/Faceting | 8 | ★★★★☆ | 4 | Medium |
| Multi-Search | 6 | ★★★★☆ | 2 | Low |
| Geo Search | 7 | ★★★☆☆ | 5 | High |
| Security | 7 | ★★★★☆ | 2 | Medium |
| Analytics | 8 | ★★★☆☆ | 5 | High |
| Personalization | 4 | ★★★☆☆ | 3 | Medium |
| Teams | 4 | ★★★☆☆ | 3 | Medium |

---

## Overall Architecture & Organization

### Strengths

- **Consistent structure**: Every section follows the same pattern: Overview → Getting Started → How To → Advanced. This creates predictability and makes navigation intuitive.
- **Good use of Mintlify features**: CardGroup navigation, code sample imports, tabbed interfaces, and admonitions (Note, Warning, Tip) are used effectively throughout.
- **Practical examples**: Nearly every page uses realistic examples (movies, ecommerce, CRM) that readers can relate to and adapt.
- **Progressive disclosure**: Content depth increases logically from overview to advanced topics.

### Weaknesses

- **Navigation depth**: Some sections have 4 levels of nesting (Capabilities → Section → Subsection → Page), which can make it hard to find specific content.
- **No section landing page**: The Capabilities tab itself has no index page. Users land directly on "Full-text search overview," which may confuse those expecting a capabilities overview.
- **Inconsistent "Getting Started" scope**: Some getting-started pages are focused tutorials (Indexing), while others try to be comprehensive references (Geo Search). The role of this page type needs standardization.
- **Missing cross-section links**: Capabilities often interact (e.g., filtering + geo search, hybrid search + conversational search), but cross-section linking is sparse.

### Recommended Structural Changes

1. **Add a Capabilities landing page** — A single page introducing all 11 sections with brief descriptions and links would orient new users.
2. **Standardize getting-started scope** — These should be 5-10 minute focused tutorials, not comprehensive references. Deep content belongs in how-to and advanced pages.
3. **Add "Related capabilities" sections** — At the bottom of each overview page, link to related capability sections.

---

## Section-by-Section Analysis

### 1. Full-Text Search (22 files)

**Overall assessment:** The largest and most comprehensive section. Writing quality is high, but content duplication is the biggest problem.

#### Strengths
- Extensive relevancy documentation with clear explanations of all ranking rules
- The ranking pipeline walkthrough with the "dark knight" example is excellent
- Performance tuning guide is practical and actionable

#### Issues

| Severity | Issue | File(s) |
|----------|-------|---------|
| High | Heavy content duplication between `search_with_snippets.mdx` and `highlight_search_results.mdx` — nearly identical examples | `getting_started/`, `how_to/` |
| High | Overlap between `displayed_searchable_attributes.mdx` and `configure_searchable_attributes.mdx` | `relevancy/`, `how_to/` |
| Medium | Duplicate ranking rule explanations in `ranking_pipeline.mdx` and `ranking_rules.mdx` | `advanced/`, `relevancy/` |
| Medium | Legacy `attribute` rule vs new `attributeRank`/`wordPosition` — inconsistent usage across pages | Multiple files |
| Medium | Duplicate "## 4." headings in ranking_rules.mdx (both `Attribute` and `Attribute rank` are numbered 4) | `relevancy/ranking_rules.mdx` |
| Low | Typo: "adventure" listed twice in prefix search example | `how_to/configure_prefix_search.mdx` |
| Low | "see below" text links to a different page, not a section below | `relevancy/typo_tolerance_settings.mdx` |
| Low | `http://localhost:7700` used instead of `MEILISEARCH_URL` | `relevancy/ranking_score.mdx` |

#### Key Recommendations
1. **Merge or differentiate duplicated pages**: The getting-started snippets page should be a brief intro linking to the how-to guide. The relevancy page on displayed/searchable attributes should be conceptual; the how-to page should be procedural.
2. **Standardize ranking rule naming**: Pick the new names (`attributeRank`, `wordPosition`) and add a clear deprecation note for the legacy `attribute` rule.
3. **Add missing content**: `showMatchesPosition` parameter, `attributesToRetrieve` at search time, tokenization interaction with search.

---

### 2. Hybrid & Semantic Search (14 files)

**Overall assessment:** Well-organized with a logical learning path. The strongest pages are `semantic_vs_hybrid.mdx` and `custom_hybrid_ranking.mdx`. Key concerns are around accuracy and broken links.

#### Issues

| Severity | Issue | File(s) |
|----------|-------|---------|
| **Critical** | Broken link: `list-documents-with-get` used instead of `add-or-replace-documents` for document upload | `search_with_user_provided_embeddings.mdx`, `image_search_with_multimodal.mdx` |
| **Critical** | Potentially incorrect claim about Cohere automatic `input_type` switching — if wrong, leads to degraded search quality | `configure_cohere_embedder.mdx` |
| High | "LLM" terminology used for embedding models — technically inaccurate | `getting_started.mdx`, `overview.mdx` |
| Medium | Version requirement "v1.3 or later" may be inaccurate for stable embedder support | 3 embedder config pages |
| Medium | `choose_an_embedder.mdx` is too brief — missing comparison table, no Cohere mention | `how_to/choose_an_embedder.mdx` |
| Medium | `header` vs `headers` inconsistency in REST embedder conclusion | `configure_rest_embedder.mdx` |
| Medium | Fragment name inconsistency: `TEXT_FRAGMENT_NAME` vs `TEXTUAL_FRAGMENT_NAME` | `image_search_with_multimodal.mdx` |
| Low | Ollama mentioned in `choose_an_embedder` but not in overview | Inconsistency |
| Low | JSON comments (`//`) in code blocks — invalid JSON | `custom_hybrid_ranking.mdx` |
| Low | `documentTemplate` links point to getting_started instead of best practices | 3 embedder config pages |

#### Key Recommendations
1. **Fix broken document endpoint links immediately** — These will cause user confusion.
2. **Verify and correct the Cohere `input_type` claim** — If Meilisearch doesn't auto-switch, add manual configuration instructions.
3. **Create a proper embedder comparison table** in `choose_an_embedder.mdx` with columns for cost, latency, multilingual support, and self-hosted availability.
4. **Add troubleshooting sections** to embedder configuration pages.

---

### 3. Conversational Search (7 files)

**Overall assessment:** Well-structured and readable. This is a newer feature area, and it shows — some pages have inconsistencies typical of rapidly evolving documentation.

#### Issues

| Severity | Issue | File(s) |
|----------|-------|---------|
| **Critical** | `_meiliSearchSources` tool schema types `documents` as `"object"` but it's actually an array | `chat_tooling_reference.mdx` |
| High | Missing `stream: true` in OpenAI SDK example — code won't work as shown | `getting_started.mdx` |
| High | Tool call arguments arrive as streamed chunks but code assumes complete JSON — will fail in practice | `display_source_documents.mdx` |
| High | `innerHTML` usage creates XSS vulnerability in example code | `display_source_documents.mdx` |
| Medium | Inconsistent tool guidance: "optional but recommended" vs "necessary" vs "for best experience" | Multiple files |
| Medium | `_meiliAppendConversationMessage` underdocumented — no code example, unclear lifecycle | `chat_tooling_reference.mdx` |
| Medium | Deprecated model `gpt-3.5-turbo` in SSE response example | `getting_started.mdx` |
| Medium | `process.stdout.write` in "browser or Node.js" example — Node.js only | `stream_chat_responses.mdx` |
| Low | Description "natural languages" should be "natural language" | `overview.mdx` |
| Low | No Python examples anywhere — all JavaScript/curl | All files |

#### Key Recommendations
1. **Fix the tool schema** — `documents` must be typed as `array`, not `object`.
2. **Add SSE chunk accumulation guidance** — Show how to buffer `arguments` across multiple chunks before JSON.parse.
3. **Create a dedicated conversation context management page** — `_meiliAppendConversationMessage` is too important to be buried in a reference.
4. **Standardize tool requirement language** — Pick one consistent phrasing.
5. **Add Python examples** — This is an AI feature; Python is the dominant language in this space.

---

### 4. Indexing (11 files)

**Overall assessment:** Solid section with practical content. The `optimize_batch_performance.mdx` page is a standout. Main issues are mismatched titles and outdated examples.

#### Issues

| Severity | Issue | File(s) |
|----------|-------|---------|
| High | Swapped table columns give wrong optimization advice | `how_to/optimize_batch_performance.mdx` |
| High | Error object in task example has `code`/`type` fields swapped vs current API | `advanced/async_operations.mdx` |
| Medium | Title/sidebar mismatches: "Working with tasks" vs "Monitor tasks"; "Managing the task database" vs "Paginating tasks" | `how_to/monitor_tasks.mdx`, `how_to/manage_task_database.mdx` |
| Medium | `"indexes": [*]` — invalid JSON (should be `["*"]`) | `advanced/async_operations.mdx` |
| Medium | `documentAddition` referenced instead of correct `documentAdditionOrUpdate` | `how_to/filter_tasks.mdx` |
| Low | Inconsistent `indexUid`: `movie` (singular) vs `movies` (plural) | `how_to/monitor_tasks.mdx` |
| Low | Outdated timestamps (2021) in examples | Multiple files |
| Low | Grammar: "Larger payload consume" → "Larger payloads consume" | `advanced/indexing_best_practices.mdx` |

#### Key Recommendations
1. **Fix the swapped table columns immediately** — This gives users incorrect optimization advice.
2. **Update all example timestamps** to 2025/2026 for freshness.
3. **Align title/sidebar values** across all pages.
4. **Expand `manage_task_database.mdx`** to cover task deletion and cleanup, or rename to "Paginating tasks."

---

### 5. Filtering, Sorting & Faceting (8 files)

**Overall assessment:** Generally well-written with a strong filter expression reference. Main concerns are content overlap and factual errors in examples.

#### Issues

| Severity | Issue | File(s) |
|----------|-------|---------|
| **Critical** | `dairy_product.name` vs `dairy_products.name` typos in negated CONTAINS and STARTS WITH examples — would produce wrong results | `advanced/filter_expression_syntax.mdx` |
| High | `facetsDistribution` typo (should be `facetDistribution`) — wrong API field name | `how_to/filter_with_facets.mdx` |
| Medium | Getting started page only covers filtering, not sorting or faceting | `getting_started.mdx` |
| Medium | Significant overlap between `filter_with_facets.mdx` and `build_faceted_navigation.mdx` | `how_to/` |
| Medium | `TO` operator description inconsistency: "below 90" vs inclusive `<=` | `advanced/filter_expression_syntax.mdx` |
| Medium | Incomplete operator list in conditions section (missing IS EMPTY, IS NULL, CONTAINS, STARTS WITH) | `advanced/filter_expression_syntax.mdx` |
| Low | No "Next steps" navigation on getting_started page | `getting_started.mdx` |
| Low | Security concern: API key in client-side JavaScript without warning | `how_to/build_faceted_navigation.mdx` |

#### Key Recommendations
1. **Fix the `dairy_product`/`dairy_products` typos immediately** — These are in a reference page users will copy.
2. **Fix the `facetsDistribution` typo** — Users comparing against API responses will be confused.
3. **Expand getting_started** to cover all three concepts (filtering, sorting, faceting) or rename appropriately.
4. **Deduplicate facets content** between the two how-to pages.

---

### 6. Multi-Search (6 files)

**Overall assessment:** Strong section with practical scenario-driven examples. The comparison between multi-index and federated modes is well-handled.

#### Issues

| Severity | Issue | File(s) |
|----------|-------|---------|
| High | Incorrect API endpoint for index creation (should use `/documents` not `/indexes`) | `getting_started/federated_search.mdx` |
| Medium | `semanticHitCount` in response examples is unexplained | `getting_started/federated_search.mdx` |
| Medium | Typo: "profile" should be "profiles" | `getting_started/federated_search.mdx` |
| Low | No security warning about API keys in frontend code | `how_to/build_unified_search_bar.mdx` |
| Low | No debounce mention in search bar implementation | `how_to/build_unified_search_bar.mdx` |

#### Key Recommendations
1. **Fix the API endpoint** in the federated search tutorial.
2. **Add a brief `semanticHitCount` explanation** or remove it from examples.
3. **Add security notes** to all frontend code examples.

---

### 7. Geo Search (7 files)

**Overall assessment:** The how-to pages are individually well-written, but the getting-started page is overloaded and contains contradictions with the how-to pages. This section needs the most structural attention.

#### Issues

| Severity | Issue | File(s) |
|----------|-------|---------|
| **Critical** | `_geoPolygon` behavior contradicted: getting_started says `_geo` is "ignored," how-to says it "still works" | `getting_started.mdx` vs `how_to/filter_by_geo_polygon.mdx` |
| **Critical** | `_geoRadius` parameter count mismatch: 4 params (with `resolution`) vs 3 params | `getting_started.mdx` vs `how_to/filter_by_geo_radius.mdx` |
| High | Response format: bare array `[...]` instead of correct `{ "hits": [...] }` | `getting_started.mdx` |
| Medium | All 5 geo how-to pages mislabel "Geo search overview" card — links to `getting_started` not `overview` | All how-to files |
| Medium | Title inconsistency: "Geo search" (overview) vs "Geosearch" (getting started) | Multiple |
| Medium | `filterableAttributes` configuration unclear for `_geojson`-only documents | `how_to/use_geojson_format.mdx` |
| Low | Getting started page too long (367 lines), duplicates how-to content | `getting_started.mdx` |
| Low | `MultiLine` reference in GeoJSON limitations is undocumented | `how_to/use_geojson_format.mdx` |

#### Key Recommendations
1. **Resolve the `_geoPolygon` + `_geo` contradiction immediately** — This is a factual error that will confuse users.
2. **Clarify the `_geoRadius` parameter** — Does a `resolution` parameter exist? If yes, document it everywhere. If no, remove it.
3. **Refactor getting_started.mdx** — Slim it to a focused tutorial. Move comprehensive coverage to how-to pages.
4. **Fix all "overview" card links** in how-to pages to point to `/capabilities/geo_search/overview`.
5. **Standardize the title** to "Geo search" (two words) everywhere.

---

### 8. Security & Tenant Tokens (7 files)

**Overall assessment:** Strong section with excellent reference material in the tenant token payload page. The main gap is the `generate_token_from_scratch.mdx` page, which is too thin.

#### Issues

| Severity | Issue | File(s) |
|----------|-------|---------|
| High | `generate_token_from_scratch.mdx` lacks actual encoding/signing code examples — defeats the purpose | `how_to/generate_token_from_scratch.mdx` |
| Medium | Title "Multitenancy and tenant tokens" doesn't match sidebar "Generate tenant tokens with an official SDK" | `getting_started.mdx` |
| Medium | Grammar: "send it your application's front end" → "send it **to** your application's front end" | `getting_started.mdx` |
| Medium | SSO page uses old name "Azure Active Directory" (now "Microsoft Entra ID") | `how_to/configure_sso.mdx` |
| Medium | SSO page contradicts Teams SSO page on protocol support (SAML-only vs SAML/OIDC) | `how_to/configure_sso.mdx` vs Teams |
| Low | Example UUID `at5cd97d...` is not a valid UUID format | `advanced/tenant_token_payload.mdx` |
| Low | Missing mention of HTTPS/network security with cross-link to self-hosting | `overview.mdx` |

#### Key Recommendations
1. **Expand `generate_token_from_scratch.mdx`** with actual code (base64url encoding, HMAC-SHA256 signing).
2. **Reconcile the two SSO pages** between Security and Teams sections.
3. **Cross-check the API key actions table** against the latest API reference for completeness.

---

### 9. Analytics (8 files)

**Overall assessment:** Content is good when accurate, but this section has the most staleness issues. Five pages carry an outdated November 2025 rollout disclaimer.

#### Issues

| Severity | Issue | File(s) |
|----------|-------|---------|
| **Critical** | 5 pages still show "November 2025 rollout" disclaimer — 4 months stale | `getting_started.mdx`, `bind_events_to_user.mdx`, `track_click_events.mdx`, `track_conversion_events.mdx`, `events_endpoint.mdx` |
| High | `events_endpoint.mdx` is too thin for a reference page: no required/optional field indicators, no error responses, missing `userId` in examples | `advanced/events_endpoint.mdx` |
| Medium | Getting started jumps into advanced events without covering basics (dashboard access, default metrics) | `getting_started.mdx` |
| Medium | Migration page title references "November 2025" but the old endpoint is already retired | `advanced/migrate_analytics.mdx` |
| Medium | Contradictory user ID guidance: "optional for searches" vs "mandatory for events" not clearly distinguished | `how_to/bind_events_to_user.mdx` |
| Low | Click-through rate definition is ambiguous (per-result vs per-query) | `advanced/analytics_metrics.mdx` |
| Low | No mention of `navigator.sendBeacon` for reliable pre-navigation event firing | `how_to/track_click_events.mdx` |

#### Key Recommendations
1. **Remove all 5 stale "November 2025" disclaimers immediately.**
2. **Expand the events endpoint reference** with required/optional columns, error responses, and rate limits.
3. **Consider archiving the migration page** or adding a "completed" banner.
4. **Add a proper getting-started section** covering default analytics before custom events.

---

### 10. Personalization (4 files)

**Overall assessment:** Good content for an experimental feature. The ecommerce walkthrough is excellent. Main gaps are around the Cohere dependency and missing experimental feature labeling.

#### Issues

| Severity | Issue | File(s) |
|----------|-------|---------|
| High | Cohere API key dependency is unexplained — no mention of why, cost, or alternatives | `getting_started.mdx` |
| Medium | No experimental feature banner/badge on any page | All files |
| Medium | Missing `Authorization` header in curl examples | `how_to/generate_user_context.mdx`, `how_to/personalize_ecommerce_search.mdx` |
| Medium | No privacy/GDPR considerations for user profiling | `how_to/generate_user_context.mdx` |
| Low | Description uses "boost" but body uses "re-rank" | `overview.mdx` |
| Low | No guidance on cold-start problem (new users with no history) | `how_to/generate_user_context.mdx` |

#### Key Recommendations
1. **Explain the Cohere dependency** — Why Cohere specifically? Is it replaceable? What are the costs?
2. **Add standard experimental feature banners** consistent with other experimental features.
3. **Add `Authorization` headers** to all curl examples.
4. **Add privacy considerations section** — GDPR, data retention, user consent.

---

### 11. Teams (4 files)

**Overall assessment:** Functional but the three pages showing role/permission tables are inconsistent with each other. The SSO page contradicts the Security SSO page.

#### Issues

| Severity | Issue | File(s) |
|----------|-------|---------|
| High | Three different permission tables across three pages — inconsistent role descriptions | `overview.mdx`, `getting_started.mdx`, `how_to/manage_team_roles.mdx` |
| High | SSO page says "SAML or OIDC" but Security SSO page says "SAML 2.0 only" — contradiction | `how_to/configure_sso_for_team.mdx` |
| Medium | No documentation on removing team members | `how_to/manage_team_roles.mdx` |
| Medium | Grammar: "teams helps" → "teams help" | `overview.mdx` |
| Medium | "Cannot delete a team" limitation buried in text instead of warning callout | `overview.mdx` |
| Low | Roles section duplicated within overview (prose paragraph + table) | `overview.mdx` |

#### Key Recommendations
1. **Create one canonical permissions table** and reference it from all three pages.
2. **Reconcile SSO pages** between Security and Teams sections — pick one canonical source.
3. **Add "Remove team member" documentation.**

---

## Cross-Cutting Issues

### 1. Content Duplication (High Impact)

The most systemic issue across the Capabilities tab. Key instances:

| Duplicated content | Pages involved | Recommendation |
|---|---|---|
| Highlighting and cropping | `search_with_snippets.mdx` ↔ `highlight_search_results.mdx` | Merge: make getting_started a brief intro, how-to the reference |
| Searchable attributes | `displayed_searchable_attributes.mdx` ↔ `configure_searchable_attributes.mdx` | Differentiate: relevancy page = concepts, how-to = procedures |
| Ranking rules | `ranking_pipeline.mdx` ↔ `ranking_rules.mdx` | Pipeline = how they work together; rules = individual reference |
| Facets | `filter_with_facets.mdx` ↔ `build_faceted_navigation.mdx` | Clarify: API features vs UI implementation pattern |
| SSO | `security/configure_sso.mdx` ↔ `teams/configure_sso_for_team.mdx` | Merge into one canonical SSO page |
| Role permissions | 3 pages in Teams section | Single source of truth |

### 2. Inconsistent Conventions (Medium Impact)

| Convention | Variants found | Recommendation |
|---|---|---|
| URL placeholder | `MEILISEARCH_URL` vs `http://localhost:7700` | Standardize on `MEILISEARCH_URL` everywhere |
| Code samples | Imported `<CodeSamples*>` components vs inline curl | Prefer imported snippets; use inline only when snippets don't exist |
| Ranking rule names | `attribute` (legacy) vs `attributeRank`/`wordPosition` (new) | Use new names; add a deprecation note for legacy |
| Index name in examples | `movie` vs `movies` | Standardize on `movies` (plural) |
| Example timestamps | 2021, 2024, 2025 | Update all to 2025-2026 |
| Model names in chat examples | `gpt-3.5-turbo`, `gpt-4o`, `gpt-4o-mini` | Use `gpt-4o-mini` consistently (current default) |

### 3. Missing Security Guidance in Frontend Examples (Medium Impact)

Multiple pages show client-side JavaScript with API keys without warning against using master/admin keys:
- `build_faceted_navigation.mdx`
- `build_unified_search_bar.mdx`
- `display_source_documents.mdx`

**Recommendation:** Add a standard `<Warning>` callout to all frontend examples: "Always use a search-only API key in client-side code. Never expose your master or admin API key."

### 4. Link Verification Needed (Medium Impact)

Internal links that need verification against the current file structure:
- `/reference/api/chats/update-chat` (overview.mdx in conversational search)
- `/reference/api/documents/list-documents-with-get` (used for uploads — WRONG)
- `/reference/api/settings/update-rankingrules`
- `/resources/internals/concat#split-queries`
- `/resources/internals/datatypes#string`
- `/resources/self_hosting/configuration/reference#search-personalization`
- `/capabilities/indexing/how_to/optimize_batch_performance`

### 5. Missing "Getting Started" Consistency (Low Impact)

Getting-started pages vary wildly in scope:
- **Good examples**: Indexing (focused 5-min tutorial), Conversational Search (clear step-by-step)
- **Overloaded**: Geo Search (367 lines, duplicates all how-to content)
- **Misleading scope**: Filtering/Sorting/Faceting (only covers filtering)

**Recommendation:** Define a standard getting-started template: Prerequisites → 3-5 steps → Verify results → Next steps cards. Maximum ~150 lines.

---

## Critical Bugs & Factual Errors

These issues could directly cause user confusion or broken implementations:

| # | Severity | Issue | Location | Fix |
|---|----------|-------|----------|-----|
| 1 | Critical | `_geoPolygon` + `_geo` behavior contradiction | `geo_search/getting_started.mdx` vs `filter_by_geo_polygon.mdx` | Determine correct behavior, update both pages |
| 2 | Critical | `_geoRadius` shows 4 params (with `resolution`) in one place, 3 params elsewhere | `geo_search/getting_started.mdx` vs `filter_by_geo_radius.mdx` | Verify API, standardize |
| 3 | Critical | Broken link: `list-documents-with-get` used for document upload | `hybrid_search/` (2 files) | Change to `add-or-replace-documents` |
| 4 | Critical | `dairy_product` vs `dairy_products` typo in filter syntax reference | `filter_expression_syntax.mdx` | Fix the field name |
| 5 | Critical | `facetsDistribution` (wrong) vs `facetDistribution` (correct) | `filter_with_facets.mdx` | Fix the field name |
| 6 | Critical | Tool schema: `documents` typed as `"object"` instead of `"array"` | `chat_tooling_reference.mdx` | Fix the JSON schema |
| 7 | Critical | Swapped table columns give incorrect optimization advice | `optimize_batch_performance.mdx` | Swap description/optimization columns |
| 8 | High | Cohere `input_type` automatic switching may be incorrect | `configure_cohere_embedder.mdx` | Verify against actual API behavior |
| 9 | High | Missing `stream: true` in OpenAI SDK example — code won't stream | `conversational_search/getting_started.mdx` | Add `stream: true` parameter |
| 10 | High | Error object `code`/`type` fields swapped vs current API | `async_operations.mdx` | Update to match current error format |
| 11 | High | 5 stale "November 2025 rollout" disclaimers | Analytics section (5 files) | Remove all 5 |
| 12 | High | SSO protocol contradiction: "SAML only" vs "SAML or OIDC" | Security vs Teams SSO pages | Reconcile |
| 13 | High | Incorrect API endpoint for index creation in federated search tutorial | `federated_search.mdx` | Fix endpoint path |

---

## Content Gaps & Missing Pages

### Pages That Should Be Created

| Topic | Suggested location | Rationale |
|-------|-------------------|-----------|
| Capabilities landing/index page | `capabilities/overview.mdx` | No entry point for the tab; users need orientation |
| Conversation context management | `conversational_search/how_to/manage_conversation_context.mdx` | `_meiliAppendConversationMessage` is critical but underdocumented |
| Error handling for chat streaming | `conversational_search/how_to/handle_streaming_errors.mdx` | No error handling guidance for SSE streams |
| `showMatchesPosition` parameter | `full_text_search/how_to/use_match_positions.mdx` | Useful parameter for custom highlighting, not covered anywhere |
| Embedder comparison table | Expand `choose_an_embedder.mdx` | Current page is too brief; users need a decision matrix |
| Privacy & compliance for personalization | `personalization/advanced/privacy_considerations.mdx` | User profiling has GDPR implications |
| Facet search endpoint | `filtering_sorting_faceting/how_to/use_facet_search.mdx` | Facet search endpoint is documented in API but has no capability guide |

### Content That Should Be Expanded

| Page | What to add |
|------|-------------|
| `generate_token_from_scratch.mdx` | Actual encoding/signing code examples (currently just describes the concept) |
| `events_endpoint.mdx` | Required/optional field markers, error responses, rate limits, complete example |
| `analytics/getting_started.mdx` | Section on default metrics and dashboard access before custom events |
| `manage_task_database.mdx` | Task deletion, cleanup behavior, storage limits (or rename to "Paginating tasks") |
| `manage_team_roles.mdx` | How to remove team members |
| `choose_an_embedder.mdx` | Comparison table with cost, latency, accuracy, multilingual support |

---

## Priority Action Items

### P0 — Fix Immediately (Factual Errors / Broken Code)

1. Fix `dairy_product` → `dairy_products` typos in filter expression syntax reference
2. Fix `facetsDistribution` → `facetDistribution` typo
3. Fix broken document endpoint links in hybrid search (2 files)
4. Fix tool schema: `documents` type from `"object"` to `"array"` in chat tooling reference
5. Fix swapped table columns in `optimize_batch_performance.mdx`
6. Remove all 5 stale "November 2025" analytics disclaimers
7. Fix missing `stream: true` in conversational search OpenAI SDK example
8. Fix `_geoRadius` parameter count inconsistency (3 vs 4 params)
9. Resolve `_geoPolygon` + `_geo` behavior contradiction in geo search

### P1 — Fix Soon (Accuracy & Consistency)

10. Verify and correct Cohere `input_type` automatic switching claim
11. Reconcile SSO protocol support across Security and Teams pages
12. Fix error object format in `async_operations.mdx`
13. Fix all geo how-to "overview" cards pointing to wrong page
14. Standardize ranking rule naming (legacy `attribute` vs new `attributeRank`/`wordPosition`)
15. Fix `documentAddition` → `documentAdditionOrUpdate` in filter tasks warning
16. Add `Authorization` headers to personalization curl examples
17. Fix incorrect federated search API endpoint for index creation
18. Update example timestamps from 2021 to recent dates
19. Fix title/sidebar mismatches in indexing section

### P2 — Improve (Quality & Completeness)

20. Address content duplication (highlighting, searchable attributes, facets, SSO)
21. Create canonical permissions table for Teams section
22. Expand `generate_token_from_scratch.mdx` with actual code
23. Expand `events_endpoint.mdx` into a proper reference
24. Add security warnings to all frontend JavaScript examples
25. Add Python examples to conversational search section
26. Standardize getting-started page scope across all sections
27. Create Capabilities landing page

### P3 — Nice to Have (New Content)

28. Create conversation context management how-to guide
29. Create `showMatchesPosition` how-to guide
30. Create embedder comparison table/decision matrix
31. Add privacy/GDPR page for personalization
32. Add cross-section "Related capabilities" links
33. Create facet search endpoint how-to guide
34. Add troubleshooting sections to embedder configuration pages

---

## Appendix: Per-File Summary

### Full-Text Search (22 files)

| File | Quality | Key Issue |
|------|---------|-----------|
| `overview.mdx` | ★★★★★ | None — could add link to advanced section |
| `getting_started/placeholder_search.mdx` | ★★★★☆ | `MEILISEARCH_URL` not explained for newcomers |
| `getting_started/search_with_snippets.mdx` | ★★★☆☆ | Heavy duplication with highlight how-to |
| `getting_started/phrase_search.mdx` | ★★★★☆ | Missing info on phrase + typo tolerance interaction |
| `how_to/configure_searchable_attributes.mdx` | ★★★★★ | Minor overlap with relevancy page |
| `how_to/configure_stop_words.mdx` | ★★★★★ | Verify stop words in phrase search behavior |
| `how_to/configure_prefix_search.mdx` | ★★★★☆ | Typo: "adventure" listed twice |
| `how_to/highlight_search_results.mdx` | ★★★☆☆ | Heavy duplication with getting_started snippets page |
| `how_to/use_matching_strategy.mdx` | ★★★★★ | None |
| `how_to/configure_search_cutoff.mdx` | ★★★★★ | None |
| `advanced/ranking_pipeline.mdx` | ★★★★★ | Overlaps with ranking_rules.mdx |
| `advanced/performance_tuning.mdx` | ★★★★☆ | Verify cross-links to indexing section |
| `relevancy/relevancy.mdx` | ★★★☆☆ | Redundant "Behavior" and "How ranking works" sections |
| `relevancy/ranking_rules.mdx` | ★★★☆☆ | Duplicate "## 4." headings; legacy/new rule confusion |
| `relevancy/custom_ranking_rules.mdx` | ★★★★☆ | Clarify sorting behavior for different data types |
| `relevancy/ranking_score.mdx` | ★★★★☆ | Inconsistent URL placeholder |
| `relevancy/attribute_ranking_order.mdx` | ★★★☆☆ | Too brief; needs more examples |
| `relevancy/typo_tolerance_settings.mdx` | ★★★★☆ | "see below" links to different page |
| `relevancy/typo_tolerance_calculations.mdx` | ★★★★☆ | Cross-reference says "above" instead of naming the other page |
| `relevancy/distinct_attribute.mdx` | ★★★★☆ | Comparison table for index vs search-time would help |
| `relevancy/displayed_searchable_attributes.mdx` | ★★★☆☆ | Overlaps with how-to; mentions "implementation bug" |
| `relevancy/synonyms.mdx` | ★★★★☆ | Example result counts depend on dataset state |

### Hybrid Search (14 files)

| File | Quality | Key Issue |
|------|---------|-----------|
| `overview.mdx` | ★★★★☆ | Ollama not listed; key concepts could be defined |
| `getting_started.mdx` | ★★★★★ | "LLM" terminology inaccurate for embedding models |
| `how_to/choose_an_embedder.mdx` | ★★☆☆☆ | Too brief; no comparison table; missing Cohere |
| `how_to/configure_rest_embedder.mdx` | ★★★★★ | Minor `header`/`headers` typo in conclusion |
| `how_to/configure_openai_embedder.mdx` | ★★★★☆ | Verify minimum version; `documentTemplate` link target |
| `how_to/configure_cohere_embedder.mdx` | ★★★☆☆ | Potentially incorrect `input_type` claim |
| `how_to/configure_huggingface_embedder.mdx` | ★★★★☆ | No GPU info; no model caching info |
| `how_to/search_with_user_provided_embeddings.mdx` | ★★☆☆☆ | Broken link; no concrete `_vectors` example |
| `how_to/image_search_with_multimodal.mdx` | ★★★☆☆ | Broken link; fragment name inconsistency; experimental warning weak |
| `how_to/image_search_with_user_embeddings.mdx` | ★★☆☆☆ | Same description as multimodal; no code examples |
| `how_to/retrieve_similar_documents.mdx` | ★★★★☆ | Duplicate H1 heading |
| `advanced/semantic_vs_hybrid.mdx` | ★★★★★ | None — standout page |
| `advanced/document_template_best_practices.mdx` | ★★★★☆ | Missing `documentTemplateMaxBytes` mention |
| `advanced/custom_hybrid_ranking.mdx` | ★★★★★ | JSON comments (`//`) invalid |

### Conversational Search (7 files)

| File | Quality | Key Issue |
|------|---------|-----------|
| `overview.mdx` | ★★★★☆ | MCP section thin; description typo |
| `getting_started.mdx` | ★★★★☆ | Missing `stream: true`; deprecated model name |
| `how_to/configure_chat_workspace.mdx` | ★★★★☆ | Description mentions "tools" but page doesn't cover them |
| `how_to/stream_chat_responses.mdx` | ★★★★☆ | `process.stdout.write` in "browser" example |
| `how_to/configure_guardrails.mdx` | ★★★★★ | Excellent — no major issues |
| `how_to/display_source_documents.mdx` | ★★★☆☆ | SSE chunk handling gap; `innerHTML` XSS |
| `how_to/chat_tooling_reference.mdx` | ★★★☆☆ | `documents` type wrong; `_meiliAppendConversationMessage` underdocumented |

### Indexing (11 files)

| File | Quality | Key Issue |
|------|---------|-----------|
| `overview.mdx` | ★★★★★ | None |
| `getting_started.mdx` | ★★★★★ | SDK link too specific (JavaScript only) |
| `how_to/add_and_update_documents.mdx` | ★★★★★ | Missing delete-by-batch code sample |
| `how_to/handle_multilingual_data.mdx` | ★★★★☆ | Missing curl example for query locales |
| `how_to/monitor_tasks.mdx` | ★★★★☆ | Title mismatch; `movie` vs `movies` |
| `how_to/filter_tasks.mdx` | ★★★★☆ | Wrong type name `documentAddition` |
| `how_to/manage_task_database.mdx` | ★★★☆☆ | Title overpromises; content only covers pagination |
| `how_to/optimize_batch_performance.mdx` | ★★★★☆ | Swapped table columns (critical) |
| `advanced/indexing_best_practices.mdx` | ★★★★☆ | Grammar error; thin multilingual section |
| `advanced/tokenization.mdx` | ★★★★★ | None — well-written educational content |
| `advanced/async_operations.mdx` | ★★★★☆ | JSON syntax error; error format outdated |

### Filtering, Sorting & Faceting (8 files)

| File | Quality | Key Issue |
|------|---------|-----------|
| `overview.mdx` | ★★★★★ | None |
| `getting_started.mdx` | ★★★☆☆ | Only covers filtering; no Next steps |
| `how_to/filter_with_facets.mdx` | ★★★☆☆ | `facetsDistribution` typo; overlap with navigation page |
| `how_to/sort_results.mdx` | ★★★★☆ | Verify ranking rule names |
| `how_to/filter_and_sort_by_date.mdx` | ★★★★☆ | Missing string date filter example |
| `how_to/combine_filters_and_sort.mdx` | ★★★★☆ | Simplified ranking explanation could mislead |
| `how_to/build_faceted_navigation.mdx` | ★★★★☆ | Overlap with facets page; security concern |
| `advanced/filter_expression_syntax.mdx` | ★★★★☆ | Field name typos; `TO` description inconsistency |

### Multi-Search (6 files)

| File | Quality | Key Issue |
|------|---------|-----------|
| `overview.mdx` | ★★★★★ | None |
| `getting_started/multi_search.mdx` | ★★★★☆ | Minor terminology nit |
| `getting_started/federated_search.mdx` | ★★★☆☆ | Wrong API endpoint; unexplained `semanticHitCount` |
| `how_to/boost_results_across_indexes.mdx` | ★★★★★ | None |
| `how_to/search_with_different_filters.mdx` | ★★★★☆ | Hardcoded year in example |
| `how_to/build_unified_search_bar.mdx` | ★★★★☆ | No security warning; no debounce mention |

### Geo Search (7 files)

| File | Quality | Key Issue |
|------|---------|-----------|
| `overview.mdx` | ★★★★☆ | Missing some how-to cards |
| `getting_started.mdx` | ★★☆☆☆ | Too long; contradicts how-to pages; `resolution` param mystery |
| `how_to/filter_by_geo_radius.mdx` | ★★★★★ | Mislabeled "overview" card |
| `how_to/filter_by_geo_bounding_box.mdx` | ★★★★☆ | `_geoDistance: 0` may confuse; mislabeled card |
| `how_to/filter_by_geo_polygon.mdx` | ★★★☆☆ | `_geo` behavior contradicts getting_started |
| `how_to/sort_by_geo_point.mdx` | ★★★★★ | Mislabeled "overview" card |
| `how_to/use_geojson_format.mdx` | ★★★★☆ | `filterableAttributes` config unclear for `_geojson`-only docs |

### Security (7 files)

| File | Quality | Key Issue |
|------|---------|-----------|
| `overview.mdx` | ★★★★☆ | Missing network security cross-link |
| `getting_started.mdx` | ★★★★☆ | Title/sidebar mismatch; grammar error |
| `how_to/generate_token_third_party.mdx` | ★★★★☆ | CommonJS only; version too specific |
| `how_to/generate_token_from_scratch.mdx` | ★★☆☆☆ | Missing actual code examples |
| `how_to/configure_sso.mdx` | ★★★★☆ | Old Azure AD name; contradicts Teams SSO |
| `how_to/manage_api_keys.mdx` | ★★★★★ | Verify actions table completeness |
| `advanced/tenant_token_payload.mdx` | ★★★★★ | Invalid UUID format in example |

### Analytics (8 files)

| File | Quality | Key Issue |
|------|---------|-----------|
| `overview.mdx` | ★★★★☆ | Self-hosted guidance vague; missing Next steps cards |
| `getting_started.mdx` | ★★★☆☆ | Stale Nov 2025 note; jumps into advanced topics |
| `how_to/bind_events_to_user.mdx` | ★★★★☆ | Stale note; contradictory user ID guidance |
| `how_to/track_click_events.mdx` | ★★★★★ | Stale note; consider `sendBeacon` mention |
| `how_to/track_conversion_events.mdx` | ★★★★★ | Stale note |
| `advanced/analytics_metrics.mdx` | ★★★★☆ | CTR definition ambiguous |
| `advanced/events_endpoint.mdx` | ★★☆☆☆ | Too thin; missing required fields, errors, examples |
| `advanced/migrate_analytics.mdx` | ★★★★☆ | Should be archived or marked complete |

### Personalization (4 files)

| File | Quality | Key Issue |
|------|---------|-----------|
| `overview.mdx` | ★★★★☆ | No experimental banner |
| `getting_started.mdx` | ★★★☆☆ | Unexplained Cohere dependency |
| `how_to/generate_user_context.mdx` | ★★★★☆ | Missing auth header; no privacy notes |
| `how_to/personalize_ecommerce_search.mdx` | ★★★★★ | Missing auth header |

### Teams (4 files)

| File | Quality | Key Issue |
|------|---------|-----------|
| `overview.mdx` | ★★★☆☆ | Redundant roles info; grammar; no SSO link |
| `getting_started.mdx` | ★★★★☆ | Permission table inconsistent with overview |
| `how_to/manage_team_roles.mdx` | ★★★★☆ | Third permission variant; missing "remove member" |
| `how_to/configure_sso_for_team.mdx` | ★★★☆☆ | Contradicts security SSO page on protocol support |

---

*Report generated by Claude 4.6 Opus after reading all 80+ files in the capabilities section.*
