Analyze redirects using real traffic data from Fathom Analytics. Finds missing redirects (old URLs people still visit) and unused redirects (redirects nobody hits).

## Prerequisites

Requires `FATHOM_API_KEY` and `FATHOM_SITE_ID` in `.env` at the repo root.

## Steps

### 1. Run the script

Run `node scripts/check-missing-redirects.mjs` and wait for it to complete. The script:
- Fetches all `/docs/*` page views from Fathom Analytics (last 90 days)
- Fetches the production sitemap to know all live pages (including OpenAPI-generated routes)
- Walks local .mdx files for pages not yet deployed
- Compares traffic against known pages + existing redirects in docs.json
- Reports two lists: missing redirects and unused redirects
- Filters out junk URLs (trailing dots, double /docs/, internal Mintlify props, error pages)
- Only reports URLs with >= 10 views

### 2. Review missing redirects

For each missing redirect, find the best destination page:
- Search local .mdx files and docs.json navigation for the matching topic
- Check the production sitemap for similar paths
- Prefer the most specific match (e.g. `/guides/laravel_scout` -> `/getting_started/frameworks/laravel`)
- If no good match exists, redirect to the closest parent or overview page

### 3. Review unused redirects

These are redirects in docs.json that got zero traffic in 90 days. They are safe to remove to keep docs.json clean. Remove them from the `redirects` array.

### 4. Apply changes

- Add missing redirects to the `redirects` array in docs.json
- Remove unused redirects from docs.json
- Validate docs.json is still valid JSON
- Re-run the script to confirm 0 missing and 0 unused

## Output

Report:
- How many missing redirects were found and added (with the top 5 by traffic)
- How many unused redirects were removed
- Final redirect count in docs.json
- Confirmation that the re-run shows 0/0
