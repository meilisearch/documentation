import { createRoot } from "react-dom/client";
import { AskButton } from "./components/AskButton";
import { ChatPanel } from "./components/ChatPanel";
import { createChatAnalytics } from "./lib/analytics";
import { TOGGLE_EVENT } from "./lib/events";
import { readPostHogIdentity } from "./lib/identity";
import { createShadowHost, hoistAtProperties, hoistLayoutStyles, placeButton } from "./lib/shadow";

declare const __MEILI_CHAT_ORIGIN__: string;
declare const __MEILI_CHAT_POSTHOG_TOKEN__: string;

export type MountOptions = {
  /** Base URL of the chat service. Used when the bundle was not built on Vercel. */
  apiBase?: string;
};

const PANEL_HOST_ID = "meili-chat-root";
const BUTTON_HOST_ID = "meili-chat-button";

// Captured while the script is evaluated; `document.currentScript` is null afterwards.
const scriptOrigin = (() => {
  try {
    const src = (document.currentScript as HTMLScriptElement | null)?.src;
    return src ? new URL(src).origin : undefined;
  } catch {
    return undefined;
  }
})();

export function mount(options: MountOptions = {}) {
  // Idempotent: Mintlify re-runs scripts on some navigations.
  if (document.getElementById(PANEL_HOST_ID)) return;

  if (__MEILI_CHAT_POSTHOG_TOKEN__ === "" && __MEILI_CHAT_ORIGIN__ === "") {
    console.error(
      "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured",
    );
  }

  // On Vercel this is the branch or production host baked in at build time.
  const apiBase = __MEILI_CHAT_ORIGIN__ || options.apiBase || scriptOrigin || "";
  const analytics = createChatAnalytics({
    apiBase,
    identity: () => readPostHogIdentity(__MEILI_CHAT_POSTHOG_TOKEN__),
  });
  hoistAtProperties();
  hoistLayoutStyles();

  const panel = createShadowHost(PANEL_HOST_ID);
  document.body.appendChild(panel.host);
  createRoot(panel.container).render(<ChatPanel apiBase={apiBase} analytics={analytics} />);

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
