# Meilisearch Documentation

## Project Vision

This documentation aims to be **maintainable by AI with human oversight**. Claude Code should be able to work almost autonomously on documentation writing, analysis, and improvements—while humans always make the final decisions.

### Core Principles

1. **Product-first organization**: Documentation is structured around products (full-text search, AI-powered search, conversational search, faceted search, geo search, multi-search, personalization, analytics, platform, indexing). Each product tells a complete story.

2. **Cloud-first approach**: Meilisearch Cloud is the primary experience. All examples use environment variables (`${MEILISEARCH_URL}`, `${MEILISEARCH_API_KEY}`) instead of localhost.

3. **Two audiences, one flow**:
   - Beginners need smooth onboarding and quick wins
   - Advanced developers need deep customization options
   - Don't separate them—use progressive disclosure within pages

4. **Consistency through tooling**: Use STYLE_GUIDE.md templates and patterns to ensure consistent writing across all pages.

5. **Human review required**: Claude proposes, humans decide. Never push changes without review.

### Reference Documents

- **STYLE_GUIDE.md**: Templates, patterns, and quality checklists for each page type
- **DOCUMENTATION_ANALYSIS.md**: Quality assessment, gaps, and improvement priorities

## Working Relationship

- Push back on ideas when appropriate—cite sources and explain reasoning
- ALWAYS ask for clarification rather than making assumptions
- NEVER lie, guess, or make up anything
- When analyzing docs, go deep—read many pages, identify patterns
- Propose concrete improvements with specific file paths and changes

## Project Structure

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
├── products/                 # Products tab - THE HEART OF THE DOCS
│   ├── full_text_search/     # Core search with typos, ranking
│   ├── ai_powered_search/    # Semantic/vector search with embeddings
│   ├── conversational_search/# Chat-based RAG search
│   ├── faceted_search/       # Filters, facets, refinement
│   ├── geo_search/           # Location-based search
│   ├── multi_search/         # Federated search, sharding
│   ├── personalization/      # User-specific ranking
│   ├── analytics/            # Search analytics, metrics
│   ├── platform/             # API keys, tasks, multitenancy
│   └── indexing/             # Document management, settings
├── reference/                # References tab
│   ├── api/                  # API reference pages
│   └── errors/
├── guides/                   # Guides tab - How-to content
│   ├── ai_embedders/
│   │   └── providers/        # OpenAI, Cohere, etc. (standalone guides)
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
├── snippets/                 # SDK-generated code samples (don't edit manually)
│   └── samples/
├── docs.json                 # Navigation config (PRIMARY)
├── STYLE_GUIDE.md            # Writing templates and standards
├── DOCUMENTATION_ANALYSIS.md # Quality assessment and priorities
└── CLAUDE.md                 # This file
```

## Product Page Structure

Each product folder should follow this pattern:

1. **Overview** (`overview.mdx` or `product_name.mdx`): What is it, why use it, business value
2. **Getting Started**: Quickest path to a working example
3. **Deep Dive pages**: Detailed explanations of specific features
4. **Reference links**: Connect to API reference pages

### Gold Standard Products

Reference these for quality and structure:
- `products/full_text_search/` - Excellent ranking rules explanation
- `products/conversational_search/` - Good getting started flow
- `products/faceted_search/` - Comprehensive filter coverage

## Configuration Files

### docs.json
- **Primary navigation config** - all tabs, groups, pages
- **Redirects** - backward compatibility for moved pages
- **API config** - OpenAPI spec, playground settings
- **Theme/branding** - colors, logos, footer

### Page frontmatter (required)
```yaml
---
title: Clear, descriptive page title
sidebarTitle: Short sidebar name    # Optional, for long titles
description: Concise summary for SEO
---
```

## Navigation Rules (CRITICAL)

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

## Code Sample Conventions

**Always use environment variables** - this is the cloud-first approach:

```bash
# cURL - correct pattern
curl \
  -X POST "${MEILISEARCH_URL}/indexes/movies/search" \
  -H "Authorization: Bearer ${MEILISEARCH_API_KEY}" \
  -H 'Content-Type: application/json' \
  --data-binary '{"q": "search query"}'
```

```javascript
// JavaScript - correct pattern
const client = new MeiliSearch({
  host: process.env.MEILISEARCH_URL,
  apiKey: process.env.MEILISEARCH_API_KEY
})
```

**Never use:**
- `localhost:7700`
- `'MEILISEARCH_URL/...` (missing `${}` and quotes)
- Hardcoded API keys

## Mintlify Components

| Component | Use for |
|-----------|---------|
| `<Note>` | Important information, setup instructions |
| `<Tip>` | Helpful suggestions, best practices |
| `<Warning>` | Potential issues, breaking changes |
| `<Info>` | Additional context |
| `<Tabs>` | Multiple options (installation methods, languages) |
| `<CardGroup>` | Grid of linked cards for navigation |
| `<Steps>` | Numbered procedural guides |
| `<Accordion>` | Collapsible content |
| `<CodeGroup>` | Multiple code examples in tabs |

## Writing Standards

- Second-person voice ("you")
- Prerequisites at start of procedural content
- Test all code examples before publishing
- Include both basic and advanced use cases
- Alt text on all images
- Relative paths for internal links (no .mdx extension)

## Redirects

Always add redirects when moving or renaming pages:

```json
{
  "source": "/old/path",
  "destination": "/new/path"
}
```

## Common Tasks

### Add a new page
1. Create `.mdx` file in appropriate folder
2. Add frontmatter (title, description)
3. Add to `docs.json` navigation in correct group
4. Follow STYLE_GUIDE.md template for page type

### Move a page
1. Move the file to new location
2. Update path in `docs.json` navigation
3. Add redirect from old path to new path
4. Update any internal links pointing to old path

### Analyze documentation quality
1. Read DOCUMENTATION_ANALYSIS.md for current state
2. Use Explore agent to read multiple pages in a section
3. Compare against gold standard pages
4. Propose specific improvements with file paths

## Git Workflow

- NEVER use --no-verify when committing
- Ask how to handle uncommitted changes before starting
- Create a new branch when no clear branch exists
- Commit frequently throughout development
- NEVER skip or disable pre-commit hooks

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
- Make assumptions—always ask for clarification
- Use localhost:7700 in code samples (use env vars)
- Create nested groups more than one level deep
- Mix ungrouped pages with groups at tab level
- Edit files in `snippets/samples/` (SDK-generated)
- Push changes without human review
