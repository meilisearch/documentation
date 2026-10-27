#!/usr/bin/env bash
# Adds derived fields to every document of a docs search index, then waits for the task to finish.
# Used by the scraper workflow (production) and by rebuild-staging.sh (staging).
#
# Fields:
#   section: first path segment after /docs/, used for the section filters
#   is_page: 1 for the page record (no anchor), 0 for sections. Used by the `is_page:desc` ranking rule
#
# The preferred way is the `documents/edit` route, which needs a key with the `documents.all` action.
# If the key is refused (403), the script falls back to computing the same fields locally with jq
# and sending a partial update, which only needs `documents.get` and `documents.add`.
# Keep both implementations in sync.
#
# Usage: post-scrape-edit.sh <host_url> <api_key> <index_uid>
set -euo pipefail

HOST_URL="${1:?host URL required}"
API_KEY="${2:?API key required}"
INDEX_UID="${3:?index uid required}"

FUNCTION='let url_parts = doc.url.split("/docs/"); if url_parts.len() > 1 { let after_docs = url_parts[1]; let section_parts = after_docs.split("/"); if section_parts.len() > 0 { doc.section = section_parts[0]; } } doc.is_page = if doc.anchor == () { 1 } else { 0 };'

wait_for_task() {
  local task_uid="$1" status
  while true; do
    status=$(curl -sS --fail-with-body "$HOST_URL/tasks/$task_uid" -H "Authorization: Bearer $API_KEY" | jq -r '.status')
    case "$status" in
      succeeded) echo "Task $task_uid succeeded"; return 0 ;;
      failed|canceled) echo "Task $task_uid $status" >&2; return 1 ;;
      *) sleep 2 ;;
    esac
  done
}

body_file="$(mktemp)"
trap 'rm -f "$body_file"' EXIT

http_code=$(jq -n --arg function "$FUNCTION" '{filter: "url IS NOT NULL", function: $function}' |
  curl -sS -o "$body_file" -w '%{http_code}' -X POST "$HOST_URL/indexes/$INDEX_UID/documents/edit" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    --data-binary @-)

if [ "$http_code" = "202" ]; then
  task_uid=$(jq -r '.taskUid' "$body_file")
  echo "Edit task $task_uid enqueued on $INDEX_UID"
  wait_for_task "$task_uid"
elif [ "$http_code" = "403" ]; then
  echo "documents/edit refused (key lacks documents.all), using the partial update fallback"
  curl -sS --fail-with-body -X POST "$HOST_URL/indexes/$INDEX_UID/documents/fetch" \
    -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
    -d '{"limit": 100000, "fields": ["objectID", "url", "anchor"]}' |
    jq '[.results[] | {objectID, is_page: (if .anchor == null then 1 else 0 end)}
         + (((.url | split("/docs/")) as $p | if ($p | length) > 1 then {section: ($p[1] | split("/")[0])} else {} end))]' > "$body_file"
  task_uid=$(curl -sS --fail-with-body -X PUT "$HOST_URL/indexes/$INDEX_UID/documents" \
    -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
    --data-binary @"$body_file" | jq -r '.taskUid')
  echo "Update task $task_uid enqueued on $INDEX_UID"
  wait_for_task "$task_uid"
else
  echo "documents/edit failed with HTTP $http_code: $(cat "$body_file")" >&2
  exit 1
fi
