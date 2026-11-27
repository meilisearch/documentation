import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createChatAnalytics } from "../../lib/analytics.ts";
import { MessageActions } from "../MessageActions.tsx";

const trace = {
  traceId: "4bf92f3577b34da6a3ce929d0e0e4736",
  conversationId: "c0ffee00-0000-4000-8000-000000000001",
  messageId: "msg-1",
};
const page = "http://localhost:3000/getting_started/overview";

beforeEach(() => {
  window.history.replaceState(null, "", "/getting_started/overview");
});

describe("MessageActions", () => {
  it("posts an up vote and then locks both thumbs", () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response(null, { status: 204 }));
    const analytics = createChatAnalytics({
      apiBase: "https://chat.test",
      identity: () => ({ distinctId: "ph-visitor-1", sessionId: "ph-session-1" }),
      fetch: fetchImpl,
    });
    const onFeedback = vi.fn(() => {
      expect(fetchImpl).toHaveBeenCalledTimes(1);
    });
    const view = render(
      <MessageActions
        trace={trace}
        feedback={null}
        canRegenerate
        analytics={analytics}
        onFeedback={onFeedback}
        onRegenerate={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Good response" }));

    expect(onFeedback).toHaveBeenCalledWith("up");
    const init = fetchImpl.mock.calls[0]?.[1];
    expect(fetchImpl.mock.calls[0]?.[0]).toBe("https://chat.test/api/events");
    expect(JSON.parse(String(init?.body))).toEqual({
      type: "feedback",
      rating: "up",
      traceId: "4bf92f3577b34da6a3ce929d0e0e4736",
      conversationId: "c0ffee00-0000-4000-8000-000000000001",
      messageId: "msg-1",
      distinctId: "ph-visitor-1",
      sessionId: "ph-session-1",
      url: page,
    });

    view.rerender(
      <MessageActions
        trace={trace}
        feedback="up"
        canRegenerate
        analytics={analytics}
        onFeedback={onFeedback}
        onRegenerate={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "Good response" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Good response" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Bad response" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Bad response" })).toBeDisabled();
  });

  it("regenerates only when that action is available", () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response(null, { status: 204 }));
    const analytics = createChatAnalytics({
      apiBase: "https://chat.test",
      identity: () => ({ distinctId: "ph-visitor-1", sessionId: "ph-session-1" }),
      fetch: fetchImpl,
    });
    const onRegenerate = vi.fn(() => {
      expect(fetchImpl).toHaveBeenCalledTimes(1);
    });
    const view = render(
      <MessageActions
        trace={trace}
        feedback={null}
        canRegenerate={false}
        analytics={analytics}
        onFeedback={() => {}}
        onRegenerate={onRegenerate}
      />,
    );

    expect(screen.queryByRole("button", { name: "Regenerate response" })).not.toBeInTheDocument();

    view.rerender(
      <MessageActions
        trace={trace}
        feedback={null}
        canRegenerate
        analytics={analytics}
        onFeedback={() => {}}
        onRegenerate={onRegenerate}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Regenerate response" }));
    expect(onRegenerate).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(fetchImpl.mock.calls[0]?.[1]?.body))).toEqual({
      type: "regenerate",
      traceId: "4bf92f3577b34da6a3ce929d0e0e4736",
      conversationId: "c0ffee00-0000-4000-8000-000000000001",
      messageId: "msg-1",
      distinctId: "ph-visitor-1",
      sessionId: "ph-session-1",
      url: page,
    });
  });
});
