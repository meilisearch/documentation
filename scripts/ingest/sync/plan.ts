import type { RawPage } from "../types.ts";

export type SyncPlan = {
  changed: RawPage[];
  deletePages: string[];
  added: string[];
  updated: string[];
  removed: string[];
  unchanged: number;
};

export function planSync(
  existing: Map<string, string>,
  pages: RawPage[],
  options: { force?: boolean } = {},
): SyncPlan {
  const changed = options.force ? pages : pages.filter((p) => existing.get(p.page) !== p.pageHash);
  const added = changed.filter((p) => !existing.has(p.page)).map((p) => p.page);
  const updated = changed.filter((p) => existing.has(p.page)).map((p) => p.page);
  const current = new Set(pages.map((p) => p.page));
  const removed = [...existing.keys()].filter((name) => !current.has(name)).sort();
  return {
    changed,
    deletePages: [...updated, ...removed],
    added,
    updated,
    removed,
    unchanged: pages.length - changed.length,
  };
}
