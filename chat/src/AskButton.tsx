import { TOGGLE_EVENT } from "./events";
import { useDarkMode } from "./useDarkMode";

const isMac = /Mac|iPhone|iPad/.test(navigator.platform);

export function AskButton() {
  const dark = useDarkMode();

  return (
    <div className={dark ? "dark" : ""}>
      <button
        type="button"
        className="meili-ask-button"
        aria-label="Ask AI"
        onClick={() => window.dispatchEvent(new CustomEvent(TOGGLE_EVENT))}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
        </svg>
        <span>Ask AI</span>
        <kbd>{isMac ? "⌘I" : "Ctrl+I"}</kbd>
      </button>
    </div>
  );
}
