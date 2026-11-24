import { tool } from "ai";
import { MeilisearchApiError } from "meilisearch";
import { z } from "zod";
import { MAX_PAGE_CHUNKS } from "../config.js";
import { utf8Bytes } from "../lib/format.js";
import { summarizeSpans, type MeiliSpan } from "../lib/meili.js";
import { groupReleases, type Release } from "../lib/releases.js";
import type { AgentContext } from "../state.js";

export function createListReleasesTool(ctx: AgentContext) {
  return tool({
    description:
      "List every Meilisearch release, newest first: version, release date, and changelog url. It has no summaries: expand_page a version to read what changed.",
    inputSchema: z.object({}),
    execute: async (_input, { toolCallId }) => {
      const spans: MeiliSpan[] = [];
      const finish = (releases: Release[]) => {
        const body = { releases };
        ctx.details.releaseLists.set(toolCallId, {
          count: releases.length,
          bytes: utf8Bytes(body),
          oldest: releases.at(-1)?.released_on,
          meili: summarizeSpans(spans),
        });
        ctx.pool.rememberReleases(releases);
        return body;
      };
      try {
        const { hits } = await ctx.spans.run(spans, () =>
          ctx.meili.changelog.search("", {
            sort: ["released_on:desc"],
            limit: MAX_PAGE_CHUNKS,
            attributesToRetrieve: ["page", "version_label", "released_on"],
            showPerformanceDetails: true,
          }),
        );
        return finish(groupReleases(hits));
      } catch (error) {
        if (!(error instanceof MeilisearchApiError) || error.cause?.code !== "index_not_found") throw error;
        console.error("[chat] changelog index missing");
        return finish([]);
      }
    },
  });
}
