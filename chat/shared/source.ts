import type { UIMessage } from "ai";

export type Source = { title: string; href: string; breadcrumb?: string };

/** Assistant message whose sources are the pages the answer actually cited. */
export type ChatMessage = UIMessage<{ sources?: Source[] }>;

const DOCS_MOUNT = /^\/docs(?=\/|$)/;

/** Docs-relative path plus anchor. One place, so the API cannot drift from the pages it cites. */
export function pageHref(page: string, anchor?: string | null): string {
  const path = page.replace(/^\/+|\/+$/g, "");
  return `/${path}${anchor ? `#${anchor}` : ""}`;
}

/**
 * Page identity across hosts and mounts. Production stores pages under `/docs`;
 * previews and local docs serve them at the root. A model may cite either form.
 */
export function pageKey(value: string): string {
  let pathname = value;
  try {
    pathname = new URL(value, "https://docs.local").pathname;
  } catch {
    pathname = value.split(/[?#]/)[0] ?? value;
  }
  const relative = pathname.replace(DOCS_MOUNT, "").replace(/^\/+|\/+$/g, "");
  return relative || "/";
}
