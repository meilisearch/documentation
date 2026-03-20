Scan the documentation for broken internal links, orphaned pages, and redirect chain issues.

## Steps

### 1. Broken internal links
Search all .mdx files (excluding `snippets/`, `reference/api_v0/`, `changelog/`) for markdown links matching the pattern `](/path...)`. For each link:
- Strip any anchor (`#...`) from the path
- Check if a corresponding .mdx file exists at that path
- If not, check if the path is covered by a redirect in docs.json
- Report any links that point to neither an existing file nor a redirect

### 2. Orphaned pages
List all .mdx files under the main content directories (`getting_started/`, `learn/`, `reference/`, `resources/`, `guides/`) and check if each appears in the docs.json navigation. Exclude:
- `snippets/` (include files, expected orphans)
- `reference/api_v0/` (archived, in .mintignore)
- Files that are the target of an `openapi:` directive
- `home.mdx` (Mintlify landing page)

### 3. Redirect chains
Check the `redirects` array in docs.json for chains: where a redirect's `destination` is itself a `source` of another redirect. Report any chains found.

### 4. Missing nav pages
Check every page listed in docs.json navigation and verify the corresponding .mdx file exists on disk.

## Output
Report findings grouped by category. For broken links, show the file containing the link and the broken target path. For orphaned pages, list the file paths. Keep the output concise.
