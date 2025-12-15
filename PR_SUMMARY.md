# Documentation Restructure Summary

**273 files changed** | +22,264 lines | -5,897 lines | **332 redirects**

## File Statistics

| Status | Count | Description |
|--------|-------|-------------|
| Added | 106 | New pages and files |
| Renamed | 105 | Moved to new locations |
| Modified | 46 | Updated content |
| Deleted | 16 | Merged or removed |

---

## New Navigation Structure (6 Tabs)

### 1. Getting Started (NEW)

```
getting_started/
├── overview.mdx (NEW)
├── features.mdx (NEW)
├── what_is_meilisearch.mdx
├── cloud_quick_start.mdx
├── sdks/ (10 NEW)
│   ├── javascript, python, php, ruby, go, rust
│   ├── java, dotnet, swift, dart
├── instant_meilisearch/ (4)
│   ├── javascript (NEW), react, vue, docsearch
├── frameworks/ (4)
│   ├── laravel, rails, strapi, symfony (NEW)
└── integrations/ (6)
    ├── firebase (NEW), gatsby (NEW), vercel, postman
    ├── meilisearch_importer (NEW), meilisync (NEW)
```

### 2. Products (NEW - capability-based)

```
products/
├── full_text_search/ (10)
│   ├── overview (NEW), ranking_rules, custom_ranking_rules
│   ├── query_processing (NEW - merged concat+prefix)
│   ├── synonyms, typo_tolerance_*, distinct_attribute, displayed_searchable_attributes
├── ai_powered_search/ (10)
│   ├── overview (NEW), getting_started, choose_an_embedder
│   ├── difference_full_text_ai_search, document_template_best_practices
│   └── image_search_*, search_with_user_provided_embeddings, retrieve_related_search_results
├── conversational_search/ (3)
│   ├── overview (NEW), getting_started, chat_tooling_reference
├── faceted_search/ (7)
│   ├── overview (NEW), filter_search_results, search_with_facet_filters
│   ├── sort_search_results, working_with_dates, filter_expression_reference, facet_types
├── geo_search/ (4 - RESTRUCTURED)
│   ├── overview, preparing_documents (NEW), filtering (NEW), sorting (NEW)
├── multi_search/ (4)
├── personalization/ (3)
├── analytics/ (6)
├── platform/ (13)
└── indexing/ (8)
```

### 3. References

```
reference/api/settings/ (22 NEW sub-pages)
├── displayed-attributes, searchable-attributes, filterable-attributes
├── sortable-attributes, ranking-rules, stop-words, synonyms
├── distinct-attribute, typo-tolerance, faceting, pagination
├── dictionary, separator-tokens, non-separator-tokens, localized-attributes
├── facet-search, prefix-search, search-cutoff, proximity-precision
├── embedders, chat, vector-store
```

### 4. Guides

```
guides/
├── ai_embedders/
│   ├── providers/ (7): openai, huggingface, cohere, mistral, cloudflare, voyage, gemini
│   ├── langchain, mcp, huggingface_gpu
├── performance/ (2): large_documents, pagination
└── security/ (2): laravel_multitenancy, nodejs_multitenancy
```

### 5. Resources (NEW)

```
resources/
├── demos/ (13 NEW)
│   ├── overview, where_to_watch, ecommerce, saas
│   ├── flickr, music, moma, nobel_prizes, geosearch
│   ├── tenant_tokens, typo_tolerance, voice_search, rubygems
├── self_hosting/
│   ├── getting_started (NEW - merged 3 pages)
│   ├── configuration
│   ├── deployment/ (4): aws (NEW), gcp (NEW), azure (NEW), digitalocean
│   ├── security/ (2): master_api_keys (NEW - merged 3), http2_ssl
│   ├── data_backup/ (3): dumps, snapshots, snapshots_vs_dumps
│   └── performance/ (1): ram_multithreading
├── migration/ (4)
├── comparisons/ (9 - 8 NEW): algolia, elasticsearch, typesense, postgresql, pinecone, qdrant, opensearch, mongodb, alternatives
├── internals/ (3): storage, datatypes, telemetry
├── help/ (7): faq, known_limitations, experimental_features, language, sdks, versioning, contributing_docs
└── archives/ (1): search_preview
```

### 6. Changelog (NEW)

```
changelog/changelog.mdx
```

---

## Key Changes

### Content Merges (16 deleted → merged)

| Deleted | Merged Into |
|---------|-------------|
| `learn/self_hosted/install_meilisearch_locally.mdx` | `resources/self_hosting/getting_started.mdx` |
| `learn/self_hosted/supported_os.mdx` | `resources/self_hosting/getting_started.mdx` |
| `learn/self_hosted/getting_started_with_self_hosted_meilisearch.mdx` | `resources/self_hosting/getting_started.mdx` |
| `guides/docker.mdx` | `resources/self_hosting/getting_started.mdx` |
| `learn/security/differences_master_api_keys.mdx` | `resources/self_hosting/security/master_api_keys.mdx` |
| `learn/security/resetting_master_key.mdx` | `resources/self_hosting/security/master_api_keys.mdx` |
| `learn/security/protected_unprotected.mdx` | Deleted (redirect to master_api_keys) |
| `learn/engine/concat.mdx` | `products/full_text_search/query_processing.mdx` |
| `learn/engine/prefix.mdx` | `products/full_text_search/query_processing.mdx` |
| `learn/relevancy/relevancy.mdx` | `products/full_text_search/ranking_rules.mdx` |
| `learn/chat/conversational_search.mdx` | `products/conversational_search/overview.mdx` |
| `learn/filtering_and_sorting/facets_vs_filters.mdx` | `products/faceted_search/overview.mdx` |
| `learn/filtering_and_sorting/geosearch.mdx` | Split into filtering.mdx + sorting.mdx |

### New Content Created

| Category | Files | Description |
|----------|-------|-------------|
| SDK guides | 10 | Java, .NET, Swift, Dart, Go, Rust, JS, Python, PHP, Ruby |
| Framework guide | 1 | Symfony |
| Integration guides | 4 | Firebase, Gatsby, meilisearch_importer, meilisync |
| Deployment guides | 3 | AWS, GCP, Azure |
| Demo pages | 13 | Showcase of official demos |
| Comparison pages | 8 | Algolia, Elasticsearch, Typesense, etc. |
| Settings sub-pages | 22 | Split from monolithic settings.mdx |
| Product overviews | 10 | Each product group has overview |

### Code Samples Updated

- All 26 code sample snippets updated to use `${MEILISEARCH_URL}` and `${MEILISEARCH_API_KEY}` environment variables
- Removed hardcoded `localhost:7700` references

---

## Redirects

**332 total redirects** configured for backward compatibility, including:

- All `learn/*` → `products/*` or `resources/*` paths
- All `guides/embedders/*` → `guides/ai_embedders/providers/*`
- Settings sub-pages
- Merged/deleted pages
