import GithubSlugger from "github-slugger";
import type { Heading, Root, RootContent } from "mdast";
import { gfmToMarkdown } from "mdast-util-gfm";
import { toMarkdown } from "mdast-util-to-markdown";
import { toString } from "mdast-util-to-string";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import type { Chunk, ChunkingConfig, CodeSample, RawPage } from "../types.ts";
import { cleanTree } from "./mdast-to-text.ts";

export type ChunkPageOptions = { chunking: ChunkingConfig; baseUrl: string };

type Section = { hierarchy: string[]; anchor: string | null; heading: Heading | null; blocks: RootContent[] };

type SerializedSection = { hierarchy: string[]; anchor: string | null; heading: Heading | null; content: string };

type SampleItem = { kind: "sample"; hierarchy: string[]; anchor: string | null; sample: CodeSample };

type ProseItem = { kind: "prose" } & SerializedSection;

type Rendered = ProseItem | SampleItem;

const parser = unified().use(remarkParse).use(remarkFrontmatter).use(remarkMdx).use(remarkGfm);

function serialize(blocks: RootContent[]): string {
  return toMarkdown({ type: "root", children: blocks }, { extensions: [gfmToMarkdown({ tablePipeAlign: false })] }).trim();
}

const SENTINEL = /%%INGEST_SAMPLE:([A-Za-z0-9_]+)%%/;

function sampleContent(codes: Record<string, string>): string {
  return codes.http ?? Object.values(codes)[0] ?? "";
}

/** Splits a serialized section wherever a mounted sample was replaced by a placeholder. */
function expandSentinels(section: SerializedSection, samples: Map<string, CodeSample>): Rendered[] {
  const parts = section.content.split(SENTINEL);
  if (parts.length === 1) return [{ kind: "prose", ...section }];

  const rendered: Rendered[] = [];
  for (let index = 0; index < parts.length; index++) {
    if (index % 2 === 1) {
      const sample = samples.get(parts[index] ?? "");
      if (!sample) continue;
      rendered.push({ kind: "sample", hierarchy: section.hierarchy, anchor: section.anchor, sample });
      continue;
    }
    const content = parts[index]?.trim() ?? "";
    if (!content) continue;
    rendered.push({
      kind: "prose",
      hierarchy: section.hierarchy,
      anchor: section.anchor,
      heading: index === 0 ? section.heading : null,
      content,
    });
  }
  return rendered;
}

function splitSections(tree: Root, title: string, splitDepth: number): Section[] {
  const slugger = new GithubSlugger();
  const sections: Section[] = [{ hierarchy: [title], anchor: null, heading: null, blocks: [] }];
  const headingStack: { depth: number; text: string }[] = [];

  for (const node of tree.children) {
    if (node.type === "heading" && node.depth <= splitDepth) {
      const text = toString(node);
      while (headingStack.length > 0 && headingStack[headingStack.length - 1].depth >= node.depth) {
        headingStack.pop();
      }
      headingStack.push({ depth: node.depth, text });
      sections.push({
        hierarchy: [title, ...headingStack.map((heading) => heading.text)],
        anchor: slugger.slug(text),
        heading: node,
        blocks: [],
      });
    } else {
      sections[sections.length - 1].blocks.push(node);
    }
  }

  return sections;
}

/**
 * Serializes each section together with its own heading, so that joining the chunks rebuilds the page.
 * A section without content of its own (an h2 directly followed by an h3) is carried into the next section,
 * which keeps the anchor and hierarchy of the deepest heading.
 */
function serializeSections(sections: Section[], emitTrailing = false): SerializedSection[] {
  const serialized: SerializedSection[] = [];
  let pending: RootContent[] = [];
  let pendingMeta: Pick<SerializedSection, "hierarchy" | "anchor"> = {
    hierarchy: sections[0]?.hierarchy ?? [],
    anchor: null,
  };

  for (const { blocks, heading, ...section } of sections) {
    const nodes = [...pending, ...(heading ? [heading] : []), ...blocks];
    pendingMeta = { hierarchy: section.hierarchy, anchor: section.anchor };
    if (serialize(blocks) === "") {
      pending = nodes;
      continue;
    }
    pending = [];
    serialized.push({ ...section, heading, content: serialize(nodes) });
  }

  if (emitTrailing && pending.length > 0) {
    serialized.push({ ...pendingMeta, heading: null, content: serialize(pending) });
  }

  return serialized;
}

function mergeSmallSections(sections: Rendered[], chunking: ChunkingConfig): Rendered[] {
  const merged: Rendered[] = [];

  for (const section of sections) {
    const previous = merged[merged.length - 1];
    if (
      section.kind === "prose" &&
      previous?.kind === "prose" &&
      section.heading &&
      section.content.length < chunking.minChars
    ) {
      const content = `${previous.content}\n\n${section.content}`;
      if (content.length <= chunking.maxChars) {
        previous.content = content;
        continue;
      }
    }
    merged.push(section.kind === "prose" ? { ...section } : section);
  }

  return merged;
}

