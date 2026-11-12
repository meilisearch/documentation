import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { OPEN_EVENT, TOGGLE_EVENT } from "./events";
import { Message } from "./Message";
import { useDarkMode } from "./useDarkMode";
import { readChatUser } from "./user";

const STORAGE_KEY = "meili-chat:messages";

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

export function ChatPanel({ apiBase }: { apiBase: string }) {
  const dark = useDarkMode();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

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

  const lastIndex = messages.length - 1;

  return (
    <div className={dark ? "dark" : ""}>
      <div
        className={`fixed inset-0 z-[10000] bg-black/30 backdrop-blur-[2px] transition-opacity duration-200 ${open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label="Ask AI"
        aria-hidden={!open}
        // Keep page shortcuts (search, navigation) from reacting to typing in the chat.
        onKeyDown={(event) => event.stopPropagation()}
        className={`fixed top-0 right-0 bottom-0 z-[10001] flex w-[min(720px,100vw)] flex-col border-l border-black/10 bg-white text-[#191919] shadow-2xl transition-transform duration-200 dark:border-white/10 dark:bg-ink-dark dark:text-white ${open ? "translate-x-0" : "pointer-events-none translate-x-full"
          }`}
        style={{ fontFamily: "inherit" }}
      >
        <header className="flex items-center justify-between border-b border-black/10 px-4 py-3 dark:border-white/10">
          <h2 className="text-[15px] font-semibold">Ask AI</h2>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clear}
                className="cursor-pointer rounded-md px-2 py-1 text-[13px] text-black/60 hover:text-brand dark:text-white/60"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="cursor-pointer rounded-md px-2 py-1 text-lg leading-none text-black/60 hover:text-brand dark:text-white/60"
            >
              ×
            </button>
          </div>
        </header>

        <div
          ref={scrollRef}
          onScroll={(event) => {
            const el = event.currentTarget;
            stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
          }}
          className="flex-1 space-y-5 overflow-y-auto px-4 py-4"
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

        <form onSubmit={onSubmit} className="border-t border-black/10 p-3 dark:border-white/10">
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
