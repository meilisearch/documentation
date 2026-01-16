/**
 * Process a local Meilisearch OpenAPI spec, fix validation errors,
 * and inject SDK code samples from all language SDKs.
 *
 * This script:
 * 1. Reads the OpenAPI spec from a local file
 * 2. Fixes known validation issues (null descriptions in externalDocs)
 * 3. Fetches code samples from all SDK repos
 * 4. Matches samples to operations and injects x-codeSamples
 * 5. Saves the enhanced spec to reference/openapi.json
 *
 * Usage: npx tsx scripts/update-openapi-local.ts [path-to-openapi.json]
 * Default path: /Users/quentindequelen/Projects/Meilisearch/meilisearch/openapi.json
 */

import * as fs from "fs";
import * as path from "path";
import yaml from "js-yaml";

const DEFAULT_INPUT_PATH = "/Users/quentindequelen/Projects/Meilisearch/meilisearch/openapi.json";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const OUTPUT_PATH = path.join(SCRIPT_DIR, "..", "reference", "openapi.json");

// SDK repos to fetch code samples from
const SDK_REPOS = [
  { language: "bash", label: "cURL", project: "documentation" },
  { language: "javascript", label: "JavaScript", project: "meilisearch-js" },
  { language: "python", label: "Python", project: "meilisearch-python" },
  { language: "php", label: "PHP", project: "meilisearch-php" },
  { language: "java", label: "Java", project: "meilisearch-java" },
  { language: "ruby", label: "Ruby", project: "meilisearch-ruby" },
  { language: "go", label: "Go", project: "meilisearch-go" },
  { language: "csharp", label: "C#", project: "meilisearch-dotnet" },
  { language: "rust", label: "Rust", project: "meilisearch-rust" },
  { language: "swift", label: "Swift", project: "meilisearch-swift" },
  { language: "dart", label: "Dart", project: "meilisearch-dart" },
];

