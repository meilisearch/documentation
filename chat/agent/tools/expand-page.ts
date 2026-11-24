import { tool } from "ai";
import { z } from "zod";
import { MAX_PAGE_CHARS, MAX_PAGE_CHUNKS } from "../config.js";
import { truncate } from "../lib/format.js";
import { renderSample } from "../lib/hits.js";
import type { MeiliSpan } from "../lib/meili.js";
import { resolvePage } from "../lib/releases.js";
import { pageHref } from "../../shared/source.js";
import { rememberRead, type AgentContext } from "../state.js";

export function createExpandPageTool(ctx: AgentContext) {
  // Chunks of one page are ordered by chunk_index. Joining them rebuilds the page, samples included.
  return tool({
    description:
      'Read one page in full: markdown, code samples in the reader\'s language, and its url. Pass the "page" field of a search result, or a version such as "v1.58" for release notes.',
    inputSchema: z.object({
      page: z
        .string()
        .min(1)
        .max(300)
        .regex(/^[\w\-/.]+$/)
        .describe('The "page" field of a search result, or a version such as "v1.58"'),
    }),
    execute: async ({ page }, { toolCallId }) => {
      const resolved = resolvePage(page);
      const spans: MeiliSpan[] = [];
      const pageIndex = resolved.startsWith("changelog/v") ? ctx.meili.changelog : ctx.meili.docs;
      const { hits, estimatedTotalHits } = await ctx.spans.run(spans, () =>
        pageIndex.search("", {
          filter: `page = "${resolved}"`, // the schema regex rejects quotes and backslashes
          sort: ["chunk_index:asc"],
          limit: MAX_PAGE_CHUNKS,
          attributesToRetrieve: ["title", "content", "content_type", "codes"],
          showPerformanceDetails: true,
        }),
      );
      if (hits.length === 0) {
        const missing = { error: `No page found for "${resolved}". Use the page field of a search result.` };
        rememberRead(ctx, toolCallId, "expand_page", resolved, missing, spans);
        return missing;
      }
      const parts = hits.map((hit) =>
        hit.content_type === "code_sample" ? renderSample(hit.codes as Record<string, string> | undefined, ctx.user.codeLanguage) : String(hit.content ?? ""),
      );
      const markdown = [`# ${hits[0].title}`, ...parts.filter(Boolean)].join("\n\n");
      const { text, truncated } = truncate(markdown, MAX_PAGE_CHARS);
      const body = {
        title: hits[0].title as string,
        url: pageHref(resolved),
        markdown: text,
        truncated: truncated || (estimatedTotalHits ?? hits.length) > hits.length,
      };
      rememberRead(ctx, toolCallId, "expand_page", resolved, body, spans);
      return body;
    },
  });
}
