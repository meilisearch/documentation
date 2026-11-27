import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";

const WIDTH_KEY = "meili-chat:width";
export const MIN_WIDTH = 368;
export const MAX_WIDTH = 576;

export function clampWidth(value: number) {
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, value));
}

export function loadWidth(): number {
  try {
    const raw = localStorage.getItem(WIDTH_KEY);
    const value = raw ? Number(raw) : MIN_WIDTH;
    return Number.isFinite(value) ? clampWidth(value) : MIN_WIDTH;
  } catch {
    return MIN_WIDTH;
  }
}

export function usePanelResize(open: boolean, desktop: boolean) {
  const [width, setWidth] = useState(loadWidth);
  const [dragging, setDragging] = useState(false);
  const asideRef = useRef<HTMLElement>(null);
  const stopDrag = useRef<(() => void) | null>(null);

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

  return { width, dragging, asideRef, maximized, toggleSize, onResizePointerDown, onResizeKeyDown };
}
