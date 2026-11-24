import { act, renderHook } from "@testing-library/react";
import type { KeyboardEvent } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MAX_WIDTH, MIN_WIDTH, clampWidth, loadWidth, usePanelResize } from "../usePanelResize.ts";

const WIDTH_KEY = "meili-chat:width";

function key(name: string, shiftKey = false): KeyboardEvent<HTMLButtonElement> {
  return {
    key: name,
    shiftKey,
    preventDefault: vi.fn(),
  } as unknown as KeyboardEvent<HTMLButtonElement>;
}

function widthVariable(): string {
  return document.documentElement.style.getPropertyValue("--meili-chat-width");
}

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  document.documentElement.removeAttribute("style");
  delete document.documentElement.dataset.meiliChat;
  delete document.documentElement.dataset.meiliChatDragging;
});

describe("clampWidth", () => {
  it("clamps to the exported minimum and maximum", () => {
    expect(MIN_WIDTH).toBe(368);
    expect(MAX_WIDTH).toBe(576);
    expect(clampWidth(MIN_WIDTH - 1)).toBe(MIN_WIDTH);
    expect(clampWidth(400)).toBe(400);
    expect(clampWidth(MAX_WIDTH + 1)).toBe(MAX_WIDTH);
  });
});

describe("loadWidth", () => {
  it("reads meili-chat:width", () => {
    localStorage.setItem(WIDTH_KEY, "420");
    expect(loadWidth()).toBe(420);
    localStorage.setItem(WIDTH_KEY, "900");
    expect(loadWidth()).toBe(MAX_WIDTH);
  });

  it("falls back to the minimum when the value is missing or not numeric", () => {
    expect(loadWidth()).toBe(MIN_WIDTH);
    localStorage.setItem(WIDTH_KEY, "wide");
    expect(loadWidth()).toBe(MIN_WIDTH);
  });

  it("falls back to the minimum when storage throws", () => {
    localStorage.setItem(WIDTH_KEY, "420");
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });
    expect(loadWidth()).toBe(MIN_WIDTH);
  });
});

describe("usePanelResize", () => {
  it("opens on desktop by setting the document width and clears it on unmount", () => {
    localStorage.setItem(WIDTH_KEY, "420");
    const { result, unmount } = renderHook(() => usePanelResize(true, true));

    expect(result.current.width).toBe(420);
    expect(document.documentElement.dataset.meiliChat).toBe("open");
    expect(widthVariable()).toBe("420px");

    unmount();
    expect(document.documentElement.dataset.meiliChat).toBeUndefined();
    expect(document.documentElement.dataset.meiliChatDragging).toBeUndefined();
    expect(widthVariable()).toBe("0px");
  });

  it("keeps the page width at zero when the panel is closed or the viewport is narrow", () => {
    const closed = renderHook(() => usePanelResize(false, true));
    expect(document.documentElement.dataset.meiliChat).toBeUndefined();
    expect(widthVariable()).toBe("0px");
    closed.unmount();

    renderHook(() => usePanelResize(true, false));
    expect(document.documentElement.dataset.meiliChat).toBeUndefined();
    expect(widthVariable()).toBe("0px");
  });

  it("grows with ArrowLeft, shrinks with ArrowRight, and jumps with Home and End", () => {
    localStorage.setItem(WIDTH_KEY, "400");
    const { result } = renderHook(() => usePanelResize(true, true));
    expect(result.current.width).toBe(400);

    act(() => result.current.onResizeKeyDown(key("ArrowLeft")));
    expect(result.current.width).toBe(416);

    act(() => result.current.onResizeKeyDown(key("ArrowRight")));
    expect(result.current.width).toBe(400);

    act(() => result.current.onResizeKeyDown(key("ArrowLeft", true)));
    expect(result.current.width).toBe(448);

    act(() => result.current.onResizeKeyDown(key("Home")));
    expect(result.current.width).toBe(MAX_WIDTH);

    act(() => result.current.onResizeKeyDown(key("End")));
    expect(result.current.width).toBe(MIN_WIDTH);
    expect(localStorage.getItem(WIDTH_KEY)).toBe(String(MIN_WIDTH));
  });

  it("toggles between the minimum and maximum width", () => {
    localStorage.setItem(WIDTH_KEY, "400");
    const { result } = renderHook(() => usePanelResize(true, true));
    expect(result.current.maximized).toBe(false);

    act(() => result.current.toggleSize());
    expect(result.current.width).toBe(MAX_WIDTH);
    expect(result.current.maximized).toBe(true);
    expect(widthVariable()).toBe(`${MAX_WIDTH}px`);

    act(() => result.current.toggleSize());
    expect(result.current.width).toBe(MIN_WIDTH);
    expect(result.current.maximized).toBe(false);
  });
});
