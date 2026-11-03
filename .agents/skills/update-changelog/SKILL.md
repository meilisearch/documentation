---
name: update-changelog
description: Update the changelog from GitHub releases. Use when generating changelog pages from GitHub releases.
---

Update the changelog from GitHub releases.

## Steps

1. **Generate the changelog**:
   ```
   npm run generate-changelog
   ```

2. **Review the output**: Check for any errors or warnings from the script.

3. **Verify the generated files**:
   - New version page under `changelog/vX.Y.mdx`
   - Index cards updated in root `changelog.mdx` (latest 10 versions)
   - `config/navigation.json` Changelog group lists the new page

4. **One-time migration** (already done on main): split the legacy monolith with `npm run split-changelog` if `changelog/changelog.mdx` still exists.

5. **Report**: Summarize what was generated:
   - Number of new releases added
   - Any releases that failed to generate
   - Whether navigation was updated automatically

## URLs

- Index: `/changelog` (`changelog.mdx`)
- Version: `/changelog/vX.Y` (`changelog/vX.Y.mdx`)
- Legacy `/changelog/changelog` redirects to `/changelog`