// Manual mapping for sample keys that don't auto-match
// Format: "sample_key" -> "operationId"
const MANUAL_MAPPING: Record<string, string> = {
  // Search
  "search_post_1": "search_with_post",
  "search_get_1": "search_with_url_query",
  // Indexes
  "get_one_index_1": "get_index",
  "list_all_indexes_1": "list_indexes",
  "create_an_index_1": "create_index",
  "update_an_index_1": "update_index",
  "delete_an_index_1": "delete_index",
  "swap_indexes_1": "swap_indexes",
  // Documents
  "get_one_document_1": "get_document",
  "get_documents_1": "get_documents",
  "get_documents_post_1": "documents_by_query_post",
  "add_or_replace_documents_1": "replace_documents",
  "add_or_update_documents_1": "update_documents",
  "delete_all_documents_1": "clear_all_documents",
  "delete_one_document_1": "delete_document",
  "delete_documents_by_batch_1": "delete_documents_batch",
  "delete_documents_by_filter_1": "delete_documents_by_filter",
  // Tasks
  "get_all_tasks_1": "get_tasks",
  "get_task_1": "get_task",
  "cancel_tasks_1": "cancel_tasks",
  "delete_tasks_1": "delete_tasks",
  // Batches
  "get_all_batches_1": "get_batches",
  "get_batch_1": "get_batch",
  // Keys - updated to match actual operationIds
  "get_one_key_1": "get_api_key",
  "get_all_keys_1": "list_api_keys",
  "create_a_key_1": "create_api_key",
  "update_a_key_1": "patch_api_key",
  "delete_a_key_1": "delete_api_key",
  // Settings - all
  "get_settings_1": "get_all",
  "update_settings_1": "update_all",
  "reset_settings_1": "delete_all",
  // Settings - individual (get/reset use standard names, update uses patch for some)
  "get_synonyms_1": "getsynonyms",
  "update_synonyms_1": "putsynonyms",
  "reset_synonyms_1": "deletesynonyms",
  "get_stop_words_1": "getstopWords",
  "update_stop_words_1": "putstopWords",
  "reset_stop_words_1": "deletestopWords",
  "get_ranking_rules_1": "getrankingRules",
  "update_ranking_rules_1": "putrankingRules",
  "reset_ranking_rules_1": "deleterankingRules",
  "get_distinct_attribute_1": "getdistinctAttribute",
  "update_distinct_attribute_1": "putdistinctAttribute",
  "reset_distinct_attribute_1": "deletedistinctAttribute",
  "get_filterable_attributes_1": "getfilterableAttributes",
  "update_filterable_attributes_1": "putfilterableAttributes",
  "reset_filterable_attributes_1": "deletefilterableAttributes",
  "get_searchable_attributes_1": "getsearchableAttributes",
  "update_searchable_attributes_1": "putsearchableAttributes",
  "reset_searchable_attributes_1": "deletesearchableAttributes",
  "get_displayed_attributes_1": "getdisplayedAttributes",
  "update_displayed_attributes_1": "putdisplayedAttributes",
  "reset_displayed_attributes_1": "deletedisplayedAttributes",
  "get_sortable_attributes_1": "getsortableAttributes",
  "update_sortable_attributes_1": "putsortableAttributes",
  "reset_sortable_attributes_1": "deletesortableAttributes",
  // Settings with patch operations
  "get_typo_tolerance_1": "gettypoTolerance",
  "update_typo_tolerance_1": "patchtypoTolerance",
  "reset_typo_tolerance_1": "deletetypoTolerance",
  "get_pagination_settings_1": "getpagination",
  "update_pagination_settings_1": "patchpagination",
  "reset_pagination_settings_1": "deletepagination",
  "get_faceting_settings_1": "getfaceting",
  "update_faceting_settings_1": "patchfaceting",
  "reset_faceting_settings_1": "deletefaceting",
  "get_dictionary_1": "getdictionary",
  "update_dictionary_1": "putdictionary",
  "reset_dictionary_1": "deletedictionary",
  "get_separator_tokens_1": "getseparatorTokens",
  "update_separator_tokens_1": "putseparatorTokens",
  "reset_separator_tokens_1": "deleteseparatorTokens",
  "get_non_separator_tokens_1": "getnonSeparatorTokens",
  "update_non_separator_tokens_1": "putnonSeparatorTokens",
  "reset_non_separator_tokens_1": "deletenonSeparatorTokens",
  "get_proximity_precision_settings_1": "getproximityPrecision",
  "update_proximity_precision_settings_1": "putproximityPrecision",
  "reset_proximity_precision_settings_1": "deleteproximityPrecision",
  "get_search_cutoff_1": "getsearchCutoffMs",
  "update_search_cutoff_1": "putsearchCutoffMs",
  "reset_search_cutoff_1": "deletesearchCutoffMs",
  "get_embedders_1": "getembedders",
  "update_embedders_1": "patchembedders",
  "reset_embedders_1": "deleteembedders",
  "get_facet_search_settings_1": "getfacetSearch",
  "update_facet_search_settings_1": "putfacetSearch",
  "reset_facet_search_settings_1": "deletefacetSearch",
  "get_prefix_search_settings_1": "getprefixSearch",
  "update_prefix_search_settings_1": "putprefixSearch",
  "reset_prefix_search_settings_1": "deleteprefixSearch",
  "get_localized_attribute_settings_1": "getlocalizedAttributes",
  "update_localized_attribute_settings_1": "putlocalizedAttributes",
  "reset_localized_attribute_settings_1": "deletelocalizedAttributes",
  "get_vector_store_settings_1": "getvectorStore",
  "update_vector_store_settings_1": "patchvectorStore",
  "reset_vector_store_settings_1": "deletevectorStore",
  // Other endpoints
  "facet_search_1": "search",
  "multi_search_1": "multi_search_with_post",
  "get_similar_post_1": "similar_post",
  "get_similar_get_1": "similar_get",
  "get_health_1": "get_health",
  "get_version_1": "get_version",
  "get_index_stats_1": "get_index_stats",
  "get_indexes_stats_1": "get_stats",
  "post_dump_1": "create_dump",
  "create_snapshot_1": "create_snapshot",
  "get_experimental_features_1": "get_features",
  "update_experimental_features_1": "patch_features",
  // Compact
  "compact_index_1": "compact",
  // Network
  "get_network_1": "get_network",
  "update_network_1": "patch_network",
  // Export
  "export_post_1": "export",
  // Webhooks
  "webhooks_get_1": "get_webhooks",
  "webhooks_get_single_1": "get_webhook",
  "webhooks_post_1": "post_webhook",
  "webhooks_patch_1": "patch_webhook",
  "webhooks_delete_1": "delete_webhook",
  // Metrics and Logs (experimental)
  "experimental_get_metrics_1": "get_metrics",
  "experimental_post_logs_stderr_1": "get_logs",
  // Additional mappings for variant samples
  "add_movies_json_1": "replace_documents",
  "rename_an_index_1": "update_index",
  "update_an_index_2": "update_index",
  "network_get": "get_network",
  "network_patch_1": "patch_network",
  "network_patch_2": "patch_network",
  "index_compact_1": "compact",
  "get_documents_by_ids_1": "documents_by_query_post",
  "delete_documents_1": "delete_documents_batch",
  "multi_search_federated_1": "multi_search_with_post",
  "multi_search_remote_federated_1": "multi_search_with_post",
};

