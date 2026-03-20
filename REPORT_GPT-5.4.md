# Capabilities documentation review

Author: GPT-5.4
Date: 2026-03-20
Scope: `docs.json` Capabilities tab plus every MDX page under `capabilities/`
Pages reviewed: 98

## Executive summary

The Capabilities tab is already one of the strongest parts of the Meilisearch documentation. It has good breadth, a clear sectioned structure, and many practical guides that show real workflows instead of only listing API options. In particular, `full_text_search`, `indexing`, `filtering_sorting_faceting`, and parts of `hybrid_search` feel substantial and close to production-ready.

That said, the section is not yet editorially consistent enough to serve as a completely polished product surface. The biggest problems are not lack of content volume, but inconsistency:

- a few pages appear to contradict each other
- some sections mix Cloud, self-hosted, enterprise, and experimental behavior without enough framing
- some capability areas contain too much overlap between one large starter page and several smaller how-to pages
- naming is not always aligned between sidebar groups, filenames, titles, and the actual user journey
- some newer AI-related areas still feel like separate doc clusters rather than one cohesive information architecture

My overall assessment is:

| Dimension | Assessment |
|---|---|
| Coverage | Strong |
| Information architecture | Good, but uneven by section |
| Clarity | Generally good |
| Internal consistency | Needs work |
| Discoverability | Good for mature sections, weaker for new AI sections |
| Editorial maturity | Medium |
| Immediate next step | Fix contradictions and normalize structure before adding much more content |

## Review method

I reviewed the Capabilities navigation in `docs.json` and inspected all 98 MDX pages under `capabilities/`. I also cross-checked several suspected contradictions directly in the source to separate confirmed issues from broader editorial recommendations.

This report focuses on:

- content organization
- clarity of the user journey
- consistency between related pages
- obvious factual or internal contradictions
- missing topics and weak transitions
- what should come next in development of this documentation area

## Section inventory

| Section | Approximate status | Notes |
|---|---|---|
| `capabilities/full_text_search` | Strong | Best-developed capability cluster; minor duplication and pathing issues |
| `capabilities/hybrid_search` | Good but unstable | Rich content, but terminology and framing need consolidation |
| `capabilities/geo_search` | Medium | Useful pages, but redundant structure and one major inconsistency |
| `capabilities/conversational_search` | Good | Strong end-to-end narrative; needs sharper implementation guidance |
| `capabilities/multi_search` | Good | Clear conceptually; missing limits and edge cases |
| `capabilities/filtering_sorting_faceting` | Strong | Practical and useful, but slightly fragmented |
| `capabilities/personalization` | Medium | Promising but still thin and under-scoped |
| `capabilities/analytics` | Medium to good | Valuable content, but Cloud scope and schema consistency need work |
| `capabilities/security` | Good | Strong tenant-token material; SSO docs need reconciliation |
| `capabilities/teams` | Medium | Clear enough, but shallow and slightly contradictory around owner flow |
| `capabilities/indexing` | Strong | One of the clearest areas; could use better consolidation of task-related topics |

## What already works well

### 1. The Capabilities tab is conceptually well chosen

The tab structure maps to product capabilities instead of API route families. That is the right decision. It gives users a problem-oriented entry point and works especially well for topics like:

- full-text search
- hybrid search
- indexing
- filtering and faceting
- analytics

### 2. Mature sections use a solid documentation pattern

The best sections follow a recognizable pattern:

- an overview page for orientation
- a getting-started page for first implementation
- how-to pages for focused tasks
- advanced or theory pages for deeper understanding

This works especially well in:

- `capabilities/full_text_search`
- `capabilities/indexing`
- `capabilities/filtering_sorting_faceting`

### 3. Many guides are genuinely practical

A lot of the documentation is written around realistic user stories instead of abstract parameter explanations. Examples:

- CRM examples in `capabilities/multi_search`
- ecommerce cases in `capabilities/personalization`
- result presentation examples in `capabilities/full_text_search`
- operational indexing content in `capabilities/indexing`

