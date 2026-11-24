import { linkTarget, localizeHref } from "../lib/links";
import type { Source } from "../../shared/source";

export function Sources({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;

  return (
    <details className="group mt-3 rounded-lg border border-black/10 text-[13px] dark:border-white/10">
      <summary className="cursor-pointer list-none px-3 py-2 text-black/60 select-none dark:text-white/60">
        <span className="mr-1 inline-block transition-transform group-open:rotate-90">›</span>
        {sources.length} {sources.length === 1 ? "source" : "sources"}
      </summary>
      <ul className="space-y-1 border-t border-black/10 px-3 py-2 dark:border-white/10">
        {sources.map((source) => {
          const href = localizeHref(source.href, window.location.href);
          return (
            <li key={source.href}>
              <a href={href} {...linkTarget(href, window.location.href)} className="block hover:text-brand">
                <span className="font-medium">{source.title}</span>
                {source.breadcrumb && (
                  <span className="block truncate text-[12px] text-black/50 dark:text-white/50">{source.breadcrumb}</span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
