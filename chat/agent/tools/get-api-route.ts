import { tool } from "ai";
import { z } from "zod";
import { lookupCandidates, methodCandidates, quoteFilter, selectSample } from "../../shared/samples.js";
import { pageHref } from "../../shared/source.js";
import { MAX_PAGE_CHARS, MAX_PAGE_CHUNKS } from "../config.js";
import { truncate } from "../lib/format.js";
import type { MeiliSpan } from "../lib/meili.js";
import { isRecord } from "../lib/records.js";
import { rememberRead, type AgentContext } from "../state.js";

const ROUTE_ATTRIBUTES = ["title", "page", "content", "chunk_index", "codes"];

export function createApiRouteTool(ctx: AgentContext) {
  const loadRoute = async (filter: string, spans: MeiliSpan[]) => {
    const { hits } = await ctx.spans.run(spans, () =>
      ctx.meili.routes.search("", {
        filter,
        sort: ["chunk_index:asc"],
        limit: MAX_PAGE_CHUNKS,
        attributesToRetrieve: ROUTE_ATTRIBUTES,
        showPerformanceDetails: true,
      }),
    );
    return hits;
  };

  const presentRoute = (hits: Record<string, unknown>[], matched: "exact" | "similar" | "sdk_method") => {
    const codes = hits.find((hit) => hit.codes)?.codes as Record<string, string> | undefined;
    const selected = selectSample(codes, ctx.user.codeLanguage);
    const markdown = hits.map((hit) => String(hit.content ?? "")).join("\n\n");
    const { text, truncated } = truncate(markdown, MAX_PAGE_CHARS);
    return {
      matched,
      title: hits[0].title as string,
      page: hits[0].page as string,
      url: pageHref(String(hits[0].page ?? "")),
      markdown: text,
      truncated,
      language: selected.language,
      code: selected.code,
      ...(selected.note ? { note: selected.note } : {}),
    };
  };

  const pagesOf = (hits: readonly object[]) => {
    const seen = new Set<string>();
    const pages: { title: string; page: string; url: string }[] = [];
    for (const hit of hits) {
      if (!isRecord(hit)) continue;
      const page = hit.page;
      if (typeof page !== "string" || seen.has(page)) continue;
      seen.add(page);
      pages.push({
        title: typeof hit.title === "string" ? hit.title : "",
        page,
        url: pageHref(page),
      });
    }
    return pages;
  };

  return tool({
    description:
      'Read one API route: its parameters, request body, response example, and a code sample in the reader\'s language. Pass a method and path ("POST /indexes/{index_uid}/search"), a docs URL, a slug such as "search-with-post", or an SDK method name such as updateEmbedders. When note is set, the reader\'s language has no sample: show the HTTP request and say so.',
    inputSchema: z.object({
      route: z
        .string()
        .min(1)
        .max(500)
        .describe(
          'Method and path, docs URL, slug, or SDK method name. For example "POST /indexes/{index_uid}/search", "search-with-post", or "updateEmbedders".',
        ),
    }),
    execute: async ({ route }, { toolCallId }) => {
      const spans: MeiliSpan[] = [];
      const finish = (body: unknown) => {
        rememberRead(ctx, toolCallId, "get_api_route", route, body, spans);
        return body;
      };
      const candidates = lookupCandidates(route);
      if (candidates.length === 0) return finish({ error: "Provide a method and path, a docs URL, a slug, or an SDK method name." });
      const exact = await loadRoute(`lookup_keys IN [${candidates.map(quoteFilter).join(", ")}]`, spans);
      if (exact.length > 0) return finish(presentRoute(exact, "exact"));

      const methods = methodCandidates(route);
      if (methods.length > 0) {
        const methodHits = await loadRoute(`sdk_methods IN [${methods.map(quoteFilter).join(", ")}]`, spans);
        const pages = pagesOf(methodHits);
        if (pages.length === 1) return finish(presentRoute(methodHits, "sdk_method"));
        if (pages.length > 1) {
          return finish({
            matches: pages.slice(0, 8),
            hint: "Several routes match this SDK method. Call get_api_route again with the method and path (the title or page).",
          });
        }
      }

      const similar = await ctx.spans.run(spans, () =>
        ctx.meili.routes.search(route, {
          limit: 5,
          hybrid: { embedder: ctx.config.embedder, semanticRatio: 0.5 },
          attributesToRetrieve: ["page"],
          showPerformanceDetails: true,
        }),
      );
      const page = similar.hits[0]?.page as string | undefined;
      if (!page) return finish({ error: `No API route found for "${route}".` });
      const hits = await loadRoute(`page = ${quoteFilter(page)}`, spans);
      if (hits.length === 0) return finish({ error: `No API route found for "${route}".` });
      return finish(presentRoute(hits, "similar"));
    },
  });
}