This is one of the strongest traits of the whole area.

### 4. Cross-links are better than average

Compared with many doc sites, this area often links to sibling pages, reference pages, or related concepts. That helps. The problem is not total absence of links; it is that cross-linking is stronger in older, more mature areas than in newer AI and Cloud-heavy areas.

## Confirmed issues that should be fixed first

These are the highest-confidence issues I found and would treat as the first batch of work.

| Priority | Issue | Files | Why it matters | Recommendation |
|---|---|---|---|---|
| P0 | SSO protocol mismatch | `capabilities/security/how_to/configure_sso.mdx`, `capabilities/teams/how_to/configure_sso_for_team.mdx` | One page says Meilisearch Cloud supports SAML 2.0; the other tells users to create a SAML or OIDC app. That is a direct contradiction. | Reconcile with product reality and keep one canonical protocol story. |
| P0 | `_geoRadius` syntax inconsistency | `capabilities/geo_search/getting_started.mdx`, `capabilities/geo_search/how_to/filter_by_geo_radius.mdx` | One page documents `_geoRadius(lat, lng, distance_in_meters, resolution)`, another documents `_geoRadius(lat, lng, distanceInMeters)`. This is exactly the kind of contradiction that breaks trust. | Verify the engine behavior and correct all geo pages to match one canonical syntax. |
| P0 | REST embedder field name mismatch | `capabilities/hybrid_search/how_to/configure_rest_embedder.mdx` | The guide correctly teaches `headers`, but the conclusion switches to `header`. That invites copy-paste errors. | Replace `header` with `headers` everywhere. |
| P1 | Federated search typo | `capabilities/multi_search/getting_started/federated_search.mdx` | The prose says results from index `profile` rank higher, while the actual index used everywhere else is `profiles`. | Fix the index name. |
| P1 | Contradiction around image support | `capabilities/hybrid_search/how_to/choose_an_embedder.mdx`, `capabilities/hybrid_search/how_to/image_search_with_multimodal.mdx` | One page says Meilisearch does not support searching images or non-text content, while another page documents multimodal image search. | Add scope language such as "except experimental multimodal setups" or otherwise clarify the distinction. |
| P1 | Analytics schema/message tension | `capabilities/analytics/advanced/events_endpoint.mdx` | The page note says a user identifier must be provided for click and conversion tracking, but the example JSON omits `userId`. | Make the example and table consistent with the requirement. |
| P1 | Owner flow ambiguity in Teams | `capabilities/teams/getting_started.mdx`, `capabilities/teams/overview.mdx`, `capabilities/teams/how_to/manage_team_roles.mdx` | The getting-started flow says you can invite a member as Owner or Member, while other pages clearly say a team can have only one owner. | Clarify whether "invite as owner" means ownership transfer or whether this should be restricted. |
| P2 | Terminology typo | `capabilities/conversational_search/overview.mdx` | "informational-dense" should almost certainly be "information-dense". | Fix wording. |
| P2 | Variable name mismatch in multimodal guide | `capabilities/hybrid_search/how_to/image_search_with_multimodal.mdx` | The JSON uses `TEXTUAL_FRAGMENT_NAME`, while the explanatory paragraph refers to `TEXT_FRAGMENT_NAME`. | Normalize names in code and prose. |
| P3 | Minor wording issue in prefix search | `capabilities/full_text_search/how_to/configure_prefix_search.mdx` | One example sentence repeats "adventure" twice. | Clean the example text. |

## Structural and editorial problems across the whole Capabilities tab

### 1. The biggest issue is not missing content, but uneven content architecture

Some sections are elegant and disciplined. Others are clearly still growing and do not yet share the same editorial model.

The result is that users get different kinds of experiences depending on where they enter:

- mature sections feel like a coherent documentation product
- newer sections feel like a cluster of individual pages
- some pages feel conceptual, some tutorial, some pseudo-reference, but the boundaries are not always stated

### 2. Several sections duplicate themselves internally

This is most visible in:

