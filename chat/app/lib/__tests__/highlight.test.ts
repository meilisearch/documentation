import { describe, expect, it } from "vitest";
import { code } from "../highlight.ts";

describe("code", () => {
  it("supports typescript and the js alias", () => {
    expect(code.supportsLanguage("typescript")).toBe(true);
    expect(code.supportsLanguage("js")).toBe(true);
    expect(code.supportsLanguage("brainfuck")).toBe(false);
    expect(code.getSupportedLanguages()).toContain("typescript");
    expect(code.getSupportedLanguages()).toContain("js");
  });

  it("highlights a typescript snippet and skips an unknown language", () => {
    const themes = code.getThemes();
    const highlighted = code.highlight({
      code: "const answer: number = 1;",
      language: "typescript",
      themes,
    });

    expect(highlighted).not.toBeNull();
    expect(highlighted?.tokens.length).toBeGreaterThan(0);
    expect(code.highlight({ code: "???", language: "brainfuck", themes })).toBeNull();
  }, 30_000);
});
