---
name: editorial-guidelines
description: Editorial guidelines for Meilisearch docs. Use when writing or editing documentation, or when another skill needs these guidelines.
---

# Editorial guidelines

Apply these guidelines to documentation you write or edit. A **hard miss** fails the piece. Done when voice, mechanics, names, claims, samples, and links each hold.

## Voice

Welcome the reader into the community. Sound confident that Meilisearch is a practical, powerful way to build search. Use the everyday word when it carries the meaning.

Address the reader as you, and the product as Meilisearch. "Meilisearch returns a task."

## Mechanics

- American spelling, and double quotation marks.
- Sentence case, including on graphics.
- A heading has no period.
- A break inside a sentence uses a comma, parentheses, or a spaced en dash (U+2013, ` – `). An em dash (U+2014, `—`) is a hard miss.

## Names

Use the feature name the search market already uses.

Lowercase a common feature name: "search analytics", "multi-search API endpoint", "filterable attributes". Capitalize a product or proprietary name: "Meilisearch", "Enterprise Edition".

**Meilisearch** is the product. Default copy means the cloud product. Write "Meilisearch Cloud" when the sentence distinguishes cloud from self-hosting. Capitalize "Cloud" in that name or as the tier name. Lowercase otherwise: cloud infrastructure, cloud-hosted, in the cloud.

**Enterprise Edition** is the engine edition. The **Enterprise** tier is the commercial plan. Sharding and replication gate on the Enterprise tier, and our team configures them.

Evergreen copy links the [pricing page](https://www.meilisearch.com/pricing) for prices, trial lengths, and tier limits. Writing them into the copy is a hard miss.

Write `e-commerce`.

An engine feature is `experimental`. A cloud feature is `beta`. When the copy defines experimental status, match the [published definition](https://www.meilisearch.com/docs/resources/help/experimental_features_overview).

## Claims

A claim states its **bound**: the mechanism, and the limit that mechanism has.

- Security: name the control and its limit. "Safe from breaches", or any absolute guarantee, is a hard miss.
- Replication reduces downtime for read availability. Elimination or write availability is a hard miss on that claim.
- 50ms is our benchmark for Meilisearch on typical workloads. Attribute it to that result. An industry bar, or a target for the reader, is a hard miss.
- 99.999% uptime is the contractual SLA on an Enterprise agreement. Attach it to that tier.
- Rewrite a promised outcome into the mechanism. Scan for: proven, guaranteed, eliminates, ensures, always, zero downtime, bulletproof.
- How a competitor's product works needs a dated, linkable source on the sentence.

## Samples

A code sample is minimal and runnable, and it shows the concept.

## Links

When a change affects another page, update that page's links.
