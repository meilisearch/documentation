import { afterEach, describe, expect, it, vi } from "vitest";
import { readChatUser } from "../user.ts";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("readChatUser", () => {
  it("reads the Mintlify code tab stored as a JSON string", () => {
    const getItem = vi.fn(() => JSON.stringify("JS"));
    vi.stubGlobal("localStorage", { getItem });

    expect(readChatUser()).toEqual({ codeLanguage: "JS" });
    expect(getItem).toHaveBeenCalledWith("code");
  });

  it("returns a null language when storage is missing, blank, not a string, or unreadable", () => {
    for (const raw of [
      null,
      "",
      JSON.stringify(""),
      JSON.stringify("   "),
      JSON.stringify(1),
      JSON.stringify(null),
      JSON.stringify({ codeLanguage: "JS" }),
      "not-json",
    ]) {
      vi.stubGlobal("localStorage", { getItem: () => raw });
      expect(readChatUser()).toEqual({ codeLanguage: null });
    }

    vi.stubGlobal("localStorage", {
      getItem() {
        throw new Error("storage blocked");
      },
    });
    expect(readChatUser()).toEqual({ codeLanguage: null });
  });
});
