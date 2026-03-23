Move a documentation page from one path to another, handling all side effects.

Arguments: $ARGUMENTS (format: `<old-path> <new-path>`, e.g. `resources/self_hosting/docker resources/self_hosting/getting_started/docker`)

## Steps

1. **Validate**: Check that the source .mdx file exists and the destination directory exists (create it if needed)
2. **Move the file**: Use `git mv` to move the .mdx file from old path to new path
3. **Update docs.json navigation**: Find the old path in the `pages` arrays and replace it with the new path
4. **Add a redirect**: Add a redirect entry in the `redirects` array of docs.json mapping the old path to the new path
5. **Fix redirect destinations**: Check if any existing redirects in docs.json have the old path as their `destination` and update them to point to the new path (prevent redirect chains)
6. **Fix all internal links**: Search ALL .mdx files in the repo (excluding `snippets/`, `reference/api_v0/`, and `changelog/`) for links containing the old path and update them to the new path. Be careful to preserve anchors (e.g. `old-path#section` becomes `new-path#section`)
7. **Report**: List all files modified and the total number of links updated

Important:
- Paths should NOT include the `.mdx` extension or leading `/`
- Do NOT modify links inside the `redirects` array source fields (those are backward-compat sources)
- Do NOT touch files in `snippets/`, `reference/api_v0/`, or `changelog/`
