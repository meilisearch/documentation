import { useCallback, useEffect, useRef, type UIEvent } from "react";

/** Follows the stream unless the reader scrolled up. */
export function useStickToBottom(messages: unknown, status: string, open: boolean) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages, status, open]);

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
  };

  const follow = useCallback(() => {
    stickToBottom.current = true;
  }, []);

  return { scrollRef, onScroll, follow };
}
