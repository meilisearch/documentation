# Meilisearch Documentation

> **Note**: This project uses [bd (beads)](https://github.com/steveyegge/beads) for issue tracking.
> Use `bd` commands instead of markdown TODOs. See AGENTS.md for workflow details.

## Working relationship
- Push back on ideas when appropriate - cite sources and explain reasoning
- ALWAYS ask for clarification rather than making assumptions
- NEVER lie, guess, or make up anything
- Use `bd` for task tracking (see AGENTS.md for details)

## Project structure

```
documentation/
├── getting_started/          # Getting started tab
│   ├── overview.mdx
│   ├── features.mdx
│   ├── sdks/                 # Backend SDK quick starts
│   ├── instant_meilisearch/  # Frontend integrations
│   ├── frameworks/           # Laravel, Strapi, Rails
│   ├── integrations/         # Vercel, Postman
│   └── glossary/             # Documents, Indexes, Primary key
├── products/                 # Products tab - organized by capability
│   ├── full_text_search/
│   ├── ai_powered_search/
│   ├── conversational_search/
│   ├── faceted_search/
│   ├── geo_search/
│   ├── multi_search/
│   ├── personalization/
│   ├── analytics/
│   ├── platform/
│   └── indexing/
├── reference/                # References tab
│   ├── api/                  # API reference pages
│   └── errors/
├── guides/                   # Guides tab
│   ├── ai_embedders/
│   │   └── providers/        # OpenAI, Cohere, etc.
│   ├── performance/
│   ├── security/
│   └── comparisons/
├── resources/                # Resources tab
│   ├── self_hosting/
│   │   ├── security/
│   │   ├── data_backup/
│   │   ├── performance/
│   │   └── deployment/
│   ├── migration/
│   ├── internals/
│   ├── help/
│   └── archives/             # Deprecated pages (not in nav)
├── changelog/
├── snippets/                 # Reusable code samples
│   └── samples/
├── docs.json                 # Navigation config (PRIMARY)
├── new_docs.json             # Keep synced with docs.json
└── docs.json.backup          # Original backup
```

## Configuration files

### docs.json
- **Primary navigation config** - all tabs, groups, pages
- **Redirects** - backward compatibility for moved pages
- **API config** - OpenAPI spec, playground settings
- **Theme/branding** - colors, logos, footer

After editing docs.json, always sync: `cp docs.json new_docs.json`

### Page frontmatter (required)
```yaml
---
title: Clear, descriptive page title
sidebarTitle: Short sidebar name    # Optional, for long titles
description: Concise summary for SEO
---
```

## Navigation rules (CRITICAL)

### Mintlify tabs limitations
1. **Tabs CANNOT mix ungrouped `pages` with `groups`** - all content must be in named groups
2. **Nested groups inside groups DON'T display** - use flat structure at tab level
3. **Sub-groups only work one level deep** within a parent group's pages array

### Correct structure
```json
{
  "tab": "Tab Name",
  "groups": [
    {"group": "Group A", "pages": ["page1", "page2"]},
    {"group": "Group B", "pages": [
      "page3",
      {"group": "Sub-group", "pages": ["page4", "page5"]}
    ]}
  ]
}
```

### Wrong structure (won't work)
```json
{
  "tab": "Tab Name",
  "pages": ["ungrouped-page"],  // This gets ignored!
  "groups": [...]
}
```

## Redirects

Always add redirects when moving or renaming pages:

```json
{
  "source": "/old/path",
  "destination": "/new/path"
}
```

- Redirects go in `docs.json` under `"redirects": []`
- Use leading slashes for both source and destination
- Can redirect to anchors: `"/new/path#section-name"`

## Mintlify components

### When to use what
| Component | Use for |
|-----------|---------|
| `<Note>` | Important information, setup instructions |
| `<Tip>` | Helpful suggestions, best practices |
| `<Warning>` | Potential issues, breaking changes |
| `<Info>` | Additional context |
| `<Tabs>` | Multiple options (installation methods, languages) |
| `<Tab>` | Individual tab content |
| `<CardGroup>` | Grid of linked cards |
| `<Card>` | Single linked card with icon |
| `<Steps>` | Numbered procedural guides |
| `<Accordion>` | Collapsible content |
| `<CodeGroup>` | Multiple code examples in tabs |

### Code blocks
Always include language tag:
```javascript
// code here
```

## Content strategy
- Document just enough for user success
- Prioritize accuracy and usability
- Make content evergreen when possible
- Search for existing content before adding - avoid duplication
- Check existing patterns for consistency
- Start with the smallest reasonable changes
- Cloud-first approach: environment variables over localhost in examples

## Code sample conventions

Use environment variables in all code samples:
```bash
# cURL
curl "${MEILISEARCH_URL}/indexes" -H "Authorization: Bearer ${MEILISEARCH_API_KEY}"
```

```javascript
// JavaScript
const client = new MeiliSearch({
  host: process.env.MEILISEARCH_URL,
  apiKey: process.env.MEILISEARCH_API_KEY
})
```

## Writing standards
- Second-person voice ("you")
- Prerequisites at start of procedural content
- Test all code examples before publishing
- Match style and formatting of existing pages
- Include both basic and advanced use cases
- Alt text on all images
- Relative paths for internal links (no .mdx extension)

## Common tasks

### Add a new page
1. Create `.mdx` file in appropriate folder
2. Add frontmatter (title, description)
3. Add to `docs.json` navigation in correct group
4. Sync: `cp docs.json new_docs.json`

### Move a page
1. Move the file to new location
2. Update path in `docs.json` navigation
3. Add redirect from old path to new path
4. Update any internal links pointing to old path
5. Sync: `cp docs.json new_docs.json`

### Rename a page
1. Rename the file
2. Update `docs.json` navigation
3. Add redirect
4. Update internal links
5. Sync: `cp docs.json new_docs.json`

### Create a new group
```json
{
  "group": "Group Name",
  "pages": ["folder/page1", "folder/page2"]
}
```

### Create a sub-group (nested)
```json
{
  "group": "Parent Group",
  "pages": [
    "folder/page1",
    {
      "group": "Sub-group",
      "pages": ["folder/subpage1", "folder/subpage2"]
    }
  ]
}
```

## Git workflow
- NEVER use --no-verify when committing
- Ask how to handle uncommitted changes before starting
- Create a new branch when no clear branch exists
- Commit frequently throughout development
- NEVER skip or disable pre-commit hooks
- NEVER commit with Claude/Anthropic name in author

## Validation

### Check all navigation pages exist
```python
python3 << 'PYTHON'
import json, os
with open('docs.json', 'r') as f:
    data = json.load(f)

def extract_pages(obj):
    pages = []
    if isinstance(obj, str):
        pages.append(obj)
    elif isinstance(obj, dict):
        if 'pages' in obj:
            for page in obj['pages']:
                pages.extend(extract_pages(page))
        if 'groups' in obj:
            for group in obj['groups']:
                pages.extend(extract_pages(group))
    elif isinstance(obj, list):
        for item in obj:
            pages.extend(extract_pages(item))
    return pages

all_pages = []
for tab in data['navigation']['tabs']:
    all_pages.extend(extract_pages(tab))

missing = [p for p in all_pages if not os.path.exists(f"{p}.mdx")]
print(f"Total: {len(all_pages)}, Missing: {len(missing)}")
for m in missing:
    print(f"  - {m}")
PYTHON
```

## Do NOT
- Skip frontmatter on any MDX file
- Use absolute URLs for internal links
- Include untested code examples
- Make assumptions - always ask for clarification
- Use localhost:7700 in code samples (use env vars)
- Create nested groups more than one level deep
- Mix ungrouped pages with groups at tab level
