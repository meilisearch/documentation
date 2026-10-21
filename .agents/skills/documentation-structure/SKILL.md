---
name: documentation-structure
description: Documentation structure for where a Meilisearch docs page lives and which mode it is. Use when adding or moving a page, choosing overview, getting started, how-to, advanced, reference, or explanation, or when another skill needs placement.
---

# Documentation structure

Apply when adding, moving, or shaping a page. A **hard miss** fails the piece. Done when tab, mode, and depth each hold.

The live map is `config/navigation.json`. This skill is the convention that file does not state.

## Tabs

Readers enter by product area.

- **Getting started** — first contact: a tutorial to a working project, SDK and framework setup, the glossary.
- **Capabilities** — one capability is the front door. Inside it, pages run compass, then tutorial, how-to, and depth.
- **Reference** — the HTTP contract, generated from the OpenAPI spec.
- **Resources** — self-hosting, migration, comparisons, internals, demos.
- **Changelog** — engine releases, generated from GitHub releases.

## Mode

A page has one mode. A two-to-four sentence orientation may sit at the top of any page. A section that does another mode's job is its own page, linked.

- **Tutorial** (`getting_started/`) — one path from a known start to a seen result. The page shows the result the reader just produced. Prerequisites are links.
- **How-to** (`how_to/`) — one goal, assumptions, steps, the result. The title is a verb. The page includes why this change matters for this task. Fields, types, and defaults live on the API reference.
- **Reference** — lookup: name, type, default, constraint. Home is the Reference tab. A capability page links there.
- **Explanation** — why it behaves this way: concept, behavior, tradeoffs. A short snippet may illustrate. The title is a noun.

## Depth

`advanced/` is depth, beside mode. Each page there still names one mode. Relevancy, Providers, Tasks and batches, Joins, and the platform groups are clusters: the reader thinks in that topic; each page inside has one mode.

## Compass

`overview` is the capability's compass, in this order: what it is, when to use it, links to the tutorial, the how-tos, the explanation, and the API reference. One strong preference may sit here, such as which route to call.

## Outside the four modes

Resources and the changelog stay outside the four modes. Give the page a shape: a migration is a how-to, an internals page is explanation, a comparison is a decision (a recommendation, its limit, a dated source for any claim about another product), a changelog entry is a list of changes.

## Context

Cloud is the default. A tutorial or how-to states once whether it assumes Meilisearch Cloud or a self-hosted instance.

The same generated sample may appear in a how-to and on an API page. The prose around it changes.