- `capabilities/geo_search`
- `capabilities/full_text_search`
- parts of `capabilities/conversational_search`
- parts of `capabilities/analytics`

The pattern is usually:

- one broad getting-started page covering most of the concept
- multiple how-to pages that then repeat the same prerequisites, examples, or explanations

This is not a fatal problem, but it makes the area feel heavier than it is and increases maintenance cost.

### 3. Cloud vs self-hosted vs experimental scoping is uneven

This is one of the most important editorial issues in the whole Capabilities tab.

Users should never have to infer whether a feature is:

- available only in Meilisearch Cloud
- available only on enterprise plans
- available in self-hosted Meilisearch
- experimental or gated
- dependent on third-party providers such as OpenAI or Cohere

Some pages do this well. Others do not. This is especially visible in:

- `capabilities/hybrid_search`
- `capabilities/conversational_search`
- `capabilities/personalization`
- `capabilities/analytics`
- `capabilities/teams`
- `capabilities/security`

### 4. Naming drift weakens discoverability

There are multiple places where the path, page title, sidebar grouping, and conceptual role of a page do not fully align.

Examples:

- `capabilities/filtering_sorting_faceting/getting_started.mdx` is effectively a full filter guide, not just a starter
- `capabilities/indexing/how_to/monitor_tasks.mdx` is titled "Working with tasks"
- `capabilities/hybrid_search/how_to/retrieve_similar_documents.mdx` is conceptually about related results, not only documents
- hybrid pages mix the labels "hybrid", "semantic", "AI-powered", and sometimes "vector"

This does not break the docs, but it makes the whole tab feel less intentionally designed than it should.

## Section-by-section review

## Full-text search

### Overall assessment

This is the strongest area in the entire Capabilities tab. It has a credible structure, good conceptual depth, practical how-tos, and a strong theory layer through the `relevancy` subsection.

### What works

- excellent breadth
- strong connection between concept and practice
- good use of overview cards
- strong internal depth around ranking, synonyms, typo tolerance, and ranking scores
- good pairing of conceptual docs like `ranking_pipeline.mdx` with practical configuration pages

### What is weak

- `overview.mdx` points users first to placeholder search, which is useful but not necessarily the most natural first full-text search entry point
- `getting_started/search_with_snippets.mdx` and `how_to/highlight_search_results.mdx` overlap significantly
- some pages would benefit from clearer prerequisite sections or sharper boundaries between concept and implementation

### Missing or underdeveloped topics

- a cleaner bridge between basic query shaping and response shaping
- stronger explanation of when to use each result presentation technique
- possibly a short "first search UX decisions" page linking snippets, highlights, phrase search, matching strategy, and prefix behavior

### Recommendation

Do not rewrite this section. Refine it. It is already a strong foundation.

## Hybrid search

### Overall assessment

This area is rich and strategically important, but it is one of the least normalized sections in the whole tab. The content is there, but the story is not yet fully unified.

### What works

- strong provider-specific guides
- good progression from overview to advanced ranking
- useful advanced content such as `semantic_vs_hybrid.mdx` and `custom_hybrid_ranking.mdx`
- `document_template_best_practices.mdx` addresses a real implementation problem that many users will face

### What is weak

- terminology drift: hybrid, semantic, AI-powered, vector-like behavior, and multimodal concepts are not consistently framed
- Cloud, self-hosted, provider-specific, and experimental concerns are mixed without enough standardization
- some titles and filenames do not align with the actual content role
- some configuration details still feel like fast-moving product docs rather than hardened documentation

### Missing or underdeveloped topics

- a single decision page: when to use REST embedder vs provider-specific embedders vs user-provided embeddings
- clearer statement of availability by environment and plan
- a provider comparison matrix, especially if Ollama or other local-provider workflows are intended to be supported conceptually
- stronger fallback guidance when embeddings fail or when providers are rate-limited

### Recommendation

This section should be treated as a major editorial consolidation project, not just a bug-fix area.

## Geo search

### Overall assessment

Useful and actionable, but structurally one of the least efficient sections.

### What works

