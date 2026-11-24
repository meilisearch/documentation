import type { UIMessage } from "ai";
import type { Source } from "./source";

type Part = UIMessage["parts"][number];

export function isSearchPart(part: Part): part is Part & { type: "tool-search"; state: string } {
  return part.type === "tool-search";
}

export function searchQuery(part: Part): string | undefined {
  const input = (part as { input?: { q?: unknown } }).input;
  return typeof input?.q === "string" ? input.q : undefined;
}

export function isExpandPart(part: Part): part is Part & { type: "tool-expand_page"; state: string } {
  return part.type === "tool-expand_page";
}

/** Page title once the tool has returned, the requested page path before. */
export function expandedPageLabel(part: Part): string | undefined {
  const { input, output } = part as { input?: { page?: unknown }; output?: { title?: unknown } };
  if (typeof output?.title === "string") return output.title;
  return typeof input?.page === "string" ? input.page : undefined;
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
