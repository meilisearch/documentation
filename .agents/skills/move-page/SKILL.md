---
name: move-page
description: Move a documentation page from one path to another, handling navigation, redirects, and internal links. Use when moving a docs page, putting an existing page under another navigation group, tab, or section, or regrouping pages in config/navigation.json.
---

Move a documentation page from one path to another, handling all side effects.

Arguments: $ARGUMENTS (format: `<old-path> <new-path>`, e.g. `resources/self_hosting/docker resources/self_hosting/getting_started/docker`)

Putting an existing page under another navigation group is a move. The page path follows its place in the navigation, so pick a new path that matches the new group. Do not only edit `config/navigation.json`: the URL would keep the old section. If keeping the old URL seems intended, ask first.

## Steps

1. **Validate**: Check that the source .mdx file exists and the destination directory exists (create it if needed)
2. **Move the file**: Use `git mv` to move the .mdx file from old path to new path
3. **Update navigation**: Find the old path in the `pages` arrays of `config/navigation.json` and replace it with the new path, in the target group
4. **Add a redirect**: Add an entry to `config/redirects.json` mapping the old path to the new path, both with a leading `/`
5. **Fix redirect destinations**: Check if any existing redirects in `config/redirects.json` have the old path as their `destination` and update them to point to the new path (prevent redirect chains)
6. **Fix all internal links**: Search ALL .mdx files in the repo (excluding `snippets/`, `reference/api_v0/`, and `changelog/`) for links containing the old path and update them to the new path. Be careful to preserve anchors (e.g. `old-path#section` becomes `new-path#section`)
7. **Report**: List all files modified and the total number of links updated

Important:
- Arguments should NOT include the `.mdx` extension or leading `/`
- Do NOT modify the `source` fields in `config/redirects.json` (those are backward-compat sources)
- Do NOT touch files in `snippets/`, `reference/api_v0/`, or `changelog/`