- the overview is short and easy to understand
- the atomic how-to pages are good in isolation
- `use_geojson_format.mdx` is especially valuable because it addresses a real and common source of confusion

### What is weak

- the section duplicates itself heavily between `getting_started.mdx` and the individual how-to pages
- naming alternates between "Geo search" and "Geosearch"
- there is a confirmed syntax inconsistency around `_geoRadius`
- at least one card/label flow in the area points in a way that may confuse users about overview vs getting started

### Missing or underdeveloped topics

- performance expectations or limits for geo filtering and polygon use
- a clearer explanation of when to use `_geo`, `_geojson`, and when both fields are present
- a more explicit bridge into filtering and sorting docs

### Recommendation

This section should be slimmed and clarified. It does not need more pages yet. It needs less duplication and one canonical syntax story.

## Conversational search

### Overall assessment

A strong and modern doc set, but one that still needs a more careful implementation lens.

### What works

- good overview of the capability
- strong getting-started story
- useful dedicated pages for workspace configuration, streaming, guardrails, and source display
- good attempt to document tooling and chat-specific implementation details

### What is weak

- there is overlap between `getting_started.mdx` and `configure_chat_workspace.mdx`
- some examples need stronger real-world caveats, especially for streaming and tool-call handling
- the section should more explicitly connect to hybrid search, since the two capabilities are closely linked

### Missing or underdeveloped topics

- a robust guide for handling streamed tool-call payload assembly
- clearer history-management patterns for client applications
- better separation between conceptual RAG explanation and Meilisearch-specific implementation behavior

### Recommendation

Keep investing here, but focus on implementation reliability. The biggest risk is not lack of ideas; it is examples that are conceptually right but operationally incomplete.

## Multi-search

### Overall assessment

A clean and understandable section that explains the capability well.

### What works

- strong overview of multi-search vs federated search
- concrete, accessible examples
- good explanation of weights and filtered queries
- practical frontend-oriented guide for unified search UI

### What is weak

- there is not enough documentation around limits, payload size, scaling expectations, or edge cases
- the relationship between multi-search and hybrid/semantic use cases could be made clearer
- some prose polish is still needed

### Missing or underdeveloped topics

- performance and limit guidance
- best practices for ranking across indexes at scale
- clearer explanation of when federated search is a product decision vs a query construction trick

### Recommendation

This section is in good shape and mainly needs expansion, not restructuring.

## Filtering, sorting, and faceting

### Overall assessment

One of the most practically useful sections in the entire tab.

### What works

- strong overview page
- good practical guides for filtering, sorting, date workflows, and faceting
- excellent advanced page on filter expression syntax
- clear connection to real UI patterns

### What is weak

- `getting_started.mdx` behaves more like a full guide than a starter page
- facet-related guides overlap somewhat in setup and examples
- geo connections are not surfaced as strongly as they could be from this section

### Missing or underdeveloped topics

- a more direct bridge to facet-search API behavior
- stronger conceptual summary of facet types and returned facet data
- more explicit connection to geo filtering as a sibling capability

### Recommendation

This is a strong section. Small IA refinements and cross-links would make it feel complete.

## Personalization

### Overall assessment

Promising but still early. The section is useful, but it does not yet feel as complete or self-contained as the mature capability areas.

### What works

- compact structure
- good explanation of user context generation
- good ecommerce-oriented walkthrough
- helpful connection to analytics

### What is weak

- provider and environment assumptions are not surfaced early enough
- the capability feels narrow and somewhat fragile from the documentation alone
- there is not enough explanation of operational tradeoffs

### Missing or underdeveloped topics

- privacy implications of user context
- fallback behavior when personalization is unavailable
- latency expectations
- evaluation and A/B testing guidance
- stronger explanation of availability and enablement

### Recommendation

Do not expand this section by adding many new how-to pages yet. First strengthen the conceptual frame and operational guidance.

## Analytics

### Overall assessment

Useful and relevant, but currently inconsistent in its scope messaging.

### What works

