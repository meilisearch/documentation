#!/usr/bin/env bash
# Rebuilds the `mintlify-staging` search index from the live docs site, using the repo's scraper config.
# This DELETES and recreates `mintlify-staging`. It never touches `mintlify-production`
# (production is rebuilt by .github/workflows/scraper.yml when changes land on `main`).
#
# Requires Docker, jq, and a .env file at the repo root with:
#   MEILISEARCH_API_KEY=...        master key of the Meilisearch instance (documents/edit needs it)
#   MEILISEARCH_HOST_URL=...       optional, defaults to the docs search instance
#   OPENAI_API_KEY=...             optional, enables the embedder. Without it, staging has no embedders
#                                  and search.js must not use hybrid search against it
#
# Note: it scrapes the deployed site (meilisearch.com/docs), not your local files.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
STAGING_INDEX="mintlify-staging"
DEFAULT_HOST_URL="https://ms-909f535664f8-173.lon.meilisearch.io"

if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$ROOT_DIR/.env"
  set +a
fi

: "${MEILISEARCH_API_KEY:?MEILISEARCH_API_KEY is missing (add it to .env)}"
HOST_URL="${MEILISEARCH_HOST_URL:-$DEFAULT_HOST_URL}"

CONFIG_FILE="$(mktemp -t docs-scraper-staging.XXXXXX)"
trap 'rm -f "$CONFIG_FILE"' EXIT

# Derive the staging config from the repo config so the two never drift
if [ -n "${OPENAI_API_KEY:-}" ]; then
  jq --arg index "$STAGING_INDEX" --arg key "$OPENAI_API_KEY" \
    '.index_uid = $index | .custom_settings.embedders.default.apiKey = $key' \
    "$ROOT_DIR/docs-scraper.config.json" > "$CONFIG_FILE"
else
  echo "OPENAI_API_KEY not set: staging will have no embedders"
  jq --arg index "$STAGING_INDEX" \
    '.index_uid = $index | del(.custom_settings.embedders)' \
    "$ROOT_DIR/docs-scraper.config.json" > "$CONFIG_FILE"
fi

if [ "$(jq -r '.index_uid' "$CONFIG_FILE")" != "$STAGING_INDEX" ]; then
  echo "Refusing to run: derived config does not target $STAGING_INDEX" >&2
  exit 1
fi

echo "Rebuilding $STAGING_INDEX on $HOST_URL"
docker run --rm \
  -e MEILISEARCH_HOST_URL="$HOST_URL" \
  -e MEILISEARCH_API_KEY="$MEILISEARCH_API_KEY" \
  -v "$CONFIG_FILE":/docs-scraper/config.json \
  getmeili/docs-scraper:v0.12.8 pipenv run ./docs_scraper config.json

bash "$ROOT_DIR/scripts/search/post-scrape-edit.sh" "$HOST_URL" "$MEILISEARCH_API_KEY" "$STAGING_INDEX"

echo "Done. $STAGING_INDEX is rebuilt."
