import type { FormEvent, KeyboardEvent, RefObject } from "react";

export function ChatComposer({
  input,
  inputRef,
  busy,
  onChange,
  onKeyDown,
  onSubmit,
  onStop,
}: {
  input: string;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  busy: boolean;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent) => void;
  onStop: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="min-w-0 shrink-0 p-3">
      <div className="flex items-end gap-2 rounded-xl border border-black/10 px-3 py-2 focus-within:border-brand dark:border-white/10">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          maxLength={2000}
          placeholder="Ask a question…"
          className="max-h-32 min-h-6 flex-1 resize-none bg-transparent text-[14px] outline-none [field-sizing:content] placeholder:text-black/40 dark:placeholder:text-white/40"
        />
        {busy ? (
          <button
            type="button"
            onClick={onStop}
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
  );
}
