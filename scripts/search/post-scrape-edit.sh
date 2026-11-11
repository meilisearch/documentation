#!/usr/bin/env bash
# Adds derived fields to every document of a docs search index, then waits for the task to finish.
# Used by the scraper workflow (production) and by rebuild-staging.sh (staging).
#
# Fields:
#   section: first path segment after /docs/, used for the section filters
#   is_page: 1 for the page record (no anchor), 0 for sections. Used by the `is_page:desc` ranking rule
#
# Needs a key allowed to call `documents/edit`. Today only the master key can.
#
# Usage: post-scrape-edit.sh <host_url> <api_key> <index_uid>
set -euo pipefail

HOST_URL="${1:?host URL required}"
API_KEY="${2:?API key required}"
INDEX_UID="${3:?index uid required}"

FUNCTION='let url_parts = doc.url.split("/docs/"); if url_parts.len() > 1 { let after_docs = url_parts[1]; let section_parts = after_docs.split("/"); if section_parts.len() > 0 { doc.section = section_parts[0]; } } doc.is_page = if doc.anchor == () { 1 } else { 0 };'

task_uid=$(jq -n --arg function "$FUNCTION" '{filter: "url IS NOT NULL", function: $function}' |
  curl -sS --fail-with-body -X POST "$HOST_URL/indexes/$INDEX_UID/documents/edit" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    --data-binary @- | jq -r '.taskUid')
echo "Edit task $task_uid enqueued on $INDEX_UID"

while true; do
  status=$(curl -sS --fail-with-body "$HOST_URL/tasks/$task_uid" -H "Authorization: Bearer $API_KEY" | jq -r '.status')
  case "$status" in
    succeeded) echo "Edit task $task_uid succeeded"; break ;;
    failed|canceled) echo "Edit task $task_uid $status" >&2; exit 1 ;;
    *) sleep 2 ;;
  esac
done
