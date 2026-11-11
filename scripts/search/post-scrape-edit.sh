#!/usr/bin/env bash
# Adds derived fields to every document of a docs search index, then waits for the task to finish.
# Used by the scraper workflow (production) and by rebuild-staging.sh (staging).
#
# Fields:
#   section: first path segment after /docs/, only if it is one of the docs sections below.
#            Used by the section filters. Documents outside these sections have no `section`.
#   is_page: 1 for the page record (no anchor), 0 for sections. Used by the `is_page:desc` ranking rule
#   is_error: 1 for the error pages, 0 otherwise. Used to rank error code results lower
#
# The sections must match SECTION_LABELS in search.js.
# Fields that search.js filters on must be listed in `filterableAttributes` in docs-scraper.config.json.
#
# Needs a key allowed to call `documents/edit`. Today only the master key can.
#
# Usage: post-scrape-edit.sh <host_url> <api_key> <index_uid>
set -euo pipefail

HOST_URL="${1:?host URL required}"
API_KEY="${2:?API key required}"
INDEX_UID="${3:?index uid required}"

# Rhai function. The URL fragment and query string are dropped first, because a
# top-level page URL like /docs/changelog#anchor would otherwise become a section.
FUNCTION='
let path = doc.url.split("#")[0].split("?")[0];
let parts = path.split("/docs/");
let first_segment = if parts.len() > 1 { parts[1].split("/")[0] } else { "" };
if ["getting_started", "capabilities", "reference", "resources", "changelog"].contains(first_segment) {
  doc.section = first_segment;
} else {
  doc.remove("section");
}
doc.is_page = if doc.anchor == () { 1 } else { 0 };
doc.is_error = if path.contains("/docs/reference/errors/") { 1 } else { 0 };
'

response=$(jq -n --arg function "$FUNCTION" '{filter: "url IS NOT NULL", function: $function}' |
  curl -sS --fail-with-body -X POST "$HOST_URL/indexes/$INDEX_UID/documents/edit" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    --data-binary @-) || { echo "Edit request failed: $response" >&2; exit 1; }
task_uid=$(jq -r '.taskUid' <<< "$response")
echo "Edit task $task_uid enqueued on $INDEX_UID"

while true; do
  status=$(curl -sS --fail-with-body "$HOST_URL/tasks/$task_uid" -H "Authorization: Bearer $API_KEY" | jq -r '.status')
  case "$status" in
    succeeded) echo "Edit task $task_uid succeeded"; break ;;
    failed|canceled) echo "Edit task $task_uid $status" >&2; exit 1 ;;
    *) sleep 2 ;;
  esac
done