interface CodeSample {
  lang: string;
  label: string;
  source: string;
}

interface Operation {
  operationId?: string;
  "x-codeSamples"?: CodeSample[];
  [key: string]: unknown;
}

interface OpenAPISpec {
  info?: {
    version?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  tags?: Array<{
    name?: string;
    externalDocs?: {
      url?: string;
      description?: string | null;
    };
  }>;
  paths?: Record<string, Record<string, Operation>>;
}

function loadLocalOpenAPI(inputPath: string): OpenAPISpec {
  console.log(`Loading OpenAPI spec from ${inputPath}...`);

  if (!fs.existsSync(inputPath)) {
    throw new Error(`File not found: ${inputPath}`);
  }

  const content = fs.readFileSync(inputPath, "utf-8");
  return JSON.parse(content) as OpenAPISpec;
}

async function fetchCodeSamples(): Promise<Map<string, CodeSample[]>> {
  console.log("\nFetching code samples from SDK repos...");
  const allSamples = new Map<string, CodeSample[]>();

  for (const sdk of SDK_REPOS) {
    const url = `https://raw.githubusercontent.com/meilisearch/${sdk.project}/main/.code-samples.meilisearch.yaml`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.log(`  Skipped ${sdk.project}: ${response.status}`);
        continue;
      }

      const text = await response.text();
      const samples = yaml.load(text) as Record<string, string>;

      for (const [sampleKey, code] of Object.entries(samples)) {
        if (!allSamples.has(sampleKey)) {
          allSamples.set(sampleKey, []);
        }
        allSamples.get(sampleKey)!.push({
          lang: sdk.language,
          label: sdk.label,
          source: code.trim()
        });
      }

      console.log(`  Loaded ${Object.keys(samples).length} samples from ${sdk.project}`);
    } catch (error) {
      console.log(`  Error fetching ${sdk.project}: ${error}`);
    }
  }

  console.log(`Total unique sample keys: ${allSamples.size}`);
  return allSamples;
}

function buildOperationMap(spec: OpenAPISpec): Map<string, { path: string; method: string; operation: Operation }> {
  const operationMap = new Map();

  if (spec.paths) {
    for (const [pathKey, methods] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(methods)) {
        if (operation && typeof operation === "object" && operation.operationId) {
          operationMap.set(operation.operationId, { path: pathKey, method, operation });
        }
      }
    }
  }

  return operationMap;
}

function matchSampleToOperation(
  sampleKey: string,
  operationMap: Map<string, { path: string; method: string; operation: Operation }>
): string | null {
  // Remove _1, _2 suffix for matching
  const baseKey = sampleKey.replace(/_\d+$/, "");

  // 1. Check manual mapping first
  if (MANUAL_MAPPING[sampleKey]) {
    const mappedId = MANUAL_MAPPING[sampleKey];
    if (operationMap.has(mappedId)) {
      return mappedId;
    }
  }

  // 2. Try exact match with operationId
  if (operationMap.has(baseKey)) {
    return baseKey;
  }

  // 3. Try lowercase match
  for (const opId of operationMap.keys()) {
    if (opId.toLowerCase() === baseKey.toLowerCase()) {
      return opId;
    }
  }

  return null;
}

