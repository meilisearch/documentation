import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { ChatMessage } from "../../shared/source";
import { readChatUser } from "../../shared/user";
import { MAX_WIDTH, MIN_WIDTH, usePanelResize } from "../hooks/usePanelResize";
import { useStickToBottom } from "../hooks/useStickToBottom";
import { useDarkMode } from "../hooks/useDarkMode";
import { TOGGLE_EVENT } from "../lib/events";
import { ChatComposer } from "./ChatComposer";
import { ChatHeader } from "./ChatHeader";
import { Message } from "./Message";

const STORAGE_KEY = "meili-chat:messages";
const DESKTOP_QUERY = "(min-width: 1024px)";
const SUGGESTIONS = [
  "How do I set up hybrid search?",
  "How do I filter by multiple values?",
  "What is the difference between an API key and a tenant token?",
];

function loadMessages(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: ChatMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Storage full or unavailable: the chat still works, it just won't persist.
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { width, dragging, asideRef, maximized, toggleSize, onResizePointerDown, onResizeKeyDown } = usePanelResize(open, desktop);
  const narrow = !desktop;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${apiBase}/api/chat`,
        // Read on each send: the widget stays mounted while the reader switches code tabs.
        body: () => ({ user: readChatUser() }),
      }),
    [apiBase],
  );
  const { messages, sendMessage, status, stop, error, regenerate, setMessages } = useChat<ChatMessage>({
    messages: loadMessages(),
    transport,
  });
  const busy = status === "submitted" || status === "streaming";
  const { scrollRef, onScroll, follow } = useStickToBottom(messages, status, open);

  // Persist only settled conversations so partial streams are not restored.
  useEffect(() => {
    if (status === "ready" || status === "error") saveMessages(messages);
  }, [messages, status]);

  useEffect(() => {
    const toggle = () => setOpen((value) => !value);
    window.addEventListener(TOGGLE_EVENT, toggle);
    return () => window.removeEventListener(TOGGLE_EVENT, toggle);
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

  const submit = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;
      follow();
      void sendMessage({ text: trimmed });
      setInput("");
    },
    [busy, follow, sendMessage],
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

  const lastIndex = messages.length - 1;

  return (
    <div className={dark ? "dark" : ""}>
      {narrow && (
        <div
          className={`fixed inset-0 z-[10000] bg-black/30 backdrop-blur-[2px] transition-opacity duration-200 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
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
        className={`fixed right-0 z-[10001] flex flex-col overflow-hidden border-black/10 bg-white text-[#191919] dark:border-white/10 dark:bg-ink-dark dark:text-white ${
          narrow
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
        <ChatHeader
          desktop={desktop}
          hasMessages={messages.length > 0}
          maximized={maximized}
          onClear={clear}
          onToggleSize={toggleSize}
          onClose={() => setOpen(false)}
        />

        <div ref={scrollRef} onScroll={onScroll} className="min-w-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
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

        <ChatComposer
          input={input}
          inputRef={inputRef}
          busy={busy}
          onChange={setInput}
          onKeyDown={onKeyDown}
          onSubmit={onSubmit}
          onStop={() => void stop()}
        />
      </aside>
    </div>
  );
}
