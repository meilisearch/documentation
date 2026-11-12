import type { Chunk, ChunkingConfig } from "../types.ts";

type Schema = {
  $ref?: string;
  type?: string | string[];
  description?: string;
  default?: unknown;
  enum?: unknown[];
  properties?: Record<string, Schema>;
  items?: Schema;
  required?: string[];
  example?: unknown;
  oneOf?: Schema[];
  anyOf?: Schema[];
};

type Parameter = {
  name?: string;
  in?: string;
  description?: string;
  required?: boolean;
  schema?: Schema;
};

type Media = { schema?: Schema; example?: unknown };

export type RouteDocument = {
  page: string;
  pageHash: string;
  tab: string;
  groupPath: string;
  method: string;
  path: string;
  summary: string;
  description: string;
  lookupKeys: string[];
  codes: Record<string, string>;
  parts: string[];
};

type RenderInput = {
  method: string;
  path: string;
  summary: string;
  description: string;
  parameters: Parameter[];
  requestBody?: { content?: Record<string, Media> } | null;
  responses?: Record<string, { description?: string; content?: Record<string, Media> }>;
  schemas: Record<string, Schema | object>;
};

const PARAM_ORDER = ["path", "query", "header", "cookie"] as const;
const PARAM_LABELS: Record<(typeof PARAM_ORDER)[number], string> = {
  path: "Path parameters",
  query: "Query parameters",
  header: "Header parameters",
  cookie: "Cookie parameters",
};

function oneLine(text: string | undefined): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

function refName(schema: Schema | undefined): string | undefined {
  return schema?.$ref?.split("/").pop();
}

function resolve(schema: Schema | undefined, schemas: Record<string, Schema>): Schema | undefined {
  if (!schema?.$ref) return schema;
  return schemas[schema.$ref.split("/").pop() ?? ""] ?? schema;
}

function typeLabel(schema: Schema | undefined, schemas: Record<string, Schema>, depth = 0): string {
  if (!schema || depth > 3) return "any";
  if (schema.$ref) {
    const name = refName(schema) ?? "any";
    const resolved = schemas[name];
    if (!resolved) return name;
    if (resolved.enum) return resolved.enum.map((value) => JSON.stringify(value)).join(" | ");
    if (resolved.properties) return name;
    return typeLabel(resolved, schemas, depth + 1);
  }
  if (schema.enum) return schema.enum.map((value) => JSON.stringify(value)).join(" | ");
  const types = Array.isArray(schema.type) ? schema.type : schema.type ? [schema.type] : [];
  if (types.includes("array") || schema.items) {
    const item = typeLabel(schema.items, schemas, depth + 1);
    const rest = types.filter((type) => type !== "array");
    return rest.length > 0 ? `${item}[] | ${rest.join(" | ")}` : `${item}[]`;
  }
  const branches = schema.oneOf ?? schema.anyOf;
  if (branches?.length) return branches.map((branch) => typeLabel(branch, schemas, depth + 1)).join(" | ");
  if (types.length > 0) return types.join(" | ");
  return "any";
}

function fieldLine(name: string, schema: Schema | undefined, required: boolean, schemas: Record<string, Schema>): string {
  const resolved = resolve(schema, schemas);
  const description = oneLine(schema?.description ?? resolved?.description);
  const type = typeLabel(schema, schemas);
  const fallback = schema?.default ?? resolved?.default;
  const def = fallback !== undefined ? `, default ${JSON.stringify(fallback)}` : "";
  const req = required ? ", required" : "";
  return `- \`${name}\` (${type}${req}${def})${description ? `: ${description}` : ""}`;
}

function isEmptySchema(schema: Schema | undefined): boolean {
  if (!schema) return true;
  return Object.keys(schema).length === 0;
}

function parameterBlocks(parameters: Parameter[], schemas: Record<string, Schema>): string[] {
  const groups = new Map<string, Parameter[]>();
  for (const parameter of parameters) {
    if (!parameter.name || !parameter.in) continue;
    const list = groups.get(parameter.in) ?? [];
    list.push(parameter);
    groups.set(parameter.in, list);
  }

  const blocks: string[] = [];
  for (const key of PARAM_ORDER) {
    const list = groups.get(key);
    if (!list?.length) continue;
    list.forEach((parameter, index) => {
      const line = fieldLine(parameter.name!, parameter.schema, Boolean(parameter.required), schemas);
      blocks.push(index === 0 ? `${PARAM_LABELS[key]}\n${line}` : line);
    });
  }
  return blocks;
}

