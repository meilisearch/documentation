import { renderHook } from "@testing-library/react";
import type { UIEvent } from "react";
import { describe, expect, it } from "vitest";
import { useStickToBottom } from "../useStickToBottom.ts";

const SCROLL_HEIGHT = 500;
const CLIENT_HEIGHT = 100;

function renderStick() {
  const div = document.createElement("div");
  let scrollTop = 0;
  Object.defineProperty(div, "scrollHeight", { configurable: true, get: () => SCROLL_HEIGHT });
  Object.defineProperty(div, "clientHeight", { configurable: true, get: () => CLIENT_HEIGHT });
  Object.defineProperty(div, "scrollTop", {
    configurable: true,
    get: () => scrollTop,
    set: (value: number) => {
      scrollTop = value;
    },
  });

  let messages = 0;
  const hook = renderHook(
    (props: { messages: number; status: string; open: boolean }) =>
      useStickToBottom(props.messages, props.status, props.open),
    { initialProps: { messages, status: "ready", open: true } },
  );
  hook.result.current.scrollRef.current = div;

  return {
    get scrollTop() {
      return scrollTop;
    },
    setScrollTop(value: number) {
      scrollTop = value;
    },
    onScroll() {
      hook.result.current.onScroll({ currentTarget: div } as UIEvent<HTMLDivElement>);
    },
    follow() {
      hook.result.current.follow();
    },
    update() {
      messages += 1;
      hook.rerender({ messages, status: "streaming", open: true });
    },
  };
}

describe("useStickToBottom", () => {
  it("sticks within 48px of the bottom and assigns scrollTop to the scroll height", () => {
    const stick = renderStick();
    stick.setScrollTop(SCROLL_HEIGHT - CLIENT_HEIGHT - 40);
    stick.onScroll();
    stick.setScrollTop(12);
    stick.update();
    expect(stick.scrollTop).toBe(SCROLL_HEIGHT);
  });

  it("does not follow when the reader has scrolled up", () => {
    const stick = renderStick();
    stick.setScrollTop(100);
    stick.onScroll();
    stick.update();
    expect(stick.scrollTop).toBe(100);
  });

  it("follows again after follow()", () => {
    const stick = renderStick();
    stick.setScrollTop(100);
    stick.onScroll();
    stick.update();
    expect(stick.scrollTop).toBe(100);

    stick.follow();
    stick.update();
    expect(stick.scrollTop).toBe(SCROLL_HEIGHT);
  });
});
