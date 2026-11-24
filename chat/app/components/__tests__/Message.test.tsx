import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ChatMessage, Source } from "../../../shared/source.ts";
import { Message } from "../Message.tsx";

vi.mock("streamdown", () => ({
  Streamdown: ({ children }: { children?: string }) => <div data-streamdown>{children}</div>,
}));

vi.mock("../../lib/highlight.ts", () => ({ code: { name: "shiki" } }));

beforeEach(() => {
  window.history.replaceState(null, "", "/getting_started/overview");
});

function message(role: "user" | "assistant", parts: ChatMessage["parts"], sources?: Source[]): ChatMessage {
  return {
    id: role,
    role,
    parts,
    metadata: sources ? { sources } : undefined,
  };
}

describe("Message", () => {
  it("renders the text parts of a user message", () => {
    render(
      <Message
        streaming={false}
        message={message("user", [
          { type: "text", text: "Hello" },
          { type: "tool-search", toolCallId: "hidden", state: "input-available", input: { q: "query" } },
          { type: "text", text: " there" },
        ] as ChatMessage["parts"])}
      />,
    );

    expect(screen.getByText("Hello there")).toBeInTheDocument();
    expect(screen.queryByText(/Searching the docs/)).not.toBeInTheDocument();
  });

  it("describes search, release, and page tools, and lists cited sources", () => {
    const sources: Source[] = [{ title: "Filters", href: "/reference/api/search", breadcrumb: "API" }];
    render(
      <Message
        streaming={false}
        message={message(
          "assistant",
          [
            { type: "text", text: "Here is the answer." },
            {
              type: "tool-search",
              toolCallId: "search-pending",
              state: "input-available",
              input: { q: "query" },
            },
            {
              type: "tool-search",
              toolCallId: "search-done",
              state: "output-available",
              input: {},
              output: {},
            },
            {
              type: "tool-search",
              toolCallId: "search-failed",
              state: "output-error",
              input: {},
              errorText: "unavailable",
            },
            {
              type: "tool-list_releases",
              toolCallId: "releases-pending",
              state: "input-available",
              input: {},
            },
            {
              type: "tool-list_releases",
              toolCallId: "releases-done",
              state: "output-available",
              input: {},
              output: {},
            },
            {
              type: "tool-list_releases",
              toolCallId: "releases-failed",
              state: "output-error",
              input: {},
              errorText: "unavailable",
            },
            {
              type: "tool-expand_page",
              toolCallId: "expand-pending",
              state: "input-available",
              input: { page: "/getting_started/overview" },
            },
            {
              type: "tool-expand_page",
              toolCallId: "expand-done",
              state: "output-available",
              input: { page: "/getting_started/overview" },
              output: { title: "Overview" },
            },
            {
              type: "tool-expand_page",
              toolCallId: "expand-failed",
              state: "output-error",
              input: {},
              errorText: "unavailable",
            },
          ] as ChatMessage["parts"],
          sources,
        )}
      />,
    );

    expect(document.querySelector("[data-streamdown]")).toHaveTextContent("Here is the answer.");
    expect(screen.getByText("Searching the docs: \u201Cquery\u201D")).toBeInTheDocument();
    expect(screen.getByText("Searched the docs")).toBeInTheDocument();
    expect(screen.getByText("Search failed")).toBeInTheDocument();
    expect(screen.getByText("Listing releases")).toBeInTheDocument();
    expect(screen.getByText("Listed every release")).toBeInTheDocument();
    expect(screen.getByText("Could not list releases")).toBeInTheDocument();
    expect(screen.getByText("Reading the full page: /getting_started/overview")).toBeInTheDocument();
    expect(screen.getByText("Read the full page: Overview")).toBeInTheDocument();
    expect(screen.getByText("Could not read the page")).toBeInTheDocument();

    expect(screen.getByText(/1 source/)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Filters/ });
    expect(link).toHaveAttribute("href", `${window.location.origin}/reference/api/search`);
    expect(screen.getByText("API")).toBeInTheDocument();
  });
});