function bodyBlocks(requestBody: RenderInput["requestBody"], schemas: Record<string, Schema>): string[] {
  const entry = Object.entries(requestBody?.content ?? {})[0];
  if (!entry) return [];
  const [contentType, media] = entry;
  const schema = media.schema;
  if (isEmptySchema(schema) && media.example === undefined) return [];

  const resolved = resolve(schema, schemas);
  const name = refName(schema);
  const header = [
    "Request body",
    name ? `(${name})` : "",
    contentType !== "application/json" ? `[${contentType}]` : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (resolved?.properties) {
    const required = new Set(resolved.required ?? []);
    return Object.entries(resolved.properties).map(([prop, propSchema], index) => {
      const line = fieldLine(prop, propSchema, required.has(prop), schemas);
      return index === 0 ? `${header}\n${line}` : line;
    });
  }

  const example = media.example ?? resolved?.example;
  const lines = [header];
  const label = typeLabel(schema, schemas);
  if (label !== "any") lines.push(label);
  if (example !== undefined) {
    lines.push("```json", typeof example === "string" ? example : JSON.stringify(example, null, 2), "```");
  }
  return [lines.join("\n")];
}

function responseBlock(responses: RenderInput["responses"]): string | null {
  if (!responses) return null;
  const status = ["200", "201", "202", "204"].find((code) => responses[code]) ??
    Object.keys(responses).find((code) => code.startsWith("2"));
  if (!status) return null;
  const response = responses[status];
  const media = response.content?.["application/json"] ?? Object.values(response.content ?? {})[0];
  const lines = [`Response ${status}`];
  if (response.description?.trim()) lines.push(response.description.trim());
  if (media?.example !== undefined) {
    const example = media.example;
    lines.push("```json", typeof example === "string" ? example : JSON.stringify(example, null, 2), "```");
  }
  return lines.join("\n");
}

function hardSplit(text: string, maxChars: number): string[] {
  const pieces: string[] = [];
  let rest = text;
  while (rest.length > maxChars) {
    let cut = maxChars;
    while (cut > 0 && !/\s/.test(rest[cut] ?? "")) cut--;
    if (cut === 0) cut = maxChars;
    pieces.push(rest.slice(0, cut).trimEnd());
    rest = rest.slice(cut).trimStart();
  }
  if (rest) pieces.push(rest);
  return pieces;
}

/** Packs blocks into chunks of at most `maxChars`, repeating `title` at the start of each continuation. */
export function splitRouteContent(title: string, blocks: string[], maxChars: number): string[] {
  const chunks: string[] = [];
  let current = "";
  const budget = Math.max(1, maxChars - title.length - 2);

  const flush = () => {
    if (current) chunks.push(current);
    current = "";
  };

  const add = (text: string, continued: boolean) => {
    if (!text) return;
    if (text.length > maxChars) {
      for (const piece of hardSplit(text, continued ? budget : maxChars)) add(piece, continued);
      return;
    }
    const withTitle = continued && !text.startsWith(title) ? `${title}\n\n${text}` : text;
    const piece = withTitle.length <= maxChars ? withTitle : text;
    const candidate = current ? `${current}\n\n${piece}` : piece;
    if (candidate.length <= maxChars) {
      current = candidate;
      return;
    }
    flush();
    current = piece;
  };

  blocks.forEach((block, index) => add(block, index > 0));
  flush();
  return chunks;
}

/** Renders one operation into markdown parts. Response examples only; shared error schemas are not inlined. */
export function renderRoute(input: RenderInput, maxChars: number): string[] {
  const schemas = input.schemas as Record<string, Schema>;
  const title = `${input.method} ${input.path} — ${input.summary}`;
  const intro = [title, input.description.trim()].filter(Boolean).join("\n\n");
  const response = responseBlock(input.responses);
  const blocks = [
    intro,
    ...parameterBlocks(input.parameters, schemas),
    ...bodyBlocks(input.requestBody, schemas),
    ...(response ? [response] : []),
  ].filter(Boolean);
  return splitRouteContent(title, blocks, maxChars);
}

export function chunkRoute(route: RouteDocument, baseUrl: string): Chunk[] {
  const url = `${baseUrl}/${route.page}`;
  return route.parts.map((content, chunkIndex) => {
    const chunk: Chunk = {
      id: `${route.page.replaceAll("/", "__")}-${chunkIndex}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
      page: route.page,
      page_hash: route.pageHash,
      url,
      anchor: null,
      title: route.summary,
      description: route.description,
      tab: route.tab,
      group: route.groupPath,
      hierarchy: [route.summary],
      breadcrumb: [route.tab, route.groupPath, `${route.method} ${route.path}`].filter(Boolean).join(" > "),
      content,
      content_type: "api_route",
      chunk_index: chunkIndex,
      lookup_keys: route.lookupKeys,
    };
    if (chunkIndex === 0 && Object.keys(route.codes).length > 0) {
      chunk.codes = route.codes;
      chunk.code_language = Object.keys(route.codes);
    }
    return chunk;
  });
}
