import { fenceLanguage, selectSample } from "../../shared/samples.js";
import { pageHref } from "../../shared/source.js";
import { isRecord, stringRecord, text, textOrNull } from "./records.js";

export type SearchHit = {
  title: string;
  page: string;
  /** Derived from `page` and `anchor`. Not stored on the chunk. */
  url: string;
  anchor: string | null;
  breadcrumb: string;
  content: string;
  content_type: string;
  tab: string | null;
  group: string | null;
  version_label?: string;
  released_on?: string;
  release_section?: string;
  /** English release date. Present on changelog hits so ranking and the answer can use it. */
  description?: string;
};

export function renderSample(codes: Record<string, string> | undefined, codeLanguage: string | null): string {
  const selected = selectSample(codes, codeLanguage);
  if (!selected.code && !selected.note) return "";
  const block = selected.code ? `\`\`\`${fenceLanguage(selected.language)}\n${selected.code}\n\`\`\`` : "";
  return [block, selected.note].filter(Boolean).join("\n\n");
}

export function toHit(value: unknown, codeLanguage: string | null): SearchHit {
  const hit = isRecord(value) ? value : {};
  const contentType = text(hit.content_type);
  const content = contentType === "code_sample" ? renderSample(stringRecord(hit.codes), codeLanguage) : text(hit.content);
  const releasedOn = textOrNull(hit.released_on);
  const versionLabel = textOrNull(hit.version_label);
  const page = text(hit.page);
  const anchor = textOrNull(hit.anchor);
  return {
    title: text(hit.title),
    page,
    url: page ? pageHref(page, anchor) : "",
    anchor,
    breadcrumb: text(hit.breadcrumb),
    content,
    content_type: contentType,
    tab: textOrNull(hit.tab),
    group: textOrNull(hit.group),
    ...(versionLabel ? { version_label: versionLabel } : {}),
    ...(releasedOn ? { released_on: releasedOn } : {}),
    ...(textOrNull(hit.release_section) ? { release_section: text(hit.release_section) } : {}),
    ...(releasedOn && text(hit.description) ? { description: text(hit.description) } : {}),
  };
}
