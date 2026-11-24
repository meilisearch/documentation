import css from "../theme.css?inline";

const SEARCH_BAR_ID = "meilisearch-bar-container";
const MINTLIFY_SEARCH_ID = "search-bar-entry";

export function createShadowHost(id: string): { host: HTMLElement; container: HTMLElement } {
  const host = document.createElement("div");
  host.id = id;
  const shadow = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = css;
  shadow.appendChild(style);

  const container = document.createElement("div");
  shadow.appendChild(container);
  return { host, container };
}

/**
 * `@property` rules are ignored inside shadow roots, which breaks Tailwind's defaults
 * (shadows, rings, transforms). Registering them on the document fixes it.
 */
export function hoistAtProperties() {
  if (document.getElementById("meili-chat-properties")) return;
  const rules = css.match(/@property\s+--[\w-]+\s*\{[^}]*\}/g);
  if (!rules) return;
  const style = document.createElement("style");
  style.id = "meili-chat-properties";
  style.textContent = rules.join("\n");
  document.head.appendChild(style);
}

/**
 * The panel lives in a shadow root, so rules that shrink the docs column have to
 * be on the page. `--meili-chat-width` is set from the panel while it is open.
 */
export function hoistLayoutStyles() {
  if (document.getElementById("meili-chat-layout")) return;
  const style = document.createElement("style");
  style.id = "meili-chat-layout";
  style.textContent = `
html { --meili-chat-width: 0px; }
html[data-meili-chat-dragging],
html[data-meili-chat-dragging] body {
  cursor: col-resize !important;
  user-select: none !important;
}
@media (min-width: 1024px) {
  .max-lg\\:contents.lg\\:flex-1 {
    transition: margin-right 200ms ease;
  }
  html[data-meili-chat="open"] .max-lg\\:contents.lg\\:flex-1 {
    margin-right: var(--meili-chat-width);
  }
  html[data-meili-chat-dragging] .max-lg\\:contents.lg\\:flex-1 {
    transition: none;
  }
  html[data-meili-chat="open"] #content-side-layout {
    visibility: hidden !important;
    width: 0 !important;
    min-width: 0 !important;
    max-width: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
  }
  html[data-meili-chat="open"] :has(> #content-side-layout) {
    gap: 0 !important;
  }
}
`;
  document.head.appendChild(style);
}

/**
 * Sit right after the custom search bar. After a SPA navigation search.js can fall back to
 * Mintlify's own search entry, so use that as the anchor when the custom bar is missing.
 */
export function placeButton(host: HTMLElement) {
  const anchor = document.getElementById(SEARCH_BAR_ID) ?? document.getElementById(MINTLIFY_SEARCH_ID);
  if (!anchor) return;
  if (host.previousElementSibling === anchor) return;
  anchor.after(host);
}
