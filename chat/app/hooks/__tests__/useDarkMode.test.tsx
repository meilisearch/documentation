import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDarkMode } from "../useDarkMode.ts";

afterEach(() => {
  document.documentElement.classList.remove("dark");
});

describe("useDarkMode", () => {
  it("follows the dark class on the document element", async () => {
    document.documentElement.classList.add("dark");
    const initial = renderHook(() => useDarkMode());
    expect(initial.result.current).toBe(true);
    initial.unmount();

    document.documentElement.classList.remove("dark");
    const { result, unmount } = renderHook(() => useDarkMode());
    expect(result.current).toBe(false);

    await act(async () => {
      document.documentElement.classList.add("dark");
    });
    expect(result.current).toBe(true);

    await act(async () => {
      document.documentElement.classList.remove("dark");
    });
    expect(result.current).toBe(false);
    unmount();
  });

  it("observes class changes on the document element", () => {
    const observe = vi.spyOn(MutationObserver.prototype, "observe");
    const { unmount } = renderHook(() => useDarkMode());

    expect(observe).toHaveBeenCalledWith(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    unmount();
    observe.mockRestore();
  });
});
