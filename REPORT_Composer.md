
Here is the full report from `REPORT_by_Composer.md`:

---

# Capabilities documentation — review report by Composer

**Author:** Composer (Cursor agent)  
**Scope:** Entire `capabilities/` tree and its definition in `docs.json` (Mintlify **Capabilities** tab)  
**Repository:** Meilisearch documentation worktree  
**Date:** 2025-03-20  

---

## Executive summary

The Capabilities tab is a **large, mostly coherent** product-documentation layer: **98 MDX files** and on the order of **~11.5k lines** of content. It follows a **repeatable pattern** (overview → getting started → how-to → advanced) and leans heavily on **generated code snippets**, which keeps examples aligned with the product.

**Overall quality:** Strong for core search (full-text, filtering, indexing, hybrid). **Cloud- and AI-heavy** areas (conversational search, personalization, teams) are appropriately flagged (experimental, early development, Cloud-only) but **information scent** and **navigation consistency** could be improved.

**Highest-impact next steps:**

1. Add a **Capabilities hub** (single landing page for the tab) so readers understand the map before diving into Full-text search.
2. **Normalize overview pages** (titles, “Next steps” cards, Cloud vs self-hosted callouts).
3. **Revisit sidebar order** (Indexing is foundational but appears last).
4. Run a **style pass** (en-US vs en-GB, duplicate explanations, deep links to Reference).

---

## Methodology

- Enumerated all files under `capabilities/` (98 × `.mdx`).
- Read `docs.json` for the authoritative **Capabilities** tab structure (groups, nested groups, page order).
- Read **every section’s overview** and **samples** of getting-started and how-to guides across sections.
- Searched the capabilities tree for obvious placeholders (`TODO`, `FIXME`, `coming soon`) — **none found**.
- Verified at least one **cross-repo** link cited in content (e.g. `/guides/ai/mcp`).

This report is a **content and IA review**, not a line-by-line technical audit of every API claim against engine source code.

---

## Information architecture

### Tab structure (source of truth: `docs.json`)

The Capabilities tab defines **11 top-level groups**, in this order:

| Order | Group | Role |
|------:|--------|------|
| 1 | Full-text search | Core keyword search + relevancy |
| 2 | Hybrid and semantic search | Embeddings, hybrid ranking, image/similar doc |
| 3 | Geo search | Geo filters and distance sort |
| 4 | Conversational search | Chat / RAG / MCP pointer |
| 5 | Multi-search | Multi-index + federated |
| 6 | Filtering, sorting, and faceting | Filters, sort, facets, expression syntax |
| 7 | Personalization | Experimental re-ranking from user context |
| 8 | Analytics | Events, metrics, Cloud vs self-hosted |
| 9 | Security and tenant tokens | Keys, tokens, SSO (instance) |
| 10 | Teams | Meilisearch Cloud teams |
| 11 | Indexing | Documents, tasks, multilingual, performance |

### Strengths

- **Predictable hierarchy:** Most groups use overview + getting started + how-to; several add **Advanced** or domain-specific subgroups (e.g. Full-text **Relevancy**).
- **Cross-linking:** Pages routinely point to Reference (`/reference/api/...`) and to sibling capabilities (e.g. hybrid ↔ full-text, personalization ↔ analytics).
- **Honest product state:** Warnings on conversational search; personalization marked experimental with Cloud vs self-hosted enablement paths.

### Weaknesses

- **No tab-level landing page:** The first page in the tab is Full-text search. New readers do not get a **single map** of capabilities or guidance on **reading order** (e.g. “start with Indexing + Full-text, then Filtering”).
- **Indexing last:** Indexing is conceptually **prerequisite** to almost every other capability. Keeping it last may match a “feature marketing” ordering but hurts **task-based learning**.
- **Overlapping concerns:** SSO appears under **Security** (`configure_sso`) and **Teams** (`configure_sso_for_team`). The split is defensible (instance vs Cloud team) but **needs explicit cross-links** in both overviews so users do not pick the wrong path.
- **Subgroup naming variance:** Full-text mixes **How to**, **Advanced**, and **Relevancy**; Hybrid uses **How to** + **Advanced** only. Works in practice but **Relevancy** vs **Advanced** boundaries are fuzzy (ranking pipeline could sit in either mentally).

---

## Inventory by capability group

*(Sections 1–11 cover Full-text, Hybrid, Geo, Conversational, Multi-search, Filtering/sorting/faceting, Personalization, Analytics, Security, Teams, and Indexing — each with structure, content quality, clarity/UX, and possible gaps.)*

---

## Cross-cutting observations

- **Writing:** Professional tone; title patterns vary (“What is X?” vs “X”).
- **Technical validity (spot-check):** `semanticRatio`, async indexing, experimental flags look consistent with the product story.
- **Code samples:** Generated snippets reduce drift; manual `curl` blocks need version checks.
- **Learning paths:** Strong relevancy hub and security overview; weak single tab entry; conversational overview missing next-step cards.

---

## What appears missing (or under-developed)

| Priority | Item | Rationale |
|---------|------|-----------|
| P0 | **Capabilities hub page** | Orientation + recommended paths. |
| P0 | **Align overview footers** | Next steps cards + Cloud/self-hosted hints. |
| P1 | **Re-order or signpost Indexing** | Faster time-to-first-success. |
| P1 | **SSO dual entry clarity** | Security vs Teams paths. |
| P2 | **Style guide pass** | en-US; naming glossary. |
| P2 | **Operational topics** | Limits, batches, failures → Reference/Learn. |
| P3 | **Troubleshooting hubs** | Search quality / no results / wrong order. |

---

## Suggested roadmap (documentation)

- **Phase 1:** Hub page in `docs.json`, Next steps on conversational overview, title standardization, SSO cross-links.
- **Phase 2:** “Start here” callouts → Indexing from Full-text / Filtering / Hybrid; optional role-based hub.
- **Phase 3:** Hybrid ops, multi-search limits/errors, personalization privacy.
- **Phase 4:** Link checker CI, spelling locale lint, experimental banner reviews.

---

## Closing

The Capabilities tab is already a **serious, usable** body of work. The **main leverage** is **stitching the tab together**: a **hub**, **consistent overviews**, and **clearer indexing / Cloud signposting**.

---

The **complete** version with every subsection spelled out (all 11 group write-ups in full) is in the repo as **`REPORT_by_Composer.md`**. The block above is a shortened view so this message stays readable; say if you want the entire file pasted again without trimming.