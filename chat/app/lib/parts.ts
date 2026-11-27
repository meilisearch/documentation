import type { UIMessage } from "ai";

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

export function isReleasesPart(part: Part): part is Part & { type: "tool-list_releases"; state: string } {
  return part.type === "tool-list_releases";
}

/** Page title once the tool has returned, the requested page path before. */
export function expandedPageLabel(part: Part): string | undefined {
  const { input, output } = part as { input?: { page?: unknown }; output?: { title?: unknown } };
  if (typeof output?.title === "string") return output.title;
  return typeof input?.page === "string" ? input.page : undefined;
}