- good overall value proposition
- clear event-tracking guides
- useful reference page for metrics
- migration content is especially valuable and concrete

### What is weak

- repeated rollout context across multiple pages
- Cloud-only messaging is not standardized enough
- the event schema page should be more authoritative and internally consistent

### Missing or underdeveloped topics

- a concise analytics architecture page linking search, `queryUid`, user identity, clicks, conversions, and dashboards
- clearer self-hosted vs Cloud language at the top of every page
- troubleshooting and validation patterns for event ingestion

### Recommendation

This area needs normalization more than expansion. Make one page authoritative for the event model, then simplify the others.

## Security and tenant tokens

### Overall assessment

A good section overall, especially around tenant tokens.

### What works

- strong overview and token-generation pathways
- useful payload reference
- practical guide to managing API keys

### What is weak

- SSO content is currently split in a way that creates contradiction
- there is some redundancy between the two tenant-token generation approaches
- the section could do a better job of distinguishing user identity, API access, team access, and multitenancy access models

### Missing or underdeveloped topics

- a decision page for API keys vs tenant tokens vs SSO vs team permissions
- a stronger bridge to filter syntax from tenant-token docs
- a canonical entry point for SSO that teams docs can defer to

### Recommendation

Fix the SSO contradiction first, then strengthen the access-control story as a whole.

## Teams

### Overall assessment

Clear enough, but comparatively shallow.

### What works

- easy to understand
- practical member-management orientation
- useful role page
- useful team-specific SSO page if reconciled with security docs

### What is weak

- owner workflow is ambiguous
- the section is small enough that every inconsistency becomes more noticeable
- it is not always obvious when a user should read Teams docs vs Security docs for Cloud identity topics

### Missing or underdeveloped topics

- lifecycle of team ownership transfer
- relationship between team roles, project visibility, API key visibility, and security boundaries
- stronger links back into Cloud operational docs if those exist elsewhere

### Recommendation

Keep the section small, but make it much sharper. This is a precision-editing area.

## Indexing

### Overall assessment

Another strong section and one of the best examples of practical documentation in the repository.

### What works

- clear overview and starter flow
- strong document ingestion guidance
- good practical task-management content
- useful advanced pages on tokenization and asynchronous operations
- good operational tone

### What is weak

- task documentation is distributed across multiple pages and may feel fragmented to new users
- some title/slug alignment issues make the area feel slightly less polished than it is
- some performance guidance overlaps with other sections

### Missing or underdeveloped topics

- index lifecycle tasks such as swap/rename strategies in a capability-oriented way
- a zero-downtime indexing playbook
- stronger bridge from indexing design to search quality outcomes

### Recommendation

This section does not need a major rewrite. It needs consolidation and a few stronger connective pages.

## Missing content across the Capabilities tab

These are the most important missing topics or doc patterns.

### 1. A capability chooser page

The documentation would benefit from a top-level page answering:

- when to use full-text search
- when to use hybrid search
- when to use conversational search
- when to use multi-search
- when to use personalization
- how these capabilities combine

Right now that logic is spread across several overviews.

### 2. Standard environment banners

Every capability page touching Cloud, enterprise, external providers, or experimental features should use a standard top-of-page pattern that answers:

- available in self-hosted?
- available in Cloud?
- enterprise only?
- experimental?
- third-party account required?

### 3. Standard implementation patterns for AI features

The newer AI-related areas would benefit from a reusable editorial template:

- what the feature does
- availability and requirements
- minimal setup
- production concerns
- failure modes
- cost and latency concerns
- next related pages

### 4. Stronger operational guidance

Several sections explain how to enable a capability, but not enough about how to run it well. This is especially true for:

- personalization
- conversational search
- analytics
- hybrid search

### 5. More decision-support content

There are many good how-to pages, but fewer decision pages. Users often need help choosing, not just executing.

## Recommended roadmap for the next development phase

## Phase 1: Correctness and trust

This should happen first.

