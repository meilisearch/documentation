Create a new comparison page for Meilisearch vs another product.

Arguments: $ARGUMENTS (the product name, e.g. `Typesense` or `Elasticsearch`)

## Template

Create the file at `resources/comparisons/<product_lowercase>.mdx` following this structure:

```mdx
---
title: Meilisearch vs <Product>
sidebarTitle: <Product>
description: Compare Meilisearch and <Product>. Learn key differences and when to choose each.
---

<One paragraph introducing the product: what it is, when it was created, what it's built with, its primary focus.>

## Quick comparison

|  | Meilisearch | <Product> |
|---|:---:|:---:|
| **License** | MIT (CE) / BUSL-1.1 (EE) | ... |
| **Built with** | Rust | ... |
| **Data storage** | Disk (memory-mapped) | ... |
| **Sharding** | Yes (Enterprise Edition) | ... |
| **Language support** | Optimized for CJK, Arabic, Hebrew, Thai | ... |
| **Embedding generation** | Built-in local (Candle) + any HTTP API provider | ... |
| **Conversational search** | Yes (built-in chat) | ... |

## When to choose Meilisearch

<Lead with Meilisearch's strengths. Be confident but honest. Highlight: disk-based storage, Rust stability/safety, sharding, multilingual support, embedding flexibility, conversational search, MIT license, analytics dashboard, developer experience.>

## What <Product> does well

<Honestly acknowledge the competitor's genuine strengths. Scope them where appropriate (e.g. "for small datasets", "if you already use X ecosystem").>

## When to choose <Product>

Consider <Product> if:
- <bullet points for genuine use cases where the competitor is a better fit>

## Migration resources

If you're considering Meilisearch:
- [Meilisearch quick start](/getting_started/first_project)
- [AI-powered search](/learn/ai_powered_search/getting_started_with_ai_search)
- [Conversational search](/learn/chat/getting_started_with_chat)
- <Add migration guide link if one exists>

<Note>
<Product> is a registered trademark of <Company>. This comparison is based on publicly available information and our own analysis.
</Note>
```

## Steps

1. Create the file from the template above
2. Add the page to docs.json in the "Comparisons" group under the Resources tab
3. Ask the user to fill in product-specific details or research publicly available information
4. Never lie or invent features. If unsure about a competitor feature, ask the user.

## Tone
- Write from Meilisearch's perspective: confident, not neutral
- Highlight Meilisearch strengths before competitor strengths
- Be honest about competitor advantages but scope them appropriately
- Never use em dashes