function hardSplit(block: string, maxChars: number): string[] {
  const pieces: string[] = [];
  let rest = block;

  while (rest.length > maxChars) {
    let cut = maxChars;
    while (cut > 0 && !/\s/.test(rest[cut])) cut--;
    if (cut === 0) cut = maxChars;
    pieces.push(rest.slice(0, cut).trimEnd());
    rest = rest.slice(cut).trimStart();
  }
  if (rest) pieces.push(rest);

  return pieces;
}

function packBlocks(blocks: string[], maxChars: number, separator: string): string[] {
  const parts: string[] = [];
  let current = "";

  for (const block of blocks) {
    const candidate = current ? `${current}${separator}${block}` : block;
    if (candidate.length <= maxChars || !current) {
      current = candidate;
    } else {
      parts.push(current);
      current = block;
    }
  }
  if (current) parts.push(current);

  return parts;
}

const TABLE_DELIMITER = /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?$/;

/** Splits an oversized table between rows, repeating the header and delimiter rows in every piece. */
function splitTable(block: string, maxChars: number): string[] | null {
  const [head, delimiter, ...rows] = block.split("\n");
  if (delimiter === undefined || !head.includes("|") || !TABLE_DELIMITER.test(delimiter)) return null;
  const header = `${head}\n${delimiter}`;
  const budget = maxChars - header.length - 1;
  if (budget < maxChars / 2) return null;
  const pieces = packBlocks(
    rows.flatMap((row) => hardSplit(row, budget)),
    budget,
    "\n",
  );
  return pieces.map((piece) => `${header}\n${piece}`);
}

/** Splits an oversized block between lines (keeping table rows and list items whole), then between words. */
function splitBlock(block: string, maxChars: number): string[] {
  if (block.length <= maxChars) return [block];
  const table = splitTable(block, maxChars);
  if (table) return table;
  const lines = block.split("\n").flatMap((line) => hardSplit(line, maxChars));
  return packBlocks(lines, maxChars, "\n");
}

/** Splits at block boundaries. Only the first part starts with the section heading. */
function splitLargeSection(section: SerializedSection, chunking: ChunkingConfig): SerializedSection[] {
  if (section.content.length <= chunking.maxChars) return [section];

  const blocks = section.content.split("\n\n").flatMap((block) => splitBlock(block, chunking.maxChars));
  return packBlocks(blocks, chunking.maxChars, "\n\n").map((content) => ({ ...section, content }));
}

function parse(page: RawPage): Root {
  try {
    return parser.parse(page.body) as Root;
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    throw new Error(`Failed to parse ${page.page}: ${message}`, { cause });
  }
}

export function chunkPage(page: RawPage, options: ChunkPageOptions): Chunk[] {
  const samples = new Map((page.samples ?? []).map((sample) => [sample.alias, sample]));
  const tree = cleanTree(parse(page), new Set(samples.keys()));
  const title = page.frontmatter.title;
  const pageUrl = `${options.baseUrl}/${page.page}`;
  const rendered = serializeSections(splitSections(tree, title, options.chunking.splitDepth)).flatMap((section) =>
    expandSentinels(section, samples),
  );
  const sections: Rendered[] = [];
  for (const section of mergeSmallSections(rendered, options.chunking)) {
    if (section.kind === "sample") {
      sections.push(section);
      continue;
    }
    for (const piece of splitLargeSection(section, options.chunking)) {
      sections.push({ ...section, ...piece });
    }
  }

  const chunks: Chunk[] = [];
  for (const section of sections) {
    const content = section.kind === "sample" ? sampleContent(section.sample.codes) : section.content;
    if (!content) continue;
    const chunkIndex = chunks.length;
    const chunk: Chunk = {
      id: `${page.page.replaceAll("/", "__")}-${chunkIndex}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
      page: page.page,
      page_hash: page.pageHash,
      url: section.anchor ? `${pageUrl}#${section.anchor}` : pageUrl,
      anchor: section.anchor,
      title,
      description: page.frontmatter.description ?? "",
      tab: page.tab,
      group: page.group,
      hierarchy: section.hierarchy,
      breadcrumb: [page.tab, page.group, ...section.hierarchy].filter(Boolean).join(" > "),
      content,
      content_type: section.kind === "sample" ? "code_sample" : "prose",
      chunk_index: chunkIndex,
    };
    if (section.kind === "sample") {
      chunk.codes = section.sample.codes;
      chunk.code_language = Object.keys(section.sample.codes);
    }
    chunks.push(chunk);
  }
  return chunks;
}