function injectCodeSamples(
  spec: OpenAPISpec,
  samples: Map<string, CodeSample[]>
): { spec: OpenAPISpec; injectedCount: number; unmatchedSamples: string[] } {
  const operationMap = buildOperationMap(spec);
  let injectedCount = 0;
  const unmatchedSamples: string[] = [];
  const matchedOperations = new Set<string>();

  for (const [sampleKey, codeSamples] of samples) {
    const operationId = matchSampleToOperation(sampleKey, operationMap);

    if (operationId) {
      const { operation } = operationMap.get(operationId)!;

      // Initialize or append to x-codeSamples
      if (!operation["x-codeSamples"]) {
        operation["x-codeSamples"] = [];
      }

      // Only add samples if this operation hasn't been matched yet
      // (prevents duplicates from _1, _2 variants)
      if (!matchedOperations.has(operationId)) {
        operation["x-codeSamples"] = codeSamples;
        matchedOperations.add(operationId);
        injectedCount++;
      }
    } else {
      // Only report unmatched if it looks like an API sample (not guide samples)
      if (!sampleKey.includes("guide") && !sampleKey.includes("tutorial")) {
        unmatchedSamples.push(sampleKey);
      }
    }
  }

  return { spec, injectedCount, unmatchedSamples };
}

function fixOpenAPI(spec: OpenAPISpec): { spec: OpenAPISpec; fixesApplied: number } {
  let fixesApplied = 0;

  // Fix 1: Update servers to use absolute URLs (required for code sample generation)
  spec.servers = [
    {
      url: "https://your-instance.meilisearch.io",
      description: "Meilisearch Cloud"
    },
    {
      url: "http://localhost:7700",
      description: "Local server"
    }
  ];
  fixesApplied++;
  console.log("  Fixed: Updated servers with absolute URLs for code sample generation");

  // Fix 2: Remove null descriptions in externalDocs (tags)
  if (spec.tags) {
    for (const tag of spec.tags) {
      if (tag.externalDocs && tag.externalDocs.description === null) {
        delete tag.externalDocs.description;
        fixesApplied++;
        console.log(`  Fixed: Removed null description from tag '${tag.name || "unknown"}'`);
      }
    }
  }

  // Fix 3: Remove null descriptions in externalDocs (paths)
  if (spec.paths) {
    for (const [pathKey, methods] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(methods)) {
        if (operation && typeof operation === "object" && "externalDocs" in operation) {
          const op = operation as { externalDocs?: { description?: string | null } };
          if (op.externalDocs?.description === null) {
            delete op.externalDocs.description;
            fixesApplied++;
            console.log(`  Fixed: Removed null description from ${method.toUpperCase()} ${pathKey}`);
          }
        }
      }
    }
  }

  return { spec, fixesApplied };
}

function saveOpenAPI(spec: OpenAPISpec, outputPath: string): void {
  const dir = path.dirname(outputPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));
  console.log(`Saved enhanced OpenAPI spec to ${outputPath}`);
}

async function main(): Promise<void> {
  console.log("=".repeat(60));
  console.log("Meilisearch OpenAPI Spec Updater (Local) with SDK Code Samples");
  console.log("=".repeat(60));

  // Get input path from command line args or use default
  const inputPath = process.argv[2] || DEFAULT_INPUT_PATH;

  // Step 1: Load local OpenAPI spec
  const spec = loadLocalOpenAPI(inputPath);
  const specVersion = spec.info?.version || "unknown";
  console.log(`OpenAPI spec version: ${specVersion}`);

  // Step 2: Apply fixes
  console.log("\nApplying fixes...");
  const { spec: fixedSpec, fixesApplied } = fixOpenAPI(spec);
  console.log(`Total fixes applied: ${fixesApplied}`);

  // Step 3: Fetch code samples from all SDK repos
  const samples = await fetchCodeSamples();

  // Step 4: Match and inject code samples
  console.log("\nInjecting code samples...");
  const { spec: enhancedSpec, injectedCount, unmatchedSamples } = injectCodeSamples(fixedSpec, samples);
  console.log(`  Injected samples into ${injectedCount} operations`);

  if (unmatchedSamples.length > 0) {
    console.log(`  Unmatched API samples (${unmatchedSamples.length}):`);
    unmatchedSamples.slice(0, 10).forEach(s => console.log(`    - ${s}`));
    if (unmatchedSamples.length > 10) {
      console.log(`    ... and ${unmatchedSamples.length - 10} more`);
    }
  }

  // Step 5: Save
  console.log();
  saveOpenAPI(enhancedSpec, OUTPUT_PATH);

  console.log("\nDone!");
  console.log("SDK code samples are now embedded in the OpenAPI spec.");
}

main().catch(console.error);
