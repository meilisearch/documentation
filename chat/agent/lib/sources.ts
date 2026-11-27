import { pageHref, pageKey, type Source } from "../../shared/source.js";
import type { Release } from "./releases.js";

type PooledSource = Source & { key: string; score: number; order: number };

export type SourcePool = {
  seenChunks: Set<string>;
  rememberPage(hit: { page: string; title: string; tab: string | null; group: string | null }, score: number): void;
  rememberReleases(releases: Release[]): void;
  cited(answerText: string): Source[];
};

export function createSourcePool(): SourcePool {
  const pageSources = new Map<string, PooledSource>();
  const seenChunks = new Set<string>();
  let sourceOrder = 0;

  return {
    seenChunks,
    rememberPage(hit, score) {
      const { page, title, tab, group } = hit;
      if (!page) return;
      const key = pageKey(page);
      const previous = pageSources.get(key);
      if (previous) {
        previous.score = Math.max(previous.score, score);
        return;
      }
      const breadcrumb = [tab, group].filter((part): part is string => typeof part === "string" && part.length > 0).join(" > ");
      pageSources.set(key, {
        key,
        title: title || key,
        href: pageHref(page),
        ...(breadcrumb ? { breadcrumb } : {}),
        score,
        order: sourceOrder++,
      });
    },
    rememberReleases(releases) {
      for (const release of releases) {
        const key = pageKey(release.url);
        if (!key || pageSources.has(key)) continue;
        pageSources.set(key, {
          key,
          title: `Meilisearch ${release.version} release notes`,
          href: release.url,
          breadcrumb: "Changelog",
          score: 0,
          order: sourceOrder++,
        });
      }
    },
    cited(answerText) {
      const citedKeys = new Set(
        [...answerText.matchAll(/\]\(\s*<?([^)\s>]+)>?|(https?:\/\/[^\s)<>"'\]]+)/g)].flatMap((match) => {
          const target = (match[1] ?? match[2])?.replace(/[.,;:!?]+$/, "");
          return target ? [pageKey(target)] : [];
        }),
      );
      return [...pageSources.values()]
        .filter((source) => citedKeys.has(source.key))
        .sort((a, b) => b.score - a.score || a.order - b.order)
        .map(({ title, href, breadcrumb }) => ({ title, href, ...(breadcrumb ? { breadcrumb } : {}) }));
    },
  };
}
