import type { UIMessage } from "ai";

export type Source = { title: string; href: string; breadcrumb?: string };

type Part = UIMessage["parts"][number];

/** Never trust tool output shape: a partial or unexpected result must not break the UI. */
function hitsOf(output: unknown): Record<string, unknown>[] {
  if (!output || typeof output !== "object") return [];
  const hits = (output as { hits?: unknown }).hits;
  return Array.isArray(hits) ? (hits as Record<string, unknown>[]) : [];
}

export function isSearchPart(part: Part): part is Part & { type: "tool-search"; state: string } {
  return part.type === "tool-search";
}

export function searchQuery(part: Part): string | undefined {
  const input = (part as { input?: { q?: unknown } }).input;
  return typeof input?.q === "string" ? input.q : undefined;
}

const MAX_SOURCES = 8;

/** Unique pages found by all completed searches in a message, in order of appearance. */
export function collectSources(parts: Part[]): Source[] {
  const seen = new Set<string>();
  const sources: Source[] = [];

  for (const part of parts) {
    if (!isSearchPart(part) || part.state !== "output-available") continue;
    for (const hit of hitsOf((part as { output?: unknown }).output)) {
      if (sources.length >= MAX_SOURCES) return sources;
      if (typeof hit.url !== "string") continue;
      const page = hit.url.split("#")[0];
      if (seen.has(page)) continue;
      seen.add(page);
      const href = typeof hit.anchor === "string" && hit.anchor ? `${page}#${hit.anchor}` : hit.url;
      sources.push({
        href,
        title: typeof hit.title === "string" ? hit.title : href,
        breadcrumb: typeof hit.breadcrumb === "string" ? hit.breadcrumb : undefined,
      });
    }
  }
  return sources;
}

export function Sources({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;

  return (
    <details className="group mt-3 rounded-lg border border-black/10 text-[13px] dark:border-white/10">
      <summary className="cursor-pointer list-none px-3 py-2 text-black/60 select-none dark:text-white/60">
        <span className="mr-1 inline-block transition-transform group-open:rotate-90">›</span>
        {sources.length} {sources.length === 1 ? "source" : "sources"}
      </summary>
      <ul className="space-y-1 border-t border-black/10 px-3 py-2 dark:border-white/10">
        {sources.map((source) => (
          <li key={source.href}>
            <a
              href={source.href}
              {...linkTarget(source.href)}
              className="block hover:text-brand"
            >
              <span className="font-medium">{source.title}</span>
              {source.breadcrumb && (
                <span className="block truncate text-[12px] text-black/50 dark:text-white/50">{source.breadcrumb}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** Same-origin docs links navigate in place; anything else opens in a new tab. */
export function linkTarget(href: string): { target: string; rel?: string } {
  try {
    return new URL(href, location.href).origin === location.origin
      ? { target: "_self" }
      : { target: "_blank", rel: "noopener noreferrer" };
  } catch {
    return { target: "_blank", rel: "noopener noreferrer" };
  }
}
