import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STORED = "c0ffee00-0000-4000-8000-000000000001";

async function conversation() {
  vi.resetModules();
  return import("../conversation.ts");
}

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loadConversationId", () => {
  it("returns the same id across calls", async () => {
    const { loadConversationId } = await conversation();
    const id = loadConversationId();
    expect(id).toMatch(UUID);
    expect(sessionStorage.getItem("meili-chat:conversation")).toBe(id);
    expect(loadConversationId()).toBe(id);
  });

  it("reads a stored conversation id", async () => {
    sessionStorage.setItem("meili-chat:conversation", STORED);
    const { loadConversationId } = await conversation();
    expect(loadConversationId()).toBe(STORED);
  });

  it("replaces a missing or invalid stored id", async () => {
    sessionStorage.setItem("meili-chat:conversation", "not-a-uuid");
    const { loadConversationId } = await conversation();
    const id = loadConversationId();
    expect(id).toMatch(UUID);
    expect(id).not.toBe("not-a-uuid");
    expect(sessionStorage.getItem("meili-chat:conversation")).toBe(id);
    expect(loadConversationId()).toBe(id);
  });

  it("stores a new id when the conversation is reset", async () => {
    const { loadConversationId, resetConversationId } = await conversation();
    const first = loadConversationId();
    const next = resetConversationId();
    expect(next).toMatch(UUID);
    expect(next).not.toBe(first);
    expect(sessionStorage.getItem("meili-chat:conversation")).toBe(next);
    expect(loadConversationId()).toBe(next);
  });

  it("keeps one id when sessionStorage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const { loadConversationId, resetConversationId } = await conversation();

    const id = loadConversationId();
    expect(id).toMatch(UUID);
    expect(loadConversationId()).toBe(id);
    expect(resetConversationId()).toMatch(UUID);
    expect(loadConversationId()).not.toBe(id);
  });

  it("keeps the reset id when storage can be read but not written", async () => {
    sessionStorage.setItem("meili-chat:conversation", STORED);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("full");
    });
    const { loadConversationId, resetConversationId } = await conversation();

    expect(loadConversationId()).toBe(STORED);
    const next = resetConversationId();
    expect(next).not.toBe(STORED);
    expect(loadConversationId()).toBe(next);
  });
});
