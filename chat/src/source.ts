import type { UIMessage } from "ai";

export type Source = { title: string; href: string; breadcrumb?: string };

/** Assistant message whose sources are the pages the answer actually cited. */
export type ChatMessage = UIMessage<{ sources?: Source[] }>;

/**
 * Same page across hosts: production, www/apex, and Mintlify preview deployments
 * all serve the same doc. Key on the path so a host change never drops a source.
 * Chunks of one page also share it, which handles dedupe.
 */
export function pageKey(url: string): string {
  try {
    const path = new URL(url).pathname.replace(/\/+$/, "");
    return path || "/";
  } catch {
    return url.split(/[?#]/)[0];
  }
}