- fix all confirmed contradictions listed above
- reconcile SSO docs into one canonical truth
- reconcile geo syntax across all geo pages
- clean copy-paste hazards in hybrid docs
- align analytics schema examples with requirements
- clarify the team owner flow

## Phase 2: Normalize the information architecture

Once the correctness issues are fixed:

- reduce duplication in `geo_search`
- reduce duplication between snippets/highlighting pages in `full_text_search`
- clarify page roles in `conversational_search`
- normalize titles, slugs, sidebar labels, and page intent across the tab

## Phase 3: Standardize framing for Cloud, experimental, and provider-dependent features

This is especially important for AI and Cloud-heavy capability sections.

- create a reusable availability pattern
- add explicit environment callouts to all relevant pages
- standardize wording for experimental features
- standardize wording for provider dependencies

## Phase 4: Fill the most important conceptual gaps

After the structure is stable:

- create a capability chooser page
- add a hybrid decision matrix
- add stronger personalization operational guidance
- add analytics architecture/troubleshooting guidance
- add indexing lifecycle playbooks

## Phase 5: Editorial hardening

This is what turns the area from good to excellent.

- define a tighter style pattern for capability pages
- standardize intro sections, requirements, and next steps
- review titles and sidebar labels for consistency
- make sure each section has one obvious "start here" path

## What I would not do next

There are some things I would avoid right now.

- I would not add lots of new pages before fixing contradictions and duplication.
- I would not heavily redesign the mature sections like `full_text_search` or `indexing`.
- I would not keep building AI-related sections without first standardizing availability, vocabulary, and implementation framing.

## Recommended immediate worklist

If the goal is to improve this part of the docs efficiently, this is the order I would use:

1. Fix the confirmed contradictions and copy-paste hazards.
2. Reconcile the SSO story between Security and Teams.
3. Reconcile the geo syntax story and simplify the Geo search section.
4. Normalize Hybrid search terminology and availability framing.
5. Make Analytics and Personalization more explicit about Cloud/provider scope.
6. Add one capability chooser page linking the whole tab together.

## Appendix: per-section page assessment

This appendix is intentionally concise. It is meant to help prioritize future passes.

### Full-text search

- `capabilities/full_text_search/overview.mdx`: strong hub page; first-step choice could be more intuitive
- `capabilities/full_text_search/getting_started/placeholder_search.mdx`: clear and useful
- `capabilities/full_text_search/getting_started/search_with_snippets.mdx`: good tutorial; overlaps with highlighting
- `capabilities/full_text_search/getting_started/phrase_search.mdx`: clear and focused
- `capabilities/full_text_search/how_to/configure_searchable_attributes.mdx`: strong practical guide
- `capabilities/full_text_search/how_to/configure_stop_words.mdx`: solid and clear
- `capabilities/full_text_search/how_to/configure_prefix_search.mdx`: useful; minor wording cleanup needed
- `capabilities/full_text_search/how_to/highlight_search_results.mdx`: useful, but too close to snippets page
- `capabilities/full_text_search/how_to/use_matching_strategy.mdx`: clear and helpful
- `capabilities/full_text_search/how_to/configure_search_cutoff.mdx`: practical performance doc
- `capabilities/full_text_search/advanced/ranking_pipeline.mdx`: excellent conceptual page
- `capabilities/full_text_search/advanced/performance_tuning.mdx`: useful summary page
- `capabilities/full_text_search/relevancy/relevancy.mdx`: good conceptual entry point
- `capabilities/full_text_search/relevancy/ranking_rules.mdx`: strong reference-like explanation
- `capabilities/full_text_search/relevancy/custom_ranking_rules.mdx`: clear and useful
- `capabilities/full_text_search/relevancy/ranking_score.mdx`: strong, but examples could be even clearer
- `capabilities/full_text_search/relevancy/attribute_ranking_order.mdx`: concise and good
- `capabilities/full_text_search/relevancy/typo_tolerance_settings.mdx`: useful configuration page
- `capabilities/full_text_search/relevancy/typo_tolerance_calculations.mdx`: valuable theory page
- `capabilities/full_text_search/relevancy/distinct_attribute.mdx`: practical and understandable
- `capabilities/full_text_search/relevancy/displayed_searchable_attributes.mdx`: good bridge page
- `capabilities/full_text_search/relevancy/synonyms.mdx`: rich and useful

