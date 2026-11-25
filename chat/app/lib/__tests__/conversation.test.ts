import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadConversationId, resetConversationId } from "../conversation.ts";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loadConversationId", () => {
  it("returns the same id across calls", () => {
    const id = loadConversationId();
    expect(id).toMatch(UUID);
    expect(sessionStorage.getItem("meili-chat:conversation")).toBe(id);
    expect(loadConversationId()).toBe(id);
  });

  it("reads a stored conversation id", () => {
    sessionStorage.setItem("meili-chat:conversation", "c0ffee00-0000-4000-8000-000000000001");
    expect(loadConversationId()).toBe("c0ffee00-0000-4000-8000-000000000001");
  });

  it("replaces a missing or invalid stored id", () => {
    sessionStorage.setItem("meili-chat:conversation", "not-a-uuid");
    const id = loadConversationId();
    expect(id).toMatch(UUID);
    expect(id).not.toBe("not-a-uuid");
    expect(sessionStorage.getItem("meili-chat:conversation")).toBe(id);
    expect(loadConversationId()).toBe(id);
  });

  it("stores a new id when the conversation is reset", () => {
    const first = loadConversationId();
    const next = resetConversationId();
    expect(next).toMatch(UUID);
    expect(next).not.toBe(first);
    expect(sessionStorage.getItem("meili-chat:conversation")).toBe(next);
    expect(loadConversationId()).toBe(next);
  });

  it("keeps one id when sessionStorage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    const id = loadConversationId();
    expect(id).toMatch(UUID);
    expect(loadConversationId()).toBe(id);
    expect(resetConversationId()).toMatch(UUID);
    expect(loadConversationId()).not.toBe(id);
  });
});
