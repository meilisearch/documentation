import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { OPEN_EVENT, TOGGLE_EVENT } from "./events";
import { Message } from "./Message";
import { useDarkMode } from "./useDarkMode";
import { readChatUser } from "./user";

const STORAGE_KEY = "meili-chat:messages";
const WIDTH_KEY = "meili-chat:width";
const MIN_WIDTH = 368;
const MAX_WIDTH = 576;
const DESKTOP_QUERY = "(min-width: 1024px)";

const iconButtonClass =
  "cursor-pointer rounded-lg p-1.5 text-black/50 hover:bg-black/[0.06] hover:text-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white/90";

const SUGGESTIONS = [
  "How do I set up hybrid search?",
  "How do I filter by multiple values?",
  "What is the difference between an API key and a tenant token?",
];

function loadMessages(): UIMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UIMessage[]) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: UIMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Storage full or unavailable: the chat still works, it just won't persist.
  }
}

function clampWidth(value: number) {
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, value));
}

function loadWidth(): number {
  try {
    const raw = localStorage.getItem(WIDTH_KEY);
    const value = raw ? Number(raw) : MIN_WIDTH;
    return Number.isFinite(value) ? clampWidth(value) : MIN_WIDTH;
  } catch {
    return MIN_WIDTH;
  }
}

