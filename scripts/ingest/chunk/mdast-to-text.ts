import type { Heading, Root, RootContent } from "mdast";
import type { MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

type JsxElement = MdxJsxFlowElement | MdxJsxTextElement;

const REMOVED_TYPES = new Set([
  "mdxjsEsm",
  "mdxFlowExpression",
  "mdxTextExpression",
  "code",
  "html",
  "yaml",
  "toml",
  "definition",
]);

function stringAttribute(element: JsxElement, name: string): string | undefined {
  for (const attribute of element.attributes) {
    if (attribute.type === "mdxJsxAttribute" && attribute.name === name && typeof attribute.value === "string") {
      return attribute.value;
    }
  }
  return undefined;
}

function minHeadingDepth(children: RootContent[]): number | undefined {
  let depth: number | undefined;
  visit({ type: "root", children }, "heading", (heading) => {
    depth = Math.min(depth ?? heading.depth, heading.depth);
  });
  return depth;
}

function unwrapJsx(element: JsxElement): RootContent[] {
  if (element.name?.startsWith("CodeSamples")) return [];

  if (element.name === "img" || element.name === "Image") {
    const alt = stringAttribute(element, "alt");
    if (!alt) return [];
    const text = { type: "text", value: alt } as const;
    return element.type === "mdxJsxFlowElement" ? [{ type: "paragraph", children: [text] }] : [text];
  }

  const children = cleanChildren(element.children as RootContent[]);
  if (toString({ type: "root", children }).trim() === "") return [];

  const headingDepth = minHeadingDepth(children);
  if (headingDepth !== undefined) {
    const label = stringAttribute(element, "label") ?? stringAttribute(element, "title");
    if (!label) return children;
    const depth = Math.max(1, headingDepth - 1) as Heading["depth"];
    return [{ type: "heading", depth, children: [{ type: "text", value: label }] }, ...children];
  }

  const title = stringAttribute(element, "title") ?? stringAttribute(element, "label");

  if (element.type === "mdxJsxFlowElement" && title) {
    return [
      { type: "paragraph", children: [{ type: "strong", children: [{ type: "text", value: title }] }] },
      ...children,
    ];
  }
  return children;
}

function cleanNode(node: RootContent): RootContent[] {
  if (REMOVED_TYPES.has(node.type)) return [];

  if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
    return unwrapJsx(node);
  }

  if (node.type === "link" || node.type === "linkReference") {
    return cleanChildren(node.children);
  }

  if (node.type === "image") {
    return node.alt ? [{ type: "text", value: node.alt }] : [];
  }

  if ("children" in node) {
    const children = cleanChildren(node.children);
    if (node.type === "paragraph" && children.length === 0) return [];
    return [{ ...node, children } as RootContent];
  }

  return [node];
}

function cleanChildren(children: RootContent[]): RootContent[] {
  return children.flatMap(cleanNode);
}

/** Strips everything that is not readable prose from an MDX tree, keeping its structure. */
export function cleanTree(tree: Root): Root {
  return { ...tree, children: cleanChildren(tree.children) };
}
