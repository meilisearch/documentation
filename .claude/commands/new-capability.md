Scaffold a new capability in the Learn tab following the standard structure.

Arguments: $ARGUMENTS (the capability name, e.g. `geosearch` or `faceted_search`)

## Steps

1. **Create the directory**: `learn/<capability_name>/`

2. **Create the pages** with proper frontmatter. Each page should have a `title` and `description` field. Create the following files:

   - `overview.mdx` - What this capability is, why it matters, key features, how it works at a high level. Include a CardGroup at the bottom linking to the other pages in the group.
   - `getting_started.mdx` - Step-by-step tutorial to use this capability for the first time. Prerequisites, minimal working example, expected results.
   - `how_to.mdx` - Task-oriented guides for common use cases. Each section answers "How do I do X?"
   - `advanced.mdx` - Deep-dive content: edge cases, performance tuning, architecture details, advanced configuration.
   - `reference.mdx` - Configuration options, API parameters, settings reference specific to this capability. Link to the relevant API reference pages.

3. **Add to docs.json navigation**: Add a new group in the Learn tab:
   ```json
   {
     "group": "<Capability Name>",
     "pages": [
       "learn/<capability_name>/overview",
       "learn/<capability_name>/getting_started",
       "learn/<capability_name>/how_to",
       "learn/<capability_name>/advanced",
       "learn/<capability_name>/reference"
     ]
   }
   ```

4. **Ask the user** where in the Learn tab nav order this group should be placed (after which existing group).

## Writing rules
- Never use em dashes in content
- Use Meilisearch Cloud examples first, then self-hosted alternatives
- Include code examples with curl and at least one SDK
- Add `<Tip>` callouts for Meilisearch Cloud when relevant