### Hybrid search

- `capabilities/hybrid_search/overview.mdx`: good overview, but terminology normalization needed
- `capabilities/hybrid_search/getting_started.mdx`: strong entry point; links should favor sibling capability docs more often
- `capabilities/hybrid_search/how_to/choose_an_embedder.mdx`: useful decision guide; needs image-support clarification
- `capabilities/hybrid_search/how_to/configure_rest_embedder.mdx`: very valuable; needs cleanup for correctness
- `capabilities/hybrid_search/how_to/configure_openai_embedder.mdx`: strong provider guide
- `capabilities/hybrid_search/how_to/configure_cohere_embedder.mdx`: useful and readable
- `capabilities/hybrid_search/how_to/configure_huggingface_embedder.mdx`: good self-hosted framing
- `capabilities/hybrid_search/how_to/search_with_user_provided_embeddings.mdx`: important but comparatively thin
- `capabilities/hybrid_search/how_to/image_search_with_multimodal.mdx`: valuable advanced guide; some naming cleanup needed
- `capabilities/hybrid_search/how_to/image_search_with_user_embeddings.mdx`: good complement; could be more explicit about differences from multimodal guide
- `capabilities/hybrid_search/how_to/retrieve_similar_documents.mdx`: useful, but title/URL intent should be aligned
- `capabilities/hybrid_search/advanced/semantic_vs_hybrid.mdx`: excellent decision-support page
- `capabilities/hybrid_search/advanced/document_template_best_practices.mdx`: useful and important
- `capabilities/hybrid_search/advanced/custom_hybrid_ranking.mdx`: strong advanced content

### Geo search

- `capabilities/geo_search/overview.mdx`: good concise overview
- `capabilities/geo_search/getting_started.mdx`: useful, but too large relative to sibling how-to pages
- `capabilities/geo_search/how_to/filter_by_geo_radius.mdx`: clear but involved in syntax inconsistency
- `capabilities/geo_search/how_to/filter_by_geo_bounding_box.mdx`: solid
- `capabilities/geo_search/how_to/filter_by_geo_polygon.mdx`: useful and reasonably clear
- `capabilities/geo_search/how_to/sort_by_geo_point.mdx`: practical and good
- `capabilities/geo_search/how_to/use_geojson_format.mdx`: one of the strongest pages in the section

### Conversational search

- `capabilities/conversational_search/overview.mdx`: good positioning page; typo fix needed
- `capabilities/conversational_search/getting_started.mdx`: strong end-to-end page
- `capabilities/conversational_search/how_to/configure_chat_workspace.mdx`: useful but overlaps starter content
- `capabilities/conversational_search/how_to/stream_chat_responses.mdx`: strong topic choice; implementation caveats could be stronger
- `capabilities/conversational_search/how_to/configure_guardrails.mdx`: useful and practical
- `capabilities/conversational_search/how_to/display_source_documents.mdx`: valuable UX-oriented page
- `capabilities/conversational_search/how_to/chat_tooling_reference.mdx`: important page; should stay tightly maintained

### Multi-search

- `capabilities/multi_search/overview.mdx`: clear and effective
- `capabilities/multi_search/getting_started/multi_search.mdx`: solid starter page
- `capabilities/multi_search/getting_started/federated_search.mdx`: good walkthrough; minor typo fix needed
- `capabilities/multi_search/how_to/boost_results_across_indexes.mdx`: useful and practical
- `capabilities/multi_search/how_to/search_with_different_filters.mdx`: strong example-driven page
- `capabilities/multi_search/how_to/build_unified_search_bar.mdx`: good product-facing implementation guide

### Filtering, sorting, and faceting

