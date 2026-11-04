import { createRoot } from "react-dom/client";
import { AskButton } from "./AskButton";
import { ChatPanel } from "./ChatPanel";
import { TOGGLE_EVENT } from "./events";
import css from "./theme.css?inline";

export type MountOptions = {
  /** Base URL of the chat service. Defaults to the origin the script was loaded from. */
  apiBase?: string;
};

const PANEL_HOST_ID = "meili-chat-root";
const BUTTON_HOST_ID = "meili-chat-button";
const SEARCH_BAR_ID = "meilisearch-bar-container";
const MINTLIFY_SEARCH_ID = "search-bar-entry";

// Captured while the script is evaluated; `document.currentScript` is null afterwards.
const scriptOrigin = (() => {
  try {
    const src = (document.currentScript as HTMLScriptElement | null)?.src;
    return src ? new URL(src).origin : undefined;
  } catch {
    return undefined;
  }
})();

function createShadowHost(id: string): { host: HTMLElement; container: HTMLElement } {
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
function hoistAtProperties() {
  if (document.getElementById("meili-chat-properties")) return;
  const rules = css.match(/@property\s+--[\w-]+\s*\{[^}]*\}/g);
  if (!rules) return;
  const style = document.createElement("style");
  style.id = "meili-chat-properties";
  style.textContent = rules.join("\n");
  document.head.appendChild(style);
}

/**
 * Sit right after the custom search bar. After a SPA navigation search.js can fall back to
 * Mintlify's own search entry, so use that as the anchor when the custom bar is missing.
 */
function placeButton(host: HTMLElement) {
  const anchor = document.getElementById(SEARCH_BAR_ID) ?? document.getElementById(MINTLIFY_SEARCH_ID);
  if (!anchor) return;
  if (host.previousElementSibling === anchor) return;
  anchor.after(host);
}

export function mount(options: MountOptions = {}) {
  // Idempotent: Mintlify re-runs scripts on some navigations.
  if (document.getElementById(PANEL_HOST_ID)) return;

  const apiBase = options.apiBase ?? scriptOrigin ?? "";
  hoistAtProperties();

  const panel = createShadowHost(PANEL_HOST_ID);
  document.body.appendChild(panel.host);
  createRoot(panel.container).render(<ChatPanel apiBase={apiBase} />);

  // Header button, injected next to the custom search bar (see search.js).
  const button = createShadowHost(BUTTON_HOST_ID);
  button.host.style.cssText = "display:flex;align-items:center;flex:none;margin-left:8px;";
  createRoot(button.container).render(<AskButton />);

  const syncButton = () => {
    const wide = window.innerWidth >= 1024;
    button.host.style.display = wide ? "flex" : "none";
    if (wide) placeButton(button.host);
  };
  syncButton();

  // Mintlify is a SPA and re-renders the header, so re-attach when needed.
  let scheduled = false;
  new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      syncButton();
    });
  }).observe(document.body, { childList: true, subtree: true });
  window.addEventListener("resize", syncButton);

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && !event.shiftKey && !event.altKey && event.key.toLowerCase() === "i") {
      event.preventDefault();
      window.dispatchEvent(new CustomEvent(TOGGLE_EVENT));
    }
  });
}