function useDesktop() {
  const [desktop, setDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches);
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setDesktop(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return desktop;
}

export function ChatPanel({ apiBase }: { apiBase: string }) {
  const dark = useDarkMode();
  const desktop = useDesktop();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [width, setWidth] = useState(loadWidth);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const stickToBottom = useRef(true);
  const stopDrag = useRef<(() => void) | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${apiBase}/api/chat`,
        // Read on each send: the widget stays mounted while the reader switches code tabs.
        body: () => ({ user: readChatUser() }),
      }),
    [apiBase],
  );
  const { messages, sendMessage, status, stop, error, regenerate, setMessages } = useChat({
    messages: loadMessages(),
    transport,
  });
  const busy = status === "submitted" || status === "streaming";

  // Persist only settled conversations so partial streams are not restored.
  useEffect(() => {
    if (status === "ready" || status === "error") saveMessages(messages);
  }, [messages, status]);

  useEffect(() => {
    const toggle = () => setOpen((value) => !value);
    const show = () => setOpen(true);
    window.addEventListener(TOGGLE_EVENT, toggle);
    window.addEventListener(OPEN_EVENT, show);
    return () => {
      window.removeEventListener(TOGGLE_EVENT, toggle);
      window.removeEventListener(OPEN_EVENT, show);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    inputRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // One variable drives the fixed panel and the docs column margin.
  useEffect(() => {
    const root = document.documentElement;
    const push = open && desktop;
    root.style.setProperty("--meili-chat-width", push ? `${width}px` : "0px");
    if (push) root.dataset.meiliChat = "open";
    else delete root.dataset.meiliChat;
    if (dragging && push) root.dataset.meiliChatDragging = "";
    else delete root.dataset.meiliChatDragging;
  }, [open, desktop, width, dragging]);

  useEffect(() => {
    return () => {
      const root = document.documentElement;
      root.style.setProperty("--meili-chat-width", "0px");
      delete root.dataset.meiliChat;
      delete root.dataset.meiliChatDragging;
      stopDrag.current?.();
    };
  }, []);

  useEffect(() => {
    if (dragging) return;
    try {
      localStorage.setItem(WIDTH_KEY, String(width));
    } catch {
      // The panel still resizes for this visit.
    }
  }, [width, dragging]);

  // Follow the stream unless the reader scrolled up.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages, status, open]);

  const submit = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;
      stickToBottom.current = true;
      void sendMessage({ text: trimmed });
      setInput("");
    },
    [busy, sendMessage],
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit(input);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit(input);
    }
  };

  const clear = () => {
    stop();
    setMessages([]);
    saveMessages([]);
    inputRef.current?.focus();
  };

  const maximized = width >= MAX_WIDTH;

  const toggleSize = () => setWidth(maximized ? MIN_WIDTH : MAX_WIDTH);

  const onResizePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    stopDrag.current?.();
    setDragging(true);
    document.documentElement.dataset.meiliChatDragging = "";
    if (asideRef.current) asideRef.current.style.transition = "none";

    const apply = (clientX: number) => {
      const next = clampWidth(window.innerWidth - clientX);
      document.documentElement.style.setProperty("--meili-chat-width", `${next}px`);
      setWidth(next);
    };
    const onMove = (ev: PointerEvent) => apply(ev.clientX);
    const end = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      stopDrag.current = null;
      delete document.documentElement.dataset.meiliChatDragging;
      if (asideRef.current) asideRef.current.style.transition = "";
      setDragging(false);
    };
    stopDrag.current = end;
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  };

  const onResizeKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 48 : 16;
    if (event.key === "ArrowLeft") setWidth((value) => clampWidth(value + step));
    else if (event.key === "ArrowRight") setWidth((value) => clampWidth(value - step));
    else if (event.key === "Home") setWidth(MAX_WIDTH);
    else if (event.key === "End") setWidth(MIN_WIDTH);
    else return;
    event.preventDefault();
  };

  const lastIndex = messages.length - 1;
  const narrow = !desktop;

  return (
    <div className={dark ? "dark" : ""}>
      {narrow && (
        <div
          className={`fixed inset-0 z-[10000] bg-black/30 backdrop-blur-[2px] transition-opacity duration-200 ${open ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        ref={asideRef}
        role={narrow ? "dialog" : undefined}
        aria-label="Ask Meilisearch"
        aria-hidden={!open}
        inert={!open}
        // Keep page shortcuts (search, navigation) from reacting to typing in the chat.
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            return;
          }
          event.stopPropagation();
        }}
        className={`fixed right-0 z-[10001] flex flex-col overflow-hidden border-black/10 bg-white text-[#191919] dark:border-white/10 dark:bg-ink-dark dark:text-white ${narrow
            ? `inset-0 w-screen transition-transform duration-200 ${open ? "translate-x-0 border-l shadow-2xl" : "pointer-events-none translate-x-full"}`
            : open
              ? "border-l shadow-2xl"
              : "pointer-events-none"
          }`}
        style={
          narrow
            ? { fontFamily: "inherit" }
            : {
                fontFamily: "inherit",
                top: "var(--banner-height, 0px)",
                height: "calc(100vh - var(--banner-height, 0px))",
                width: "var(--meili-chat-width, 0px)",
                transition: dragging ? "none" : "width 200ms ease",
              }
        }
      >
        {desktop && (
          <button
            type="button"
            className="meili-chat-resize"
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize chat panel"
            aria-valuemin={MIN_WIDTH}
            aria-valuemax={MAX_WIDTH}
            aria-valuenow={width}
            tabIndex={open ? 0 : -1}
            onPointerDown={onResizePointerDown}
            onKeyDown={onResizeKeyDown}
          />
        )}
        <header
          className={`flex shrink-0 items-center justify-between ${desktop ? "h-16 px-12" : "h-14 px-5"}`}
        >
          <h2 className="meili-chat-title">
            <SparkleIcon />
            <span className="truncate">Ask Meilisearch</span>
          </h2>
          <div className="flex shrink-0 items-center gap-1">
            {messages.length > 0 && (
              <button type="button" onClick={clear} aria-label="Clear chat history" className={iconButtonClass}>
                <TrashIcon />
              </button>
            )}
            {desktop && (
              <button
                type="button"
                onClick={toggleSize}
                aria-label={maximized ? "Minimize assistant panel" : "Maximize assistant panel"}
                className={iconButtonClass}
              >
                {maximized ? <CollapseIcon /> : <ExpandIcon />}
              </button>
            )}
            <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant panel" className={iconButtonClass}>
              <CloseIcon />
            </button>
          </div>
        </header>

        <div
          ref={scrollRef}
          onScroll={(event) => {
            const el = event.currentTarget;
            stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
          }}
          className="min-w-0 flex-1 space-y-5 overflow-y-auto px-4 py-4"
        >
          {messages.length === 0 ? (
            <div className="pt-6">
              <p className="text-[15px] font-medium">Ask anything about Meilisearch</p>
              <p className="mt-1 text-[13px] text-black/60 dark:text-white/60">
                Answers come from the documentation, with links to the sources.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => submit(suggestion)}
                    className="cursor-pointer rounded-xl border border-black/10 px-3 py-2 text-left text-[13px] hover:border-brand hover:text-brand dark:border-white/10"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <Message key={message.id} message={message} streaming={busy && index === lastIndex} />
            ))
          )}

          {status === "submitted" && <p className="animate-pulse text-[13px] text-black/50 dark:text-white/50">Thinking…</p>}

          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-[13px]">
              Something went wrong.{" "}
              <button type="button" onClick={() => void regenerate()} className="cursor-pointer underline">
                Try again
              </button>
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="min-w-0 shrink-0 p-3">
          <div className="flex items-end gap-2 rounded-xl border border-black/10 px-3 py-2 focus-within:border-brand dark:border-white/10">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              maxLength={2000}
              placeholder="Ask a question…"
              className="max-h-32 min-h-6 flex-1 resize-none bg-transparent text-[14px] outline-none [field-sizing:content] placeholder:text-black/40 dark:placeholder:text-white/40"
            />
            {busy ? (
              <button
                type="button"
                onClick={() => void stop()}
                className="cursor-pointer rounded-lg bg-black/10 px-3 py-1 text-[13px] dark:bg-white/15"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="cursor-pointer rounded-lg bg-brand px-3 py-1 text-[13px] font-medium text-white disabled:cursor-default disabled:opacity-40"
              >
                Send
              </button>
            )}
          </div>
        </form>
      </aside>
    </div>
  );
}

function SparkleIcon() {
  return (
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
      className="shrink-0"
    >
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  );
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function TrashIcon() {
  return (
    <Icon>
      <path d="M3.75 5h10.5" />
      <path d="M7.25 5V3.75h3.5V5" />
      <path d="M5.25 5l.7 9.25h6.1L12.75 5" />
    </Icon>
  );
}

function ExpandIcon() {
  return (
    <Icon>
      <path d="M10.75 2.75H15.25V7.25" />
      <path d="M15.25 2.75L10.75 7.25" />
      <path d="M2.75 10.75V15.25H7.25" />
      <path d="M2.75 15.25L7.25 10.75" />
    </Icon>
  );
}

function CollapseIcon() {
  return (
    <Icon>
      <path d="M15.25 7.25H10.75V2.75" />
      <path d="M10.75 7.25L15.25 2.75" />
      <path d="M7.25 15.25V10.75H2.75" />
      <path d="M7.25 10.75L2.75 15.25" />
    </Icon>
  );
}

function CloseIcon() {
  return (
    <Icon>
      <path d="M14 4L4 14" />
      <path d="M4 4L14 14" />
    </Icon>
  );
}