- `capabilities/filtering_sorting_faceting/overview.mdx`: strong overview page
- `capabilities/filtering_sorting_faceting/getting_started.mdx`: very useful, but more than a getting-started page
- `capabilities/filtering_sorting_faceting/how_to/filter_with_facets.mdx`: strong
- `capabilities/filtering_sorting_faceting/how_to/sort_results.mdx`: strong
- `capabilities/filtering_sorting_faceting/how_to/filter_and_sort_by_date.mdx`: practical and focused
- `capabilities/filtering_sorting_faceting/how_to/combine_filters_and_sort.mdx`: clear and useful
- `capabilities/filtering_sorting_faceting/how_to/build_faceted_navigation.mdx`: useful, with some overlap to facet page
- `capabilities/filtering_sorting_faceting/advanced/filter_expression_syntax.mdx`: excellent advanced page

### Personalization

- `capabilities/personalization/overview.mdx`: good high-level framing
- `capabilities/personalization/getting_started.mdx`: useful but would benefit from stronger availability context
- `capabilities/personalization/how_to/generate_user_context.mdx`: practical and valuable
- `capabilities/personalization/how_to/personalize_ecommerce_search.mdx`: good narrative page

### Analytics

- `capabilities/analytics/overview.mdx`: good summary page
- `capabilities/analytics/getting_started.mdx`: helpful, but repeats context also found elsewhere
- `capabilities/analytics/how_to/bind_events_to_user.mdx`: useful and concrete
- `capabilities/analytics/how_to/track_click_events.mdx`: strong implementation guide
- `capabilities/analytics/how_to/track_conversion_events.mdx`: strong implementation guide
- `capabilities/analytics/advanced/analytics_metrics.mdx`: valuable reference page
- `capabilities/analytics/advanced/events_endpoint.mdx`: important page that should become more authoritative
- `capabilities/analytics/advanced/migrate_analytics.mdx`: very useful migration page

### Security

- `capabilities/security/overview.mdx`: good overview
- `capabilities/security/getting_started.mdx`: clear and useful
- `capabilities/security/how_to/generate_token_third_party.mdx`: good guided approach
- `capabilities/security/how_to/generate_token_from_scratch.mdx`: acceptable conceptual fallback page
- `capabilities/security/how_to/configure_sso.mdx`: useful but currently contradicts Teams SSO
- `capabilities/security/how_to/manage_api_keys.mdx`: useful; should be verified against current API behavior
- `capabilities/security/advanced/tenant_token_payload.mdx`: strong reference page

### Teams

- `capabilities/teams/overview.mdx`: concise and clear
- `capabilities/teams/getting_started.mdx`: simple and useful; owner flow needs clarification
- `capabilities/teams/how_to/manage_team_roles.mdx`: useful and readable
- `capabilities/teams/how_to/configure_sso_for_team.mdx`: useful but must be reconciled with Security SSO

### Indexing

- `capabilities/indexing/overview.mdx`: strong overview
- `capabilities/indexing/getting_started.mdx`: excellent starter page
- `capabilities/indexing/how_to/add_and_update_documents.mdx`: strong practical guide
- `capabilities/indexing/how_to/handle_multilingual_data.mdx`: useful strategy page
- `capabilities/indexing/how_to/monitor_tasks.mdx`: useful; title alignment could improve
- `capabilities/indexing/how_to/filter_tasks.mdx`: practical and clear
- `capabilities/indexing/how_to/manage_task_database.mdx`: useful but could fit more clearly into the task-story set
- `capabilities/indexing/how_to/optimize_batch_performance.mdx`: important performance page
- `capabilities/indexing/advanced/indexing_best_practices.mdx`: strong
- `capabilities/indexing/advanced/tokenization.mdx`: good advanced page
- `capabilities/indexing/advanced/async_operations.mdx`: important and useful

## Final conclusion

The Capabilities tab does not need a full rewrite. It needs a correctness pass, an architecture-normalization pass, and then a targeted expansion pass.

If that order is respected, this part of the documentation can become a very strong product surface. If new content keeps being added without first fixing the contradictions and structure drift, the section will become harder to maintain and less trustworthy over time.
